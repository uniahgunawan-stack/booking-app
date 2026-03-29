import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
    try {
        const { reservationId } = await request.json();

        if (!reservationId) {
            return NextResponse.json({ error: "Reservation ID diperlukan" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: { reservationId },
                include: { Reservation: { include: { Room: true } } },
            });

            if (!payment) {
                throw new Error("Reservasi tidak ditemukan");
            }

            if (payment.status === "paid") {
                throw new Error("Tidak dapat membatalkan reservasi yang sudah dibayar");
            }

            // Update status payment jadi cancelled
            await tx.payment.update({
                where: { reservationId },
                data: { status: "cancelled", },
            });
        });

        return NextResponse.json({ success: true, message: "Reservasi berhasil dibatalkan" });
    } catch (error: any) {
        console.error("Cancel reservation error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};