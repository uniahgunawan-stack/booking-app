import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { reservationProps } from "@/type/reservation";
import { prisma } from "@/lib/prisma";

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export const POST = async (request: Request) => {
    try {
        const reservation = await request.json() as reservationProps;
        if (!reservation?.id || !reservation?.Payment) {
            return NextResponse.json({ error: "Data reservasi tidak lengkap" }, { status: 400 });
        }

        const payment = reservation.Payment;
        if (
            payment.snapToken &&
            payment.snapExpiry &&
            payment.snapExpiry > new Date()
        ) {
            return NextResponse.json({ token: payment.snapToken });
        }
        const parameter = {
            transaction_detail: {
                order_id: reservation.id,
                gross_amount: payment.amount
            },
            credit_card: {
                secure: true,
            },
            customer_detail: {
                first_name: reservation.User?.name || "Custemer",
                email: reservation.User?.email || "customer@example.com",
                phone: reservation.User?.phone || "",
            },
            expiry: {
                unit: "hour",
                duration: 24,
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const token = transaction.token;

        if (!token) {
            throw new Error("Gagal Mendapatkan token dari midtrans")
        };

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                snapToken: token,
                snapExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });
        return NextResponse.json({ token })
    } catch (error) {
        return NextResponse.json({
            error: "Gagal memproses pembayaran"
        }, { status: 500 })
    }
}