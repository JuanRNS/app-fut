import { IRequestCreateUser, IResponseUser } from "@/interface/user.interface";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const user: IRequestCreateUser = await request.json();

    const hashPassword = await bcrypt.hash(user.password, 10);

    try {
        const userOn = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if (userOn) {
            return NextResponse.json({ message: "Usuario ja existe" }, { status: 400 })
        }

        const userCreate = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashPassword
            }
        })
        return NextResponse.json(userCreate, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao criar usuario" }, { status: 500 })
    }

}