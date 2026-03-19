import HeaderSection from "@/components/header-section"
import Main from "@/components/main"
import RoomSkeleton from "@/components/room-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Room & Rate",
    description: " Choose your best today"
}


const RoomPage = () => {
    return (
        <div>
            <HeaderSection title="Rooms & Rate" subTitle="Lorem ipsum dolor sit amet." />
            <div className="mt-10 px-4 ">
                <Suspense fallback={<RoomSkeleton />}>
                    <Main />
                </Suspense>

            </div>
        </div>
    )
}

export default RoomPage