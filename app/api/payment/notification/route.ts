import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/type/payment";
import crypto from "crypto";
import { includes,  } from "zod";
import { warn } from "console";

export const POST = async (request: Request) => {
    try {
        const body = await request.json() as PaymentProps;
        const {
            order_id: reservationId,
            transaction_status,
            payment_type,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
        } = body;

        if(!reservationId){
            return NextResponse.json({error: "Mising order id"},{status:400})
        }

        // Verification signature_key
        const grossAmountStr = gross_amount.toString().replace(/[^0-9]/g, "");
        const hashString = `${reservationId}${status_code}${grossAmountStr}${process.env.MIDTRANS_SERVER_KEY}`;
        const hash = crypto.createHash("sha512").update(hashString).digest("hex");

        if (signature_key !== hash) { return NextResponse.json({ error: "Invalid signature" }, { status: 401 }) }

        let newStatus:string = "pending"

        if (transaction_status === "settlement") {
            newStatus = "paid";
        } else if (transaction_status === "capture") {
            if (fraud_status === "accept") {
                newStatus = "paid";
            } else if (fraud_status === "accept") {
                newStatus === "paid"
            } else if (fraud_status === "challenge") {
                newStatus === " challenge"
            } else if ( fraud_status === "deny"){
                newStatus = "failed";
            }
        } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
            newStatus = "failed;"
        } else if (transaction_status === "pending") {
            newStatus = "pending"
        }

        await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: { reservationId },
                data: {
                    method: payment_type || null,
                    status: newStatus,
                },
                include: {
                    Reservation: { include: { Room: true } }
                }
            })

            const room = updatedPayment.Reservation?.Room;
            if (!room) {
                console.warn(`Reservation ${reservationId} tidak memiliki room`);
                return;
            }

            if (newStatus === "paid") {
                if (updatedPayment.status !== "paid") {
                    if (room.stock > 0) {
                        await tx.room.update({
                            where: { id: room.id },
                            data: { stock: { decrement: 1 } },
                        });
                        console.log(`[SUCCES] stok kamar ${room.name} di kurangi - sisa ${room.stock - 1}`);
                    } else {
                        console.warn(`{WARNING} Stok ${room.name} sudah 0, tapi payment paid`);
                    }
                }
            } else if (includes(newStatus)) {
                if (updatedPayment.status === "paid") {
                    await tx.room.update({
                        where: { id: room.id },
                        data: { stock: { increment: 1 }, }
                    });
                    console.log(`[REFUND] stok kamar ${room.name} di kembalikan`);
                }
            }
        });
        return NextResponse.json(
            { success: true, status: newStatus },
            { status: 200 }
        );
    } catch (error) {
        console.error("Midtrans Notification Error", error);
        return NextResponse.json({ success: false, }, { status: 200 })

    }
}