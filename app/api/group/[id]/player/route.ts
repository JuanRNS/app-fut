import { IRequestPlayer } from "@/interface/player.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const player: IRequestPlayer = await request.json();
    try {
        const players = await prisma.player.create({
            data: {
                name: player.name,
                groupId: id
            }
        });

        return NextResponse.json(players, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao criar jogador" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const players = await prisma.player.delete({
            where: {
                id
            }
        });

        return NextResponse.json(players, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao deletar jogador" }, { status: 500 })
    }
}