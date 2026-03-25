import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/type/payment";
import crypto from "crypto";

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
            } else if (fraud_status === "challenge") {
                newStatus = "challenge";
            } else if (fraud_status === "deny") {
                newStatus = "failed";
            }
        } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
            newStatus = "failed";
        } else if (transaction_status === "pending") {
            newStatus = "pending";
        }

        await prisma.$transaction(async (tx) => {
            // Ambil data lama DULU sebelum update
            const paymentBefore = await tx.payment.findUnique({
                where: { reservationId },
                include: { Reservation: { include: { Room: true } } }
            });

            if (!paymentBefore) {
                throw new Error(`Payment untuk reservation ${reservationId} tidak ditemukan`);
            }

            const updatedPayment = await tx.payment.update({
                where: { reservationId },
                data: {
                    method: payment_type || null,
                    status: newStatus,
                },
            });

            const room = paymentBefore.Reservation?.Room;
            if (!room) {
                console.warn(`Reservation ${reservationId} tidak memiliki room`);
                return;
            }

            // Logic stock yang benar
            if (newStatus === "paid" && paymentBefore.status !== "paid") {
                if (room.stock > 0) {
                    await tx.room.update({
                        where: { id: room.id },
                        data: { stock: { decrement: 1 } },
                    });
                    console.log(`[SUCCESS] stok ${room.name} dikurangi, sisa ${room.stock - 1}`);
                }
            } 
            // Refund stock kalau status berubah ke failed/cancel dari paid
            else if (["failed", "challenge"].includes(newStatus) && paymentBefore.status === "paid") {
                await tx.room.update({
                    where: { id: room.id },
                    data: { stock: { increment: 1 } },
                });
                console.log(`[REFUND] stok ${room.name} dikembalikan`);
            }
        });

        return NextResponse.json({ success: true, status: newStatus }, { status: 200 });
    } catch (error) {
        console.error("Midtrans Notification Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 200 });
    }
};