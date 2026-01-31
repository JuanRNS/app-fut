import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IRequestRanking } from "@/interface/player.interface";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    try {
        const { id } = await params;

        // Fetch group with all players and their statistics to calculate ranking in memory
        // We cannot easily sort by computed relation count in Prisma without raw SQL or aggregate complexity
        // For typical group sizes, fetching all players is performant enough.
        const group = await prisma.group.findFirst({
            where: {
                id,
            },
            include: {
                players: {
                    include: {
                        statistics: true,
                    },
                },
            },
        });

        if (!group) {
            return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
        }

        // Calculate goals and map structure
        const allPlayers = group.players.map((player) => {
            return {
                id: player.id,
                name: player.name,
                goals: player.statistics.filter((statistic) => statistic.type === "GOAL").length,
            };
        });

        // Sort by goals (descending)
        allPlayers.sort((a, b) => b.goals - a.goals);

        // Paginate
        const total = allPlayers.length;
        const totalPages = Math.ceil(total / limit);
        const paginatedPlayers = allPlayers.slice(skip, skip + limit);

        const ranking: IRequestRanking = {
            players: paginatedPlayers,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };

        return NextResponse.json(ranking);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Falha ao buscar grupo" }, { status: 500 });
    }
}