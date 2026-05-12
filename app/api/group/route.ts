import { IRequestGroup } from "@/interface/group.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { parseGroupInput, readJsonObject } from "@/lib/api-validation";

export async function POST(request: Request) {
    const auth = await requireUser();
    if (auth.response) return auth.response;

    const group = parseGroupInput(await readJsonObject(request)) satisfies IRequestGroup | null;
    if (!group) {
        return NextResponse.json({ message: "Dados do grupo invalidos" }, { status: 400 });
    }

    const normalizedName = group.name.toLowerCase();

    try {
        const groupOn = await prisma.group.findFirst({
            where: {
                name: normalizedName,
                ownerId: auth.userId
            }
        })

        if (groupOn) {
            return NextResponse.json({ message: "Grupo ja existe" }, { status: 400 })
        }

        await prisma.group.create({
            data: {
                name: normalizedName,
                description: group.description,
                ownerId: auth.userId
            }
        })

        return NextResponse.json({ message: "Grupo criado com sucesso" }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Erro ao criar grupo" }, { status: 500 })
    }
}


export async function GET() {
    const auth = await requireUser();
    if (auth.response) return auth.response;

    try {
        const groups = await prisma.group.findMany({
            where: {
                ownerId: auth.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(groups, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao buscar grupos" }, { status: 500 })
    }
}
