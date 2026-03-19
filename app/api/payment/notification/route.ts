import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/type/payment";
import crypto from "crypto";

export const POST = async (request: Request) => {
    try {
        const data = await request.json() as PaymentProps;
        const {
            order_id: reservationId,
            transaction_status,
            payment_type,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
        } = data;

        // Verification signature_key
        const hashString = `${reservationId}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
        const hash = crypto.createHash("sha512").update(hashString).digest("hex");

        if (signature_key !== hash) { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }) }

        let newStatus: string = "pending"

        if (transaction_status === "settlement") {
            newStatus = "paid";
        } else if (transaction_status === "capture") {
            if (fraud_status === "accept") {
                newStatus = "paid";
            } else if (fraud_status === "accept") {
                newStatus === "paid"
            } else if (fraud_status === "challenge") {
                newStatus === " pending"
            }
        } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
            newStatus = "failure;"
        }

        const updatePayment = await prisma.payment.update({
            where: { reservationId },
            data: {
                method: payment_type || null,
                status: newStatus,
            }
        });

        return NextResponse.json({ succes: true, status: newStatus }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}