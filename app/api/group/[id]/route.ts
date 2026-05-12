
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parseGroupInput, readJsonObject } from "@/lib/api-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const group = await prisma.group.findFirst({
            where: {
                id: access.groupId
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
    } catch {
        return NextResponse.json({ message: "Erro ao buscar grupo" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const group = parseGroupInput(await readJsonObject(request));
    if (!group) {
        return NextResponse.json({ message: "Dados do grupo invalidos" }, { status: 400 });
    }

    try {
        const updatedGroup = await prisma.group.update({
            where: {
                id: access.groupId
            },
            data: {
                name: group.name.toLowerCase(),
                description: group.description,
            }
        });

        return NextResponse.json(updatedGroup, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Erro ao editar grupo" }, { status: 500 });
    }
}


