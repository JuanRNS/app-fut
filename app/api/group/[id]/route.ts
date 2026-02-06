
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const group = await prisma.group.findFirst({
            where: {
                id
            }
        })

        if (!group) {
            return NextResponse.json({ message: "Grupo não encontrado" }, { status: 404 })
        }

        const groupResponse = {
            name: group.name,
            description: group.description,
            id: group.id
        }

        return NextResponse.json(groupResponse, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao buscar grupo" }, { status: 500 })
    }
}


