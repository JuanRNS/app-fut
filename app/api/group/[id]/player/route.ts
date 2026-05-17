import { IRequestPlayer } from "@/interface/player.interface";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireOwnedGroup } from "@/lib/api-auth";
import { parsePlayerInput, parsePagination, readJsonObject } from "@/lib/api-validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const player = parsePlayerInput(await readJsonObject(request)) satisfies IRequestPlayer | null;
    if (!player) {
        return NextResponse.json({ message: "Dados do jogador invalidos" }, { status: 400 });
    }

    try {
        const players = await prisma.player.create({
            data: {
                name: player.name,
                groupId: access.groupId
            }
        });

        return NextResponse.json(players, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Erro ao criar jogador" }, { status: 500 })
    }
}


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const { page, limit, skip } = parsePagination(request.url, 10);
    const search = new URL(request.url).searchParams.get("search")?.trim() ?? "";

    const where = {
        groupId: access.groupId,
        ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    };

    try {
        const [players, total] = await Promise.all([
            prisma.player.findMany({
                where,
                orderBy: { name: "asc" },
                skip,
                take: limit,
            }),
            prisma.player.count({ where }),
        ]);

        return NextResponse.json({
            players,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Erro ao buscar jogadores" }, { status: 500 })
    }
}
