import { IResponseUser } from "@/app/interface/user.interface";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/jwt";

export async function POST(request: Request) {
    const user: IResponseUser = await request.json();

    const userOn = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if (!userOn) {
        return NextResponse.json({message: "Usuario nao encontrado"}, {status: 404})
    }

    const isPasswordValid = await bcrypt.compare(user.password, userOn.password);

    if (!isPasswordValid) {
        return NextResponse.json({message: "Senha invalida"}, {status: 401})
    }

    await createSession(userOn.id);

    return NextResponse.json({message: "Login realizado com sucesso"}, {status: 200})
}