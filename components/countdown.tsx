"use client"

import { CountdownProps } from "@/type/countdown"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const CountDown = ({
    expiryDate, reservationId
}: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        const target = new Date(expiryDate).getTime();

        const updateCountdown = async () => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance <= 0) {
                if (isMounted) setTimeLeft("Expired");
                try {
                    const res = await fetch(`/api/reservation/delete/${reservationId}`, {
                        method: 'DELETE'
                    });
                    
                    if (res.ok && isMounted) {
                        router.refresh();
                    }
                } catch (error) {
                    console.error("Failed to delete reservation:", error);
                }
                return true;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (isMounted) {
                setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
            }
            return false;
        };

        updateCountdown();

        const interval = setInterval(async () => {
            const isExpired = await updateCountdown();
            if (isExpired) clearInterval(interval);
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [expiryDate, reservationId, router]);

    return (
        <span className="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
            {timeLeft || "Loading..."}
        </span>
    )
}

export default CountDown;