import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const authHeader = request.headers.get('authorization');
    
    // Validasi Secret Key
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();

        // 1. Cari ID reservasi yang memang sudah expired dan belum dibayar
        const expiredReservations = await prisma.reservation.findMany({
            where: {
                Payment: {
                    status: "unpaid",
                    snapExpiry: {
                        lt: now,
                    }
                }
            },
            select: { id: true }
        });

        if (expiredReservations.length === 0) {
            return NextResponse.json({ success: true, message: "Tidak ada data expired" });
        }

        const idsToDelete = expiredReservations.map(res => res.id);

        // 2. Hapus berdasarkan kumpulan ID tersebut
        const deleted = await prisma.reservation.deleteMany({
            where: {
                id: {
                    in: idsToDelete
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: `${deleted.count} reservasi expired berhasil dihapus`
        });
    } catch (error) {
        // Gunakan console.error untuk debug di Vercel Logs
        console.error("Cron cleanup error:", error);
        return NextResponse.json({ error: "Gagal membersihkan data" }, { status: 500 });
    }
}