import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IResponseRanking } from "@/interface/player.interface";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const { id } = await params;

        const players = await prisma.player.findMany({
            where: {
                groupId: id,
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        statistics: {
                            where: {
                                type: "GOAL",
                            },
                        },
                    },
                },
            },
        });

        const sortedPlayers = players.sort((a, b) => b._count.statistics - a._count.statistics);

        const totalItems = sortedPlayers.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPlayers = sortedPlayers.slice(startIndex, endIndex);

        const ranking: IResponseRanking = {
            players: paginatedPlayers.map(player => ({
                id: player.id,
                name: player.name,
                goals: player._count.statistics,
            })),
            pagination: {
                page,
                limit,
                total: totalItems,
                totalPages,
            },
        };

        return NextResponse.json(ranking);
    } catch (error) {
        return NextResponse.json({ error: "Falha ao buscar ranking" }, { status: 500 });
    }
}