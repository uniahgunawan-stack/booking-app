import RoomDetail from "@/components/room-detail";
import Roomdetailskeleton from "@/components/skeleton/roomdetailskeleton";
import { Metadata } from "next"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Room Detail"
}

const RoomDetailPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ roomId: string }>
    searchParams: Promise<{ name?: string; phone?: string }>
}) => {
    const roomId = (await params).roomId;
    const { name = "", phone = "" } = await searchParams
    return (
        <div className="mt-16">
            <Suspense fallback={<Roomdetailskeleton />}>
                <RoomDetail
                    roomId={roomId}
                    initialName={name}
                    initialPhone={phone} />
            </Suspense>

        </div>
    )
}

export default RoomDetailPage