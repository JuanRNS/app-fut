import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

type AuthResult =
  | { userId: string; response?: never }
  | { response: NextResponse; userId?: never };

type GroupAccessResult =
  | { userId: string; groupId: string; response?: never }
  | { response: NextResponse; userId?: never; groupId?: never };

export async function requireUser(): Promise<AuthResult> {
  try {
    return { userId: await getSession() };
  } catch {
    return {
      response: NextResponse.json({ message: "Nao autorizado" }, { status: 401 }),
    };
  }
}

export async function requireOwnedGroup(groupId: string): Promise<GroupAccessResult> {
  const auth = await requireUser();

  if (auth.response) {
    return { response: auth.response };
  }

  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      ownerId: auth.userId,
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return {
      response: NextResponse.json({ message: "Grupo nao encontrado" }, { status: 404 }),
    };
  }

  return { userId: auth.userId, groupId: group.id };
}
