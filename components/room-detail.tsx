import Image from "next/image"
import { getRoomDetailById, getDisableRoomById } from "@/lib/data"
import { notFound } from "next/navigation";
import { IoBan, IoCheckmark, IoPeopleOutline } from "react-icons/io5";
import { formatCurrency } from "@/lib/utils";
import ReserveForm from "@/components/reserve-form";

const RoomDetail = async ({
    roomId,
    initialName = "",
    initialPhone = ""
}: {
    roomId: string,
    initialName?: string,
    initialPhone?: string
}) => {
    const [room, disableDate] = await Promise.all([getRoomDetailById(roomId), getDisableRoomById(roomId)]);
    if (!room || !disableDate) return notFound();
    return (
        <div className="max-w-7xl p-16 px-4 grid lg:grid-cols-12 gap-8 mx-auto">
            {/* 1 */}
            <div className="md:col-span-8">
                <Image
                    src={room.image}
                    alt={room.name}
                    width={770} height={430}
                    priority
                    className="w-full rounded-sm mb-8"
                />
                <h1 className="text-5xl font-semibold text-gray-900 mb-8">{room.name}</h1>
                <p className="whitespace-pre-wrap mb-4">{room.description}</p>
                <h5 className="text-lg font-bold py-1 mt-1 ">Amenities :</h5>
                <div className="grid md:grid-cols-3">
                    {room.RoomAmenities.map((item) => (
                        <div className="flex gap-1 py-1"
                            key={item.id}
                        >
                            <IoCheckmark className="size-5" />
                            <span>{item.Amenities.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* 2 */}
            <div className="md:col-span-4">
                <div className="border-2 border-gray-300 border-dashed px-3 py-5 bg-slate-50 rounded-md">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                            <IoPeopleOutline className="size-4" />
                            <span>{room.capacity} {room.capacity === 1 ? "Person" : "People"}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl font-semibold text-gray-600">{formatCurrency(room.price)}</span>
                            <span className="text-gray-400 text-sm">/Night</span>
                        </div>
                    </div>
                    {/* Reservation form */}
                    {room.stock === 0 ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-red-600">
                            <IoBan className="size-12" />
                            <span className="font-bold text-xl uppercase tracking-wide">Room Not Available</span>
                            <p className="text-sm text-center text-gray-900">Sorry, this room is out of stock</p>
                        </div>
                    ) :
                        (
                            <ReserveForm
                                room={room}
                                disableDate={disableDate}
                                initialName={initialName}
                                initialPhone={initialPhone} />
                        )}

                </div>
            </div>
        </div>
    )
}

export default RoomDetail