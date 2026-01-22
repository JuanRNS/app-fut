import { Team } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = await params;
    try {
        const match = await prisma.match.findUnique({
            where: {
                id: matchId
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
            return NextResponse.json({ message: "Partida não encontrada" }, { status: 404 })
        }

        const playersIds: {
            playerId: string,
            goals: number,
            team: Team
        }[] = [];
        (await match).statistics.forEach(statistic => {
            if (statistic.type === 'GOAL') {
                const player = playersIds.find(player => player.playerId === statistic.playerId)
                if (player) {
                    player.goals++
                } else {
                    playersIds.push({ playerId: statistic.playerId, goals: 1, team: statistic.team })
                }
            }
        })

        const players = await prisma.player.findMany({
            where: {
                id: {
                    in: playersIds.map(player => player.playerId)
                }
            }
        })

        const playerResponse = players.map(player => {
            const playerGoals = playersIds.find(playerIds => playerIds.playerId === player.id)
            return {
                ...player,
                goals: playerGoals?.goals || 0,
                team: playerGoals?.team || ''
            }
        })

        const teamHomeGoals = (await match).statistics.filter(statistic => statistic.team === 'HOME').length;
        const teamAwayGoals = (await match).statistics.filter(statistic => statistic.team === 'AWAY').length;

        const response = {
            match,
            goalsHome: teamHomeGoals,
            goalsAway: teamAwayGoals,
            players: playerResponse
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar partida" }, { status: 500 })
    }
}



export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, matchId: string }> }) {
    const { id, matchId } = await params;
    try {
        const match = await prisma.match.delete({
            where: {
                id: matchId,
                groupId: id
            }
        })
        return NextResponse.json(match, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Erro ao deletar partida" }, { status: 500 })
    }
}