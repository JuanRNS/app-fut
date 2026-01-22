import { IMatch, IPagination } from "./match.interface";

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
    players: number;
    matches: IMatch[];
    pagination: IPagination;
}

interface IGroup {
    name: string;
    description: string;
}
