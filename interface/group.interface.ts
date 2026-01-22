import { IMatch, IPagination } from "./match.interface";
import { IPlayer } from "./player.interface";

export interface IRequestGroup {
    name: string;
    description: string;
}

export interface IResponseGroup {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGroupCardProps {
    group: IResponseGroup;
}

export interface IGroupDetails {
    group: IGroup;
    players: IPlayer[];
    matches: IMatch[];
    pagination: IPagination;
}

interface IGroup {
    name: string;
    description: string;
    id: string;
}
