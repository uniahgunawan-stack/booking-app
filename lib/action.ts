"use server"
import { ContactSchema, ReserveSchema, RoomSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect, } from "next/navigation";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { error } from "console";
import { differenceInCalendarDays } from "date-fns";


export const SaveRoom = async (
    image: string,
    prevState: unknown,
    formData: FormData
) => {
    if (!image) return { message: " Image Is Required." }

    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        amenities: formData.getAll("amenities"),
    };

    const validatefields = RoomSchema.safeParse(rawData);

    if (!validatefields.success) {
        return { error: validatefields.error.flatten().fieldErrors }
    }
    const { name, description, price, capacity, amenities } = validatefields.data;

    try {
        await prisma.room.create({
            data: {
                name, description, image, price, capacity, RoomAmenities: {
                    createMany: {
                        data: amenities.map((item) => ({
                            amenitiesId: item
                        }))
                    }
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
    redirect("/admin/room")
}

export const ContactMessage = async (prevState: unknown, formData: FormData) => {
    const validatefields = ContactSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatefields.success) {
        return { error: validatefields.error.flatten().fieldErrors }
    }

    const { name, email, subject, message } = validatefields.data;

    try {
        await prisma.contact.create({
            data: {
                name, email, subject, message
            }
        });
        return { message: "Thank you for Contact us" }

    } catch (error) {
        console.log(error)
    }
}

//Deleteroom

export const DeleteRoom = async (
    id: string,
    image: string,
) => {
    try {
        await del(image);
        await prisma.room.delete({
            where: { id }
        })
    } catch (error) {
        console.log(error);
    }
    revalidatePath("/admin/room")
};

// updateroom
export const updateRoom = async (
    image: string,
    roomId: string,
    prevState: unknown,
    formData: FormData
) => {
    if (!image) return { message: " Image Is Required." }

    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        amenities: formData.getAll("amenities"),
    };

    const validatefields = RoomSchema.safeParse(rawData);

    if (!validatefields.success) {
        return { error: validatefields.error.flatten().fieldErrors }
    }
    const { name, description, price, capacity, amenities, } = validatefields.data;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.roomAmenities.deleteMany({
                where: { roomId: roomId }
            });

            await tx.room.update({
                where: { id: roomId },
                data: {
                    name,
                    description,
                    image,
                    price,
                    capacity,
                }
            });

            if (amenities.length > 0) {
                await tx.roomAmenities.createMany({
                    data: amenities.map((item) => ({
                        roomId,
                        amenitiesId: item,
                    }))
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
    revalidatePath("/admin/room")
    redirect("/admin/room")
};


export const createReserve = async (
    roomId: string,
    price: number,
    startDate: Date,
    endDate: Date,
    prevState: unknown,
    formData: FormData,
) => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) redirect(`/signin?redirect_url=room/${roomId}`);
    const rawData = {
        name: formData.get("name"),
        phone: formData.get("phone")
    }

    const validatefields = ReserveSchema.safeParse(rawData);
    if (!validatefields.success) {
        return {
            error: validatefields.error.flatten().fieldErrors
        }
    }

    const { name, phone } = validatefields.data;
    const night = differenceInCalendarDays(endDate, startDate);
    if (night <= 0) return { messageDate: "Date must be at least 1 night" }
    const total = night * price;

    let reservationId;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                data: {
                    name,
                    phone,
                },
                where: { id: session.user.id }
            });

            const reservation = await tx.reservation.create({
                data: {
                    startdate: startDate,
                    endDate: endDate,
                    price: price,
                    roomId: roomId,
                    userId: session.user.id as string,
                    Payment: {
                        create: {
                            amount: total
                        }
                    }
                }
            });
            reservationId = reservation.id
        })
    } catch (error) {
        console.log(error);        
    }
    redirect(`/checkout/${reservationId}`)

}