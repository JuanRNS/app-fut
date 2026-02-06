import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const { teamA, teamB } = body;

    try {
        const match = await prisma.match.create({
            data: {
                groupId: id,
                statistics: {
                    create: []
                },
                teams: {
                    create: [
                        ...teamA.map((playerId: string) => ({ playerId, team: 'HOME' })),
                        ...teamB.map((playerId: string) => ({ playerId, team: 'AWAY' }))
                    ]
                }
            }
        })
        return NextResponse.json(match, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao criar partida" }, { status: 500 })
    }
}


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const limitNumber = parseInt(searchParams.get("limit") || "10");

    const skip = (pageNumber - 1) * limitNumber;

    try {
        const match = await prisma.match.findMany({
            where: {
                groupId: id,
            },
            include: {
                statistics: true,
                teams: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: skip,
            take: limitNumber,
        })
        const count = await prisma.match.count({
            where: {
                groupId: id,
            },
        })

        const response = {
            matches: match,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total: count,
                totalPages: Math.ceil(count / limitNumber)
            }
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Erro ao buscar partida" }, { status: 500 })
    }
}