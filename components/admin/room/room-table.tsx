import { getRoom } from "@/lib/data"
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import { DelleteButton, EditButton } from "@/components/admin/room/button";


const RoomTable = async () => {
    const room = await getRoom();
    if (!room?.length) return <p>No Room Found</p>

    return (
        <div className="bg-white p-4 shadow-sm mt-5">
            <table className='w-full divide-y divide-gray-200'>
                <thead>
                    <tr>
                        <th className='px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left'>
                            Image
                        </th>
                        <th className='px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left'>
                            Room Name
                        </th>
                        <th className='px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left'>
                            Price
                        </th>
                        <th className='px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left'>
                            Craeted At
                        </th>
                        <th className='px-6 py-3 text-sm font-bold text-gray-700 uppercase'>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {room.map((room) => (
                        <tr className='hover:bg-gray-100' key={room.id}>
                            <td className='px-6 py-4'>
                                <div className="h-20 w-32 relative">
                                    <Image src={room.image} fill sizes="20vw"
                                        alt="room image" className="object-cover" />
                                </div>
                            </td>
                            <td className='px-6 py-4'>{room.name}</td>
                            <td className='px-6 py-4'>{formatCurrency(room.price)}</td>
                            <td className='px-6 py-4'>{formatDate(room.createdAt.toString())}</td>
                            <td className='px-6 py-4 text-right'>
                                <div className="flex items-center justify-center gap-1">
                                    <EditButton id={room.id} />
                                    <DelleteButton id={room.id} image={room.image} />
                                </div>

                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default RoomTable