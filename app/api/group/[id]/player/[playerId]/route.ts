import { IRequestPlayer } from "@/interface/player.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
    const { id, playerId } = await params;
    try {
        const players = await prisma.player.findUnique({
            where: {
                id: playerId,
                groupId: id
            }
        });
        return NextResponse.json(players, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar jogador" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
    const { id, playerId } = await params;
    const player: IRequestPlayer = await request.json();
    try {
        const players = await prisma.player.update({
            where: {
                id: playerId,
                groupId: id
            },
            data: {
                name: player.name
            }
        });
        return NextResponse.json(players, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao atualizar jogador" }, { status: 500 })
    }
}