import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { teamA, teamB } = body;

    try {
        const match = await prisma.match.create({
            data: {
                groupId: id,
                statistics: {
                    create: []
                },
                teams: {
                    create: [
                        ...teamA.map((playerId: string) => ({ playerId, team: 'HOME' })),
                        ...teamB.map((playerId: string) => ({ playerId, team: 'AWAY' }))
                    ]
                }
            }
        })
        return NextResponse.json(match, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao criar partida" }, { status: 500 })
    }
}