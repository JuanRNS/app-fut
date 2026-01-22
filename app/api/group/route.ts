import { IRequestGroup } from "@/interface/group.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";

export async function POST(request: Request) {
    const group: IRequestGroup = await request.json();
    const userId = await getSession();

    try {
        const groupOn = await prisma.group.findFirst({
            where: {
                name: group.name
            }
        })

        if (groupOn) {
            return NextResponse.json({ message: "Grupo ja existe" }, { status: 400 })
        }

        await prisma.group.create({
            data: {
                name: group.name.trim().toLowerCase(),
                description: group.description,
                ownerId: userId
            }
        })

        return NextResponse.json({ message: "Grupo criado com sucesso" }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao criar grupo" + error }, { status: 500 })
    }
}


export async function GET(request: Request) {
    try {
        const groups = await prisma.group.findMany()
        return NextResponse.json(groups, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar grupos" }, { status: 500 })
    }
}