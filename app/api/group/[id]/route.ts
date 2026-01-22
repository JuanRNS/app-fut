
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    try {
        const [group, matches, total, players] = await Promise.all([
            prisma.group.findFirst({
                where: {
                    id
                }
            }),
            prisma.match.findMany({
                where: {
                    groupId: id
                },
                include: {
                    statistics: true,
                    teams: {
                        include: {
                            player: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.match.count({
                where: {
                    groupId: id
                }
            }),
            prisma.player.findMany({
                where: {
                    groupId: id
                }
            })
        ])

        const totalPages = Math.ceil(total / limit);
        const groupDetail = {
            name: group?.name,
            description: group?.description,
            id: group?.id
        }

        const matchesDetail = {
            group: groupDetail,
            matches: matches,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            players
        }

        return NextResponse.json(matchesDetail, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao buscar grupo" }, { status: 500 })
    }
}


