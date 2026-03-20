"use client"

import { PaymentStatusProps } from "@/type/countdown"
import CountDown from "@/components/countdown";
import { HiFaceSmile } from "react-icons/hi2";

const PaymentStatus = ({ status, expiryDate, reservationId }: PaymentStatusProps) => {
  // Handle kasus undefined/null
  const currentStatus = status || "unknown";
  const now = new Date();
  const isExpired = expiryDate && new Date(expiryDate) <= now;

  // Tentukan tampilan berdasarkan status
  if (currentStatus === "paid") {
    return (
      <div className=" bg-green-100 gap-2 rounded-sm font-bold  py-3 items-center justify-center flex">
        <p className="text-sm text-center text-green-700">Thank you! Payment successful. Enjoy your room.</p>
        <HiFaceSmile className="size-5 text-orange-400"/>
      </div>
    );
  }

  if (currentStatus === "unpaid") {
    if (!expiryDate) {
      // Belum pernah generate Snap token
      return (
        <div className="text-blue-700 bg-blue-100 rounded-sm font-medium text-center py-3 text-sm">
          The reservation is pending payment processing. Click "Pay Now" to continue.
        </div>
      );
    }

    if (isExpired) {
      // Sudah generate Snap tapi expired
      return (
        <div className="text-red-700 bg-red-100 rounded-sm font-bold text-center py-3 text-sm">
          Pembayaran kadaluarsa. Silakan booking ulang atau hubungi support.
        </div>
      );
    }

    // Masih unpaid + expiry > now → tampil countdown
    return (
      <div className="text-red-500 bg-red-100 rounded-sm font-bold text-center py-2 text-sm flex flex-col items-center gap-1">
        <span>Please make payment immediately to secure your reservation</span>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-gray-600">Ends in :</span>
          <CountDown expiryDate={expiryDate} reservationId={reservationId} />
        </div>
      </div>
    );
  }

  // Status lain: failed, cancel, expire, dll
  return (
    <div className="text-gray-700 bg-gray-100 rounded-sm font-medium text-center py-3 text-sm">
      Status: {currentStatus.toUpperCase()} — Reservasi tidak aktif. Hubungi support jika diperlukan.
    </div>
  );
};

export default PaymentStatus;