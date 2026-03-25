"use server"
import { ContactSchema, ReserveSchema, RoomSchema, SignupSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect, } from "next/navigation";
import { del, put, PutBlobResult } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { differenceInCalendarDays } from "date-fns";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { FormState } from "@/type/signupType";
import { resolve } from "path";
import { success } from "zod";



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

export const SaveRoom = async (
    // image:string,
    prevState: any,
    formData: FormData
) => {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        amenities: formData.getAll("amenities"),
        stock: formData.get("stock")
    };
    const file = formData.get('image') as File

    if (!file || file.size === 0) {
        return {
            message: "Image is required",
            prevState: rawData
        }
    }

    let imageUrl: string;
    try {
        const { url } = await put(file.name || `room-${Date.now}.jpg`, file, {
            access: 'public',
        })
        imageUrl = url
    } catch (error) {
        console.error("Upload error", error);
        return { message: "Gagal upload gambar ke server",prevState:rawData }
    }



    const validatefields = RoomSchema.safeParse(rawData);

    if (!validatefields.success) {
        return {
            error: validatefields.error.flatten().fieldErrors,
            success: false,
            prevState: rawData
        }
    }
    const { name, description, price, capacity, amenities, stock } = validatefields.data;

    try {
        await prisma.room.create({
            data: {
                name, description, image: imageUrl, price, capacity, stock, RoomAmenities: {
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
    revalidatePath("/admin/room")
    redirect("/admin/room")
}

// updateroom
export const updateRoom = async (
    // image: string,
    // roomId: string,
    prevState: any,
    formData: FormData
) => {
     const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        amenities: formData.getAll("amenities"),
        stock: formData.get("stock"),
    };


    const file = formData.get("image") as File
    const imageStatus = (formData.get("imageStatus") as string || "unchanged")

    const originalImage = formData.get("originalImage") as string;
    const roomId = formData.get("roomId") as string

    let finalImageUrl = originalImage;
    console.log("image old:", originalImage);


    if (imageStatus === "new" && file && file.size > 0) {
        const { url } = await put(file.name || `room-${Date.now()}.jpg`, file, {
            access: "public",
            multipart: true,
            allowOverwrite: true
        });
        finalImageUrl = url
        if (originalImage) {
            try {
                await del(originalImage)
            } catch (error) {
                console.error("Gagal Hapus gambar lama", error);

            }
        }
    }
    else if (imageStatus === "removed") {
        if (originalImage) {
            try {
                await del(originalImage)
            } catch (error) {
                console.error("Gagal hapus gambar lama", error);

            }
        } finalImageUrl = "";
    }
    if (!finalImageUrl) return { message: "Image is Required", prevState:rawData }

   
    const validatefields = RoomSchema.safeParse(rawData);

    if (!validatefields.success) {
        return { error: validatefields.error.flatten().fieldErrors,
            success:false,
            prevState:rawData
         }
    }
    const { name, description, price, capacity, amenities, stock } = validatefields.data;

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
                    image: finalImageUrl,
                    price,
                    capacity,
                    stock,
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

export async function signupActions(
    prevState: unknown, formData: FormData
): Promise<FormState> {
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validatefields = SignupSchema.safeParse(data);

    if (!validatefields.success) {
        return {
            success: false,
            message: "Gagal memvalidasi",
            errors: validatefields.error.flatten().fieldErrors
        }
    };
    const { name, email, password } = validatefields.data;
    const exisUser = await prisma.user.findUnique({
        where: { email }
    });

    if (exisUser) {
        return {
            success: false,
            message: "Gagal dafter",
            errors: { email: ["Email ini sudah terdafatar"] }
        }
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "user"
        }
    });
    return {
        success: true,
        message: "Email berhasil di daftarkan",
        errors: {}
    }
}

