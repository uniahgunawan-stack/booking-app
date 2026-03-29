export interface CountdownProps {
    expiryDate: Date | string,
    reservationId : string;
}

export interface PaymentStatusProps{
    status: string | undefined,
    expiryDate: Date | null | undefined,
    reservationId: string;
    roomStock: number
}