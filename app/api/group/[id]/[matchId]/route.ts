import { Team } from "@/generated/prisma/enums";
import { requireOwnedGroup } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string, matchId: string }> }) {
    const { id, matchId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const match = await prisma.match.findUnique({
            where: {
                id: matchId,
                groupId: access.groupId
            },
            include: {
                statistics: true,
                teams: {
                    include: {
                        player: true
                    }
                },
            }
        })
        if (!match) {
            return NextResponse.json({ message: "Partida nao encontrada" }, { status: 404 })
        }

        const playersStats: {
            playerId: string,
            goals: number,
            ownGoals: number,
            team: Team
        }[] = [];

        match.statistics.forEach(statistic => {
            if (statistic.type === 'GOAL') {
                const player = playersStats.find(player => player.playerId === statistic.playerId)
                if (player) {
                    player.goals++
                } else {
                    playersStats.push({ playerId: statistic.playerId, goals: 1, ownGoals: 0, team: statistic.team })
                }
            } else if (statistic.type === 'OWN_GOAL') {
                const player = playersStats.find(player => player.playerId === statistic.playerId)
                if (player) {
                    player.ownGoals++
                } else {
                    playersStats.push({ playerId: statistic.playerId, goals: 0, ownGoals: 1, team: statistic.team })
                }
            }
        })

        const players = await prisma.player.findMany({
            where: {
                id: {
                    in: playersStats.map(player => player.playerId)
                }
            }
        })

        const playerResponse = players.map(player => {
            const playerStats = playersStats.find(playerIds => playerIds.playerId === player.id)
            return {
                ...player,
                goals: playerStats?.goals || 0,
                ownGoals: playerStats?.ownGoals || 0,
                team: playerStats?.team || ''
            }
        }).filter(p => p.goals > 0 || p.ownGoals > 0);

        const teamHomeGoals = match.statistics.filter(statistic =>
            (statistic.team === 'HOME' && statistic.type === 'GOAL') ||
            (statistic.team === 'AWAY' && statistic.type === 'OWN_GOAL')
        ).length;

        const teamAwayGoals = match.statistics.filter(statistic =>
            (statistic.team === 'AWAY' && statistic.type === 'GOAL') ||
            (statistic.team === 'HOME' && statistic.type === 'OWN_GOAL')
        ).length;

        const response = {
            match,
            goalsHome: teamHomeGoals,
            goalsAway: teamAwayGoals,
            players: playerResponse
        }

        return NextResponse.json(response, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao buscar partida" }, { status: 500 })
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string, matchId: string }> }) {
    const { id, matchId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    try {
        const match = await prisma.match.delete({
            where: {
                id: matchId,
                groupId: access.groupId
            }
        })
        return NextResponse.json(match, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao deletar partida" }, { status: 500 })
    }
}
