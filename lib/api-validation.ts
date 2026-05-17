import { MatchStatisticsType, Team } from "@/generated/prisma/enums";

type JsonObject = Record<string, unknown>;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function readJsonObject(request: Request): Promise<JsonObject | null> {
  try {
    const body = await request.json();
    return isPlainObject(body) ? body : null;
  } catch {
    return null;
  }
}

export function parsePagination(url: string, fallbackLimit = DEFAULT_LIMIT) {
  const { searchParams } = new URL(url);
  const page = toPositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const requestedLimit = toPositiveInt(searchParams.get("limit"), fallbackLimit);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function parseGroupInput(input: JsonObject | null) {
  if (!input) return null;

  const name = normalizeText(input.name, 80);
  if (!name) return null;

  return {
    name,
    description: normalizeText(input.description, 240) ?? "",
  };
}

export function parsePlayerInput(input: JsonObject | null) {
  if (!input) return null;

  const name = normalizeText(input.name, 80);
  if (!name) return null;

  return { name };
}

export function parseMatchInput(input: JsonObject | null) {
  if (!input) return null;

  const teamA = parseStringArray(input.teamA);
  const teamB = parseStringArray(input.teamB);

  if (!teamA || !teamB || teamA.length !== 5 || teamB.length !== 5) {
    return null;
  }

  const playerIds = [...teamA, ...teamB];
  if (new Set(playerIds).size !== playerIds.length) {
    return null;
  }

  return { teamA, teamB, playerIds };
}

export function parseStatisticInput(input: JsonObject | null) {
  if (!input) return null;

  const matchId = normalizeText(input.matchId, 128);
  const playerId = normalizeText(input.playerId, 128);

  if (!matchId || !playerId || !isStatisticType(input.type) || !isTeam(input.team)) {
    return null;
  }

  return {
    matchId,
    playerId,
    type: input.type,
    team: input.team,
  };
}

export function parseIdInput(input: JsonObject | null) {
  if (!input) return null;
  return normalizeText(input.id, 128);
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;

  return normalized;
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return null;

  const strings = value.filter((item): item is string => typeof item === "string");
  if (strings.length !== value.length) return null;

  return strings.map((item) => item.trim()).filter(Boolean);
}

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTeam(value: unknown): value is Team {
  return value === "HOME" || value === "AWAY";
}

function isStatisticType(value: unknown): value is MatchStatisticsType {
  return value === "GOAL" || value === "ASSISTANCE" || value === "OWN_GOAL";
}
