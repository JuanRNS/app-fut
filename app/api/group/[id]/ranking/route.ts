import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const group = await prisma.group.findUnique({
            where: {
                id,
            },
            include: {
                players: {
                    include: {
                        statistics: true,
                    },
                },
                matches: true,
            },
        });

        const players = group?.players.map((player) => {
            return {
                id: player.id,
                name: player.name,
                goals: player.statistics.filter((statistic) => statistic.type === "GOAL").length,
            };
        });

        return NextResponse.json(players);
    } catch (error) {
        return NextResponse.json({ error: "Falha ao buscar grupo" }, { status: 500 });
    }
}