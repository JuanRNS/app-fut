import { Team } from "@/generated/prisma/enums";
import { IPagination } from "./pagination.interface";

export interface IPlayer {
    id: string;
    name: string;
}

export interface IPlayerMatch extends IPlayer {
    team: Team;
}


export interface IRequestPlayer {
    name: string;
}

export interface PlayerCardProps {
    name: string;
    id: string;
    onClick?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    isMatch?: boolean;
    isSelected?: boolean;
}


export interface IResponsePlayerRanking extends IPlayer {
    goals: number;
    name: string;
}

export interface IResponseRanking {
    players: IResponsePlayerRanking[];
    pagination: IPagination;
}

export interface IResponsePlayerMatch extends IPlayer {
    goals: number;
    team: string;
    ownGoals?: number;
}

export interface IResponsePlayers {
    players: IPlayer[];
    pagination: IPagination;
}