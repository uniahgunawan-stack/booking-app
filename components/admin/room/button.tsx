import { DeleteRoom } from "@/lib/action";
import Link from "next/link";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

export const EditButton = ({ id }: { id: string; }) => {
    return (
        <Link  href={`/admin/room/edit/${id}`} className="rounded-sm p-1 hover:bg-gray-200">
            <IoPencilOutline className="size-4"/>
        </Link> 
    )
}

export const DelleteButton = ({ id, image }: { id: string; image: string }) => {
    const deletRoomId = DeleteRoom.bind(null, id, image)
    return (
        <form action={deletRoomId}>
            <button type="submit"
                className="rounded-sm hover:bg-gray-200 cursor-pointer">
                <IoTrashOutline className="size-4" />
            </button>
        </form>
    )
}