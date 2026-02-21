import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IResponseRanking } from "@/interface/player.interface";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const filter = searchParams.get('filter') || 'all';
        const { id } = await params;

        let dateFilter = undefined;
        if (filter === 'daily') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateFilter = { gte: today };
        } else if (filter === 'monthly') {
            const firstDayOfMonth = new Date();
            firstDayOfMonth.setDate(1);
            firstDayOfMonth.setHours(0, 0, 0, 0);
            dateFilter = { gte: firstDayOfMonth };
        }

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
                                ...(dateFilter ? { createdAt: dateFilter } : {})
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