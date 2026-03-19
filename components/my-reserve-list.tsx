import { getReservationUserById } from "@/lib/data"
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import Image from "next/image"
import Link from "next/link";
import { notFound } from "next/navigation";



const MyReserveList = async () => {
    const reservation = await getReservationUserById();
    if (!reservation) return notFound();
    return (
        <div className="">
            {reservation.map((item) => (
                <div className="bg-white shadow pb-4 mb-4 md:pb-0 relative" key={item.id}>
                    <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-t-sm ">
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
                        <div className="flex items-center gap-1 mb-3 font-normal text-gray-700 w-full">
                            <div className="w-full">
                                {item.Payment?.status === "paid" ? (
                                    <div className="text-green-700 bg-green-100 rounded-sm font-bold text-center py-3 text-sm">Thank yuo purchase enjoy your Room </div>
                                ) : (
                                    <div className="text-red-500 bg-red-100 rounded-sm font-bold text-center py-3 text-sm">Please make payment for your room immediately </div>
                                )}
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
                    <div className="flex items-end justify-end absolute inset-4">
                        {item.Payment?.status === "unpaid" ? (
                            <Link
                                href={`/checkout/${item.id}`}
                                className="px-6 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500  "
                            >Pay Now</Link>
                        ) : (
                            <Link
                                href={`/myreservation/${item.id}`}
                                className="px-5 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500  "
                            >View Detail</Link>
                        )}
                    </div>
                </div>
            ))}

        </div>
    )
}

export default MyReserveList