import { prisma } from "@/lib/prisma";
import { SignupSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = SignupSchema.safeParse(body)

        if (!validated.success) {
            const errorMsg = Object.values(validated.error.flatten().fieldErrors)
                .flat()
                .join(", ");
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }
        const { name, email, password } = validated.data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user"
            }
        });
        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "server error" }, { status: 500 })
    }
}