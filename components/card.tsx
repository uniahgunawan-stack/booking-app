import { formatCurrency } from "@/lib/utils";
import { Room } from "@prisma/client";
import Image from "next/image"
import Link from "next/link"
import { IoPeopleOutline } from "react-icons/io5";

const Card = ({ room }: { room: Room }) => {
    return (
        <div className="bg-white shadow-lg rounded-sm transition duration-100 hover:shadow-sm">
            <div className="h-60 w-auto rounded-t-sm relative overflow-hidden">
                <Link href={`/room/${room.id}`}>
                    <Image src={room.image}
                        fill
                        priority
                        alt="roomimage"
                        className="w-full h-full object-cover rounded-t-sm " />
                </Link>
            </div>

            <div className="p-8">
                <h4 className="text-2xl font-medium">
                    <Link href={`/room/${room.id}`}
                        className="hover:text-gray-800 duration-75">{room.name}
                    </Link>
                </h4>
                <h4 className="space-x-2 text-2xl flex items-center ">
                    <span className={`text-lg ${room.stock === 0 ? "text-sm":"text-green-600"}`}>
                        {room.stock === 0 ? "Available Room":"Available Room"} :
                    </span>
                    <span className={`font-semibold ${room.stock === 0 ? 'text-red-600 text-xl' : 'text-gray-600'}`}>
                        {room.stock === 0 ? "Sold Out" : room.stock}
                    </span>
                </h4>
                <h4 className="text-2xl mb-7">
                    <span className="font-semibold text-gray-600">{formatCurrency(room.price)}</span>
                    <span className="text-gray-400 text-sm">/Night</span>
                </h4>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <IoPeopleOutline />
                        <span>{room.capacity} {room.capacity === 1 ? "Person" : "People"} </span>
                    </div>
                    <Link href={`/room/${room.id}`}
                        className="px-6 py2.5 md:px-10 md:py-3 font-semibold text-white bg-orange-400 rounded-sm hover:bg-orange-500 transition duration-150">
                        Book Now</Link>
                </div>
            </div>
        </div>
    )
}

export default Card