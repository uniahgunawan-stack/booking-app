"use client"

import { reservationProps } from "@/type/reservation"
import { error } from "console";
import { useTransition } from "react";

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

    const handlePayment = async () => {
        startTransition(async () => {
            try {
                const response = await fetch("/api/payment", {
                    method: "POST",
                    body: JSON.stringify(reservation)
                });
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const data = await response.json()
                const token = data.token;
                if (!token || typeof token !== "string") {
                    throw new Error("Token tidak valid atau tidak di temukan")
                }
                if (typeof window.snap === "undefined" || !window.snap.pay) {
                    throw new Error("snap.js belum siap")
                }

                window.snap.pay(token);

            } catch (error) {
                console.log(error);

            }
        })
    }
    return (
        <div
            onClick={handlePayment}
            className="px-10 py-4 mt-2 text-center font-semibold text-white
    bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer" >
         {isPending ? "Proccesing..": "Procces Payment"}   
        </div>
    )
}

export default PaymentButton