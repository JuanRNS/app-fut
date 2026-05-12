import { requireOwnedGroup } from "@/lib/api-auth";
import { parseIdInput, parseStatisticInput, readJsonObject } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const input = parseStatisticInput(await readJsonObject(request));
    if (!input) {
        return NextResponse.json({ error: "Dados da estatistica invalidos" }, { status: 400 });
    }

    try {
        const [match, player] = await Promise.all([
            prisma.match.findFirst({
                where: {
                    id: input.matchId,
                    groupId: access.groupId,
                },
                select: { id: true },
            }),
            prisma.player.findFirst({
                where: {
                    id: input.playerId,
                    groupId: access.groupId,
                },
                select: { id: true },
            }),
        ]);

        if (!match || !player) {
            return NextResponse.json({ error: "Partida ou jogador invalidos" }, { status: 400 });
        }

        const statistics = await prisma.matchStatistics.create({
            data: {
                matchId: input.matchId,
                playerId: input.playerId,
                type: input.type,
                team: input.team
            },
        });

        return NextResponse.json(statistics);
    } catch {
        return NextResponse.json({ error: "Falha ao criar estatistica" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const access = await requireOwnedGroup(id);
    if (access.response) return access.response;

    const statisticId = parseIdInput(await readJsonObject(request));
    if (!statisticId) {
        return NextResponse.json({ error: "Dados da estatistica invalidos" }, { status: 400 });
    }

    try {
        await prisma.matchStatistics.delete({
            where: {
                id: statisticId,
                match: {
                    groupId: access.groupId,
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Falha ao deletar estatistica" }, { status: 500 });
    }
}
