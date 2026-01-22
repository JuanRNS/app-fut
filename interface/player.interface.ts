export interface IPlayer {
    id: string;
    name: string;
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
}


export interface IResponsePlayerRanking extends IPlayer {
    goals: number;
}

export interface IResponsePlayerMatch extends IPlayer {
    goals: number;
    team: string;
}