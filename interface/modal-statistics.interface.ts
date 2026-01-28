
export interface IModalStatisticsProps {
    isOpen: boolean;
    onClose: () => void;
    playerId: string;
    matchId: string | null;
    groupId: string;
}


export interface IRequestMatchStatistics {
    playerId: string;
    type: MatchStatisticsType;
    matchId: string;
    team: Team;
}

export interface IResponseMatchStatistics {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    matchId: string;
    playerId: string;
    type: MatchStatisticsType;
    team: Team;
}

export interface IDropdownStatisticsProps {
    onClose: (type?: 'GOAL' | 'ASSISTANCE', team?: Team) => void;
    playerId: string;
    matchId: string | null;
    groupId: string;
    team: Team;
}

type MatchStatisticsType = 'GOAL' | 'ASSISTANCE';

type Team = 'HOME' | 'AWAY';

