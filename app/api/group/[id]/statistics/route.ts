import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { matchId, playerId, type, team } = await request.json();

    try {
        const statistics = await prisma.matchStatistics.create({
            data: {
                matchId,
                playerId,
                type,
                team
            },
        });

        return NextResponse.json(statistics);
    } catch (error) {
        return NextResponse.json({ error: "Falha ao criar estatística" }, { status: 500 });
    }
}