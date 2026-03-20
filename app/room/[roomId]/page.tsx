import RoomDetail from "@/components/room-detail";
import Roomdetailskeleton from "@/components/skeleton/roomdetailskeleton";
import { Metadata } from "next"
import { Suspense } from "react";

export const metadata:Metadata ={
    title:"Room Detail"
}

const RoomDetailPage = async ({
    params
}: {
    params: Promise<{roomId: string}>
}) => {
    const roomId = (await params).roomId;
  return (
    <div className="mt-16">
        <Suspense fallback={<Roomdetailskeleton/>}>
            <RoomDetail roomId={roomId}/>
        </Suspense>
        
    </div>
  )
}

export default RoomDetailPage