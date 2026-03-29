import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { reservationProps } from "@/type/reservation";
import { prisma } from "@/lib/prisma";

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

// Tambah CoreApi untuk cancel & cek status
const core = new Midtrans.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export const POST = async (request: Request) => {
    try {
        const reservation: reservationProps = await request.json();

        if (!reservation?.id || !reservation?.Payment || !reservation?.roomId) {
            return NextResponse.json({ error: "Data reservasi tidak lengkap" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({
            where: { id: reservation.roomId },
            select: { stock: true, name: true },
        });

        if (!room) {
            return NextResponse.json({ error: "Kamar tidak ditemukan" }, { status: 404 });
        }

        if (room.stock <= 0) {
            return NextResponse.json({
                error: "Maaf, kamar ini sudah dipesan oleh tamu lain",
                roomName: room.name,
            }, { status: 409 });
        }

        const payment = reservation.Payment;
        const orderId = reservation.id;

        // === 1. REUSE TOKEN JIKA MASIH VALID ===
        if (
            payment.snapToken &&
            payment.snapExpiry &&
            new Date(payment.snapExpiry) > new Date()
        ) {
            console.log("✅ Reuse existing snap token");
            return NextResponse.json({ token: payment.snapToken });
        }

        // === 2. TOKEN EXPIRED / BELUM ADA → CANCEL DULU KALAU PENDING ===
        console.log("🔄 Token expired atau belum ada, cek status transaksi...");

        let shouldCreateNew = true;

        try {
            const status = await core.transaction.status(orderId);

            if (status.transaction_status === "unpaid") {
                console.log("🛑 Transaksi pending → cancel dulu");
                await core.transaction.cancel(orderId);
                console.log("✅ Transaksi lama berhasil di-cancel");
            } else if (["settlement", "capture"].includes(status.transaction_status)) {
                return NextResponse.json({
                    error: "Pembayaran sudah berhasil sebelumnya",
                }, { status: 400 });
            }
        } catch (err: any) {
            // Kalau belum ada transaksi sama sekali (404), aman buat baru
            if (err.message?.includes("404") || err.ApiResponse?.status_code === "404") {
                console.log("✅ Belum ada transaksi sebelumnya");
            } else {
                console.error("Error cek status/cancel:", err);
            }
        }

        // === 3. BUAT TRANSAKSI BARU ===
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: reservation.Payment?.amount || 0,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                first_name: reservation.User?.name || "Customer",
                email: reservation.User?.email || "customer@example.com",
                phone: reservation.User?.phone || "",
            },
            expiry: {
                unit: "hour",
                duration: 24,
            },
        };

        const transaction = await snap.createTransaction(parameter);
        const token = transaction.token;

        if (!token) {
            throw new Error("Gagal mendapatkan token dari Midtrans");
        }

        // Update DB dengan token baru + expiry baru
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                snapToken: token,
                snapExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        console.log("✅ Snap token baru berhasil dibuat");
        return NextResponse.json({ token });

    } catch (error: any) {
        console.error("Error generate snap token:", error);

        // Tangkap error spesifik Midtrans
        if (error.httpStatusCode === 400 && error.ApiResponse?.error_messages?.includes("sudah digunakan")) {
            return NextResponse.json({
                error: "Order ID sudah digunakan. Sistem sedang memperbaiki transaksi lama...",
            }, { status: 400 });
        }

        return NextResponse.json({
            error: "Gagal memproses pembayaran. Silakan coba lagi.",
        }, { status: 500 });
    }
};