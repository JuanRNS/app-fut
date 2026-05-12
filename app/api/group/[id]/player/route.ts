import { IRequestPlayer } from "@/interface/player.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parsePlayerInput, readJsonObject } from "@/lib/api-validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const player = parsePlayerInput(await readJsonObject(request)) satisfies IRequestPlayer | null;
    if (!player) {
        return NextResponse.json({ message: "Dados do jogador invalidos" }, { status: 400 });
    }

    try {
        const players = await prisma.player.create({
            data: {
                name: player.name,
                groupId: access.groupId
            }
        });

        return NextResponse.json(players, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Erro ao criar jogador" }, { status: 500 })
    }
}


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const players = await prisma.player.findMany({
            where: {
                groupId: access.groupId
            },
            orderBy: {
                name: "asc"
            }
        });
        return NextResponse.json(players, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao buscar jogadores" }, { status: 500 })
    }
}
