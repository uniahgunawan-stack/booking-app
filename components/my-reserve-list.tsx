import { getReservationUserById } from "@/lib/data"
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import Image from "next/image"
import Link from "next/link";
import PaymentStatus from "./PaymentStatus";
import ReservationEmpty from "@/components/reservation-empty";

const MyReserveList = async () => {
    const reservation = await getReservationUserById();
    if (!reservation || reservation.length === 0) {
        return <ReservationEmpty />
    }
    return (
        <div>
            {reservation.map((item) => {
                const payment = item.Payment;
                const hasPayment = !!payment;
                const isPaid = payment?.status === "paid";
                const isCanceling = payment?.status === "cancelled";
                const isUnpaidWithExpiry = payment?.status === "unpaid" && payment?.snapExpiry && new Date(payment.snapExpiry) > new Date();
                const isExpired = payment?.status === "unpaid" && payment?.snapExpiry && new Date(payment.snapExpiry) <= new Date();
                const isPendingNoSnap = !hasPayment || (payment?.status === "unpaid" && !payment?.snapExpiry);
                const isOutOfStock = payment?.status === "unpaid" && item.Room.stock === 0;

                let displayStatus = "Unknown";

                if (isPaid) displayStatus = "Paid";
                else if (isOutOfStock) displayStatus = "Out Of Stock"
                else if (isUnpaidWithExpiry) displayStatus = "Pending Payment";
                else if (isExpired) displayStatus = "Expired";
                else if (isPendingNoSnap) displayStatus = "Waiting for Payment";
                else if (isCanceling) displayStatus = "cancelled"

                return (
                    <div className="bg-white shadow pb-4 mb-4 md:pb-0 relative" key={item.id}>
                        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 px-2 py-1 rounded-t-sm ">
                            <h1 className="text-sm font-medium text-gray-900 truncate">Reservation Id :#{item.id}</h1>
                            <div className="flex gap-1 px3 py-2 text-sm font-normal">
                                <span>Status :</span>
                                <span className="font-bold uppercase">{item.Payment?.status}</span>
                            </div>
                        </div>
                        <div className="flex flex-col mb-4 items-start bg-white rounded-sm md:flex-row md:w-full space-x-2 p-2">
                            <Image
                                src={item.Room.image}
                                width={500}
                                height={300}
                                className="object-cover w-full rounded-t-sm h-60 md:w-1/3 md: rounded-none md: rounded-s-sm"
                                alt="Image room"
                            />
                            {/* detail reservatiaon */}
                            <div className="flex items-center gap-1 mb-3 font-normal text-gray-700 w-full">
                                <div className="pt-2 md:pt-0 w-full">
                                    <PaymentStatus
                                        status={item.Payment?.status}
                                        expiryDate={item.Payment?.snapExpiry}
                                        reservationId={item.id}
                                        roomStock={item.Room.stock}
                                    />
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Room Name :</span>
                                        <span>{item.Room.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Price :</span>
                                        <span>{formatCurrency(item.price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Arrival :</span>
                                        <span>{formatDate(item.startdate.toISOString())}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Departure :</span>
                                        <span>{formatDate(item.endDate.toISOString())}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Duration :</span>
                                        <span>{differenceInCalendarDays(item.endDate, item.startdate)}
                                            <span className="ml-1">Night</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
                                        <span>Sub Total :</span>
                                        <span>{item.Payment && formatCurrency(item.Payment.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ButtonPay */}
                        <div className="flex justify-center items-end md:items-end md:justify-end absolute inset-3 capitalize">
                            
                            {isOutOfStock ? (
                                <Link
                                    href={`/room`}
                                    className="px-6 py-1 bg-blue-500  text-white rounded-md hover:bg-blue-600"
                                >
                                    other rooms
                                </Link>
                            ) : 
                             isExpired ? (
                                <Link
                                    href={`/rooms/${item.Room.id}?name=${encodeURIComponent(item.User?.name || "")}&phone=${encodeURIComponent(item.User?.phone || "")}`}
                                    className="px-6 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Expired - Book Again
                                </Link>
                            
                             ):isPaid ? (
                                <Link
                                    href={`/myreservation/${item.id}`}
                                    className="px-6 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    View Detail
                                </Link>
                            ) : isUnpaidWithExpiry ? (
                                <Link
                                    href={`/checkout/${item.id}`}
                                    className="px-6 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                >
                                    Finished Payment
                                </Link>
                            ) : isPaid ? (
                                <Link
                                    href={`/myreservation/${item.id}`}
                                    className="px-6 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    View Detail
                                </Link>
                            ) : isPendingNoSnap ? (
                                <Link
                                    href={`/checkout/${item.id}`}
                                    className="px-6 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Pay Now
                                </Link>
                            ) : isCanceling ? (
                                <Link
                                    href={`/room/${item.Room.id}?name=${encodeURIComponent(item.User?.name || '')}&phone=${encodeURIComponent(item.User?.phone || '')}`}
                                    className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-1 rounded-lg"
                                >
                                    Reservation again
                                </Link>
                            ) : (
                                <Link
                                    href={`/myreservation/${item.id}`}
                                    className="px-6 py-1 bg-gray-500 text-white rounded-md"
                                >
                                    View Detail
                                </Link>
                            )}
                        </div>
                    </div>
                )
            }
            )}
        </div >
    )
}

export default MyReserveList