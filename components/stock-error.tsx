"use client"

import Link from "next/link";
import { useRouter } from "next/navigation"
import { useEffect, } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

interface StockErrorProps {
    message?: string,
    roomName?: string,
}

const StockError = ({ message, roomName }: StockErrorProps) => {
    
    const router = useRouter();
    const defaultMessage = roomName
        ? `Sayang sekali, kamar${roomName} yang anda pesan sudah habis terpesan oleh tamu lain`
        : `Sayang sekali, kamar yang anda pesan habis atau ada kendala jaringan `;

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/room")
        }, 5000);
        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="max-w-7xl mx-auto mt-12 p-8 bg-white border border-red-200 rounded-lg shadow text-center">
            <div className="mb-6 ">
                <p className="text-orange-400 items-center justify-center flex mb-2">
                    <IoAlertCircleOutline className="w-20 h-20 bg-orange-200 rounded-full" />
                </p>
                <h2 className=" text-4xl font-bold text-red-600 mb-8">Pembayaran tidak dapat di lanjutkan</h2>

                <p className="text-2xl text-gray-700 mb-4">{message || defaultMessage}</p>

                <p className="text-gray-600 mb-8 text-lg">Silahkan pilih kamar lain yang masih tersedia atau coba lagi nanti</p>
                <div className="flex flex-col justify-center items-center">
                    <Link
                    href="/room"
                    className="
                text-2xl
                inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-8 rounded-md transition duration-200">
                    Lihat kamar lainya
                </Link>
                <span className="mt-2 text-sm text-gray-500">
                    Anda akan di arahkan otomatis dalam 5 detik...
                </span>
                </div>
                
            </div>
        </div>
    )
}

export default StockError;