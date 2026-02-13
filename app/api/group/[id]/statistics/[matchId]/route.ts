import { prisma } from "@/lib/prisma";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string, matchId: string }> }) {
    const { id, matchId } = await params;

    const [statistics, match] = await Promise.all([
        prisma.matchStatistics.findMany({
            where: {
                matchId,
            },
            include: {
                player: true
            }
        }),
        prisma.match.findUnique({
            where: {
                id: matchId
            },
            include: {
                teams: {
                    include: {
                        player: true
                    }
                }
            }
        })
    ])
    const responseStatistics = statistics.map((stat) => {
        return {
            id: stat.id,
            type: stat.type,
            team: stat.team,
            player: stat.player.name,
            playerId: stat.playerId
        }
    })
    const responseMatch = match?.teams.map((team) => {
        return {
            team: team
        }
    })
    return NextResponse.json({ statistics: responseStatistics, match: responseMatch });
}