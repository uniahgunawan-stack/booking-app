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
        const reservation: reservationProps = await request.json()
        if (!reservation?.id || !reservation?.Payment || reservation?.roomId) {
            return NextResponse.json({ error: "Data reservasi tidak lengkap" }, { status: 409 });
        }

        const room = await prisma.room.findUnique({
            where :{ id: reservation.roomId},
            select :{ stock: true, name: true},
        });
        if (!room) {
            return NextResponse.json({error: "Kamar tidak di temukan"},{status:404})
        }
        if(room.stock <= 0) {
            return NextResponse.json({
                error:"Maaf, kamar ini sudah di pesan oleh tamu lain",roomName: room.name,
            },{status:409});
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
            transaction_details: {
                order_id: reservation.id,
                gross_amount: reservation.Payment?.amount || 0,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
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
        console.error("Error generate snap token", error);
        
        return NextResponse.json({
            error: "Gagal memproses pembayaran"
        }, { status: 500 })
    }
}