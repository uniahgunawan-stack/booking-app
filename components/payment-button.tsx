"use client"

import { reservationProps } from "@/type/reservation"
import { useState, useTransition } from "react";
import StockError from "@/components/stock-error";

declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                }
            ) => void;
        }
    }
}

const PaymentButton = ({ reservation }: { reservation: reservationProps }) => {
    const [isPending, startTransition] = useTransition();
    const [isCancelling, startCancelTransition] = useTransition();
    const [error, setError] = useState<
        | { type: "out_of_stock"; roomName?: string }
        | { type: "general"; message: string }
        | null
    >(null);

    const handlePayment = () => {
        startTransition(async () => {
            setError(null);
            try {
                const response = await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reservation),
                });

                const data = await response.json();

                if (response.status === 409) {
                    setError({ type: "out_of_stock", roomName: data.roomName });
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error: ${response.status}`);
                }

                const token = data.token;
                if (!token || typeof token !== "string") {
                    throw new Error("Token tidak valid");
                }

                if (typeof window.snap === "undefined" || !window.snap.pay) {
                    throw new Error("Snap.js belum siap");
                }

                window.snap.pay(token, {
                    onSuccess: (result) => {
                        console.log("Payment Success:", result);
                        window.location.href = `/payment/success?order_id=${reservation.id}`;
                    },
                    onPending: (result) => {
                        console.log("Payment Pending:", result);
                        window.location.href = `/payment/success?order_id=${reservation.id}&status=pending`;
                    },
                    onError: (result) => {
                        console.error("Payment Error:", result);
                        window.location.href = `/payment/failure?order_id=${reservation.id}`;
                    },
                    onClose: () => {
                        console.log("Popup ditutup");
                    },
                });

            } catch (err: any) {
                console.error("Payment error:", err);
                setError({
                    type: "general",
                    message: err.message || "Terjadi kesalahan saat proses pembayaran",
                });
            }
        });
    };

    const handleCancel = () => {
        if (!confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) return;

        startCancelTransition(async () => {
            try {
                const response = await fetch(`/api/reservation/cancel`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reservationId: reservation.id }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Gagal membatalkan reservasi");
                }

                alert("Reservasi berhasil dibatalkan");
                window.location.href = "/myreservation";
            } catch (err: any) {
                console.error("Cancel error:", err);
                alert(err.message || "Gagal membatalkan reservasi. Silakan coba lagi.");
            }
        });
    };

    if (error) {
        if (error.type === "out_of_stock") {
            return <StockError roomName={error.roomName} />;
        }
        return (
            <div className="px-10 py-4 mt-2 text-center font-semibold text-red-600 bg-red-100 rounded-sm border border-red-300">
                ❌ {error.message}
                <button onClick={() => setError(null)} className="mt-3 text-sm underline block mx-auto">
                    Coba lagi
                </button>
            </div>
        );
    }

    const isPaid = reservation.Payment?.status === "paid";
    const canCancel = reservation.Payment?.status === "unpaid" || !reservation.Payment?.snapToken;

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3">
            {!isPaid && (
                <div
                    onClick={handlePayment}
                    className="px-10 w-full py-4 text-center font-semibold text-white bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer transition"
                >
                    {isPending ? "Processing..." : "Proceed to Payment"}
                </div>
            )}

            {canCancel && (
                <div
                    onClick={handleCancel}
                    className="px-10 py-4 w-full text-center font-semibold text-red-600 bg-red-100 hover:bg-red-200 border border-red-300 rounded-sm cursor-pointer transition"
                >
                    {isCancelling ? "Cancelling..." : "Cancel Reservation"}
                </div>
            )}

            {isPaid && (
                <div className="px-10 py-4 text-center font-semibold text-green-600 bg-green-100 rounded-sm">
                    Payment Completed ✓
                </div>
            )}
        </div>
    );
};

export default PaymentButton;