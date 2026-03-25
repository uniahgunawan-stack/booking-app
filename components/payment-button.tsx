"use client"

import { reservationProps } from "@/type/reservation"
import { useState, useTransition } from "react";
import StockError from "@/components/stock-error";

declare global {
    interface Window {
        snap: {
            pay: (token: string, options?: any) => void;
        }
    }
}
const PaymentButton = (
    {
        reservation
    }: { reservation: reservationProps }) => {
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
                    body: JSON.stringify(reservation)
                });;
                
                const data = await response.json()
                if (response.status === 409) {
                    setError({
                        roomName: data.roomName,
                        type: "out_of_stock",
                    });
                    return;
                }
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const token = data.token;

                if (!token || typeof token !== "string") {
                    throw new Error("Token tidak valid atau tidak di temukan")
                }

                if (typeof window.snap === "undefined" || !window.snap.pay) {
                    throw new Error("snap.js belum siap")
                }

                window.snap.pay(token);

            } catch (err: any) {
                console.log(error);
                setError({
                    type: "general",
                    message: err.message || "Terjadi kesalahan saat proses pembayaran"
                })
            }
        });
    };

    if (error) {
        if (error.type === "out_of_stock") {
            return <StockError roomName={error.roomName} />
        }
    }

    return (
        <div
            onClick={handlePayment}
            className="px-10 py-4 mt-2 text-center font-semibold text-white
    bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer" >
            {isPending ? "Proccesing.." : "Procces Payment"}
        </div>
    )
}

export default PaymentButton