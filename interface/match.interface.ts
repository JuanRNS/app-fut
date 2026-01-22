import { Team } from "@/generated/prisma/enums";
import { IResponseMatchStatistics } from "./modal-statistics.interface";
import { IPlayer, IResponsePlayerMatch } from "./player.interface";

export interface IMatch {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    groupId: string;
    statistics: IResponseMatchStatistics[];
    teams: IMatchPlayer[];
}

export interface IMatchInterfaceProps {
    players: IPlayer[];
    onFinish: () => void;
    groupId: string;
}

export interface IMatchResponseDetails {
    match: IMatch[];
    goalsHome: number;
    goalsAway: number;
    players: IResponsePlayerMatch[];
}

export interface IMatchPlayer {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    playerId: string;
    matchId: string;
    team: Team;
    player?: IPlayer;
}


export interface IMatchResponse {
    matches: IMatch[];
    pagination: IPagination;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}