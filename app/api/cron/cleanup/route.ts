import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();
        const deleted = await prisma.reservation.deleteMany({
            where: {
                Payment: {
                    status: "unpaid",
                    snapExpiry: {
                        lt: now,
                    }
                }
            }
        })
        return NextResponse.json({
            success: true,
            message: `${deleted.count} reservasi expired berhasil di hapus`
        });
    } catch (error) {
        console.error("Cron cleanup error", error);
        return NextResponse.json({ error: "Gagal membersihkan data" }, { status: 500 })
    }
}