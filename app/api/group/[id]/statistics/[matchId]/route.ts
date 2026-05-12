import { requireOwnedGroup } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string, matchId: string }> }) {
    const { id, matchId } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const [statistics, match] = await Promise.all([
        prisma.matchStatistics.findMany({
            where: {
                matchId,
                match: {
                    groupId: access.groupId,
                }
            },
            include: {
                player: true
            }
        }),
        prisma.match.findUnique({
            where: {
                id: matchId,
                groupId: access.groupId,
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
