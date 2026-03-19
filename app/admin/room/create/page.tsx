
import CreateRoom from "@/components/admin/room/create-room";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata:Metadata = {
    title:"create-room"
}

const CreateRoomPage = () => {
  return (
    <div className="max-w-7xl px-4 py-16 mt-10 mx-auto">
        <Suspense>
            <CreateRoom/>
        </Suspense>
        
    </div>
  )
}

export default CreateRoomPage