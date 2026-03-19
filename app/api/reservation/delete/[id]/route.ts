import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function DELETE (req: Request,{params}:{params:{id: string}}){
    try {
        const id = params.id;
        const reservation = await prisma.reservation.findUnique({
            where: {id},
            include:{ Payment: true}
        });
        if(!reservation){
            return NextResponse.json({error:"Reservation not Found"},{status: 400})
        }
        if (reservation.Payment?.status === "unpaid") {
            await prisma.reservation.delete({
                where: {id}
            });
            return NextResponse.json({message: "Expired reservation deleted successfull"},{status: 200})
        }
        return NextResponse.json({message:"Reservation is already paid, not deleted"})
    } catch (error) {
        console.error("Deleted error:", error);
        return NextResponse.json({error: "Failed to deletes"} ,{status: 500})
    }
}