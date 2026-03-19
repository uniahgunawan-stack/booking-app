"use client"

import { PaymentStatusProps } from "@/type/countdown"
import CountDown from "@/components/countdown";

const PaymentStatus = ({ status, expiryDate, reservationId }: PaymentStatusProps) => {

    if (status === "paid") {
        return (
            <div className="text-green-700 bg-green-100 rounded-sm font-bold text-center py-3 text-sm">Thank yuo purchase enjoy your Room </div>
        );
    }

    return (
        <div className="text-red-500 bg-red-100 rounded-sm font-bold text-center py-1 text-sm flex-col flex items-center">
            <span>Please make payment for your room immediately</span>
            {expiryDate && (
                <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                    <span className=" text-gray-600">Berakhir dalam :</span>
                    <CountDown
                        expiryDate={expiryDate}
                       reservationId={reservationId}
                    />
                </div>
            )}
        </div>
    )
}

export default PaymentStatus