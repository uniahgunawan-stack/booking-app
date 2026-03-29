// app/api/payment/notification/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { PaymentProps } from "@/type/payment";   // ← INI YANG BARU

export const POST = async (request: Request) => {
  console.log("🔥 WEBHOOK MIDTRANS DITERIMA");

  const data: PaymentProps = await request.json();   // ← pakai interface

  const {
    order_id: reservationId,
    transaction_status,
    payment_type,
    fraud_status,
    status_code,
    gross_amount,
    signature_key,
  } = data;

  console.log(`📌 Order ID: ${reservationId} | Status: ${transaction_status}`);

  // === SIGNATURE VERIFICATION ===
  const hash = crypto
    .createHash("sha512")
    .update(`${reservationId}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  if (signature_key !== hash) {
    console.error("❌ Signature key INVALID!");
    return NextResponse.json({ success: false }, { status: 200 });
  }

  console.log("✅ Signature OK");

  // === TENTUKAN STATUS BARU ===
  let newStatus = "pending";
  if (transaction_status === "settlement") {
    newStatus = "paid";
  } else if (transaction_status === "capture") {
    newStatus = fraud_status === "accept" ? "paid" : "failed";
  } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
    newStatus = "failed";
  } else if (transaction_status === "pending") {
    newStatus = "pending";
  }

  // === UPDATE DB + STOK ROOM ===
  try {
    await prisma.$transaction(async (tx) => {
      const paymentBefore = await tx.payment.findUnique({
        where: { reservationId },
        include: {
          Reservation: { include: { Room: true } },
        },
      });

      if (!paymentBefore) {
        throw new Error(`Payment ${reservationId} tidak ditemukan`);
      }

      // Update payment
      await tx.payment.update({
        where: { reservationId },
        data: {
          method: payment_type,
          status: newStatus,
        },
      });

      const room = paymentBefore.Reservation?.Room;

      // Kurangi stok kalau baru jadi paid
      if (newStatus === "paid" && paymentBefore.status !== "paid" && room?.stock > 0) {
        await tx.room.update({
          where: { id: room.id },
          data: { stock: { decrement: 1 } },
        });
        console.log(`📦 Stok room ${room.id} dikurangi 1`);
      }
      // Kembalikan stok kalau gagal dan sebelumnya sudah paid
      else if (["failed", "challenge"].includes(newStatus) && paymentBefore.status === "paid" && room) {
        await tx.room.update({
          where: { id: room.id },
          data: { stock: { increment: 1 } },
        });
        console.log(`📦 Stok room ${room.id} dikembalikan +1`);
      }
    });

    console.log(`🎉 BERHASIL update → ${newStatus}`);
    return NextResponse.json({ success: true, status: newStatus }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error update DB:", err.message);
    return NextResponse.json({ success: false }, { status: 200 });
  }
};