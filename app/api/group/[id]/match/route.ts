import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parseMatchInput, parsePagination, readJsonObject } from "@/lib/api-validation";
import { Team } from "@/generated/prisma/enums";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const body = parseMatchInput(await readJsonObject(request));
    if (!body) {
        return NextResponse.json({ message: "Dados da partida invalidos" }, { status: 400 });
    }

    try {
        const playersCount = await prisma.player.count({
            where: {
                id: { in: body.playerIds },
                groupId: access.groupId,
            }
        });

        if (playersCount !== body.playerIds.length) {
            return NextResponse.json({ message: "Jogadores invalidos para este grupo" }, { status: 400 });
        }

        const match = await prisma.match.create({
            data: {
                groupId: access.groupId,
                statistics: {
                    create: []
                },
                teams: {
                    create: [
                        ...body.teamA.map((playerId: string) => ({
                            player: { connect: { id: playerId } },
                            team: Team.HOME,
                        })),
                        ...body.teamB.map((playerId: string) => ({
                            player: { connect: { id: playerId } },
                            team: Team.AWAY,
                        }))
                    ]
                }
            }
        })
        return NextResponse.json(match, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Erro ao criar partida" }, { status: 500 })
    }
}


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;
    const { page, limit, skip } = parsePagination(request.url, 10);

    try {
        const [match, count] = await Promise.all([
            prisma.match.findMany({
                where: {
                    groupId: access.groupId,
                },
                include: {
                    statistics: true,
                    teams: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.match.count({
                where: {
                    groupId: access.groupId,
                },
            })
        ])

        const response = {
            matches: match,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        }

        return NextResponse.json(response, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Erro ao buscar partida" }, { status: 500 })
    }
}
