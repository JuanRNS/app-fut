import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IResponseRanking } from "@/interface/player.interface";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parsePagination } from "@/lib/api-validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const { searchParams } = new URL(request.url);
        const { page, limit } = parsePagination(request.url, 10);
        const filter = searchParams.get('filter') || 'all';

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
                groupId: access.groupId,
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
    } catch {
        return NextResponse.json({ error: "Falha ao buscar ranking" }, { status: 500 });
    }
}
