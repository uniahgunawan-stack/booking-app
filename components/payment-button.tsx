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
                    throw new Error("Token tidak valid atau tidak ditemukan");
                }
                console.log("token yang di terima", token);
                

                if (typeof window.snap === "undefined" || !window.snap.pay) {
                    throw new Error("Snap.js belum siap. Refresh halaman dan coba lagi.");
                }
                window.snap.pay(token, {
                    onSuccess: (result) => {
                        console.log("Payment Success:", result);
                        window.location.reload();
                    },
                    onPending: (result) => {
                        console.log("Payment Pending:", result);
                        window.location.reload();
                    },
                    onError: (result) => {
                        console.error("Payment Error:", result);
                        setError({ type: "general", message: "Pembayaran gagal. Silakan coba lagi." });
                    },
                    onClose: () => {
                        console.log("Popup ditutup oleh user");
                    },
                });

            } catch (err: any) {
                console.error("Payment button error:", err); 
                setError({
                    type: "general",
                    message: err.message || "Terjadi kesalahan saat proses pembayaran",
                });
            }
        });
    };
    if (error) {
        if (error.type === "out_of_stock") {
            return <StockError roomName={error.roomName} />;
        }}

    return (
        <div
            onClick={handlePayment}
            className="px-10 py-4 mt-2 text-center font-semibold text-white
    bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer" >
            {isPending ? "Proccesing.." : "Procces Payment"}
        </div>
    )
}

export default PaymentButton;