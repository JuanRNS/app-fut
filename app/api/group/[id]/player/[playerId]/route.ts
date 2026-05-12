import { IRequestPlayer } from "@/interface/player.interface";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parsePlayerInput, readJsonObject } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
    const { id, playerId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const player = await prisma.player.findUnique({
            where: {
                id: playerId,
                groupId: access.groupId
            }
        });

        return NextResponse.json(player, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao buscar jogador" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
    const { id, playerId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const player = parsePlayerInput(await readJsonObject(request)) satisfies IRequestPlayer | null;
    if (!player) {
        return NextResponse.json({ message: "Dados do jogador invalidos" }, { status: 400 });
    }

    try {
        const updatedPlayer = await prisma.player.update({
            where: {
                id: playerId,
                groupId: access.groupId
            },
            data: {
                name: player.name
            }
        });

        return NextResponse.json(updatedPlayer, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao atualizar jogador" }, { status: 500 })
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
    const { id, playerId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const player = await prisma.player.delete({
            where: {
                id: playerId,
                groupId: access.groupId
            }
        });

        return NextResponse.json(player, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao deletar jogador" }, { status: 500 })
    }
}
