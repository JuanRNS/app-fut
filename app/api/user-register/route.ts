import { IRequestCreateUser, IResponseUser } from "@/app/interface/user.interface";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const usuario: IRequestCreateUser = await request.json();

    const hashPassword = await bcrypt.hash(usuario.password, 10);

    try {
        const usuarioCriado = await prisma.user.create({
            data: {
                name: usuario.name,
                email: usuario.email,
                password: hashPassword
        }
    })
    return NextResponse.json(usuarioCriado, {status: 201})
    }catch(error){
        return NextResponse.json({message: "Erro ao criar usuario"}, {status: 500})
    }

}