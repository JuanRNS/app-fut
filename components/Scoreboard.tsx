import React, { Dispatch, SetStateAction } from 'react';
import { FaClock } from 'react-icons/fa';
import Button from './ui/Button';

interface IScoreBoardProps {
    homeScore: number;
    awayScore: number;
    time: number;
    isRunning: boolean;
    setHomeScore: Dispatch<SetStateAction<number>>;
    setAwayScore: Dispatch<SetStateAction<number>>;
}

export default function ScoreBoard({
    homeScore,
    awayScore,
    time,
    isRunning,
    setHomeScore,
    setAwayScore
}: IScoreBoardProps) {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center justify-center gap-4 md:gap-12 w-full px-2">
            {/* Home Score */}
            <div className="flex flex-col items-center">
                <span className="text-secondary text-xs md:text-sm uppercase tracking-wider mb-2">Time A</span>
                <div className="text-4xl md:text-6xl font-bold text-foreground bg-surface/50 rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[100px] text-center decoration-0">
                    {homeScore}
                </div>
                <div className="flex gap-2 mt-2">
                    <Button
                        className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center"
                        variant="secondary"
                        onClick={() => setHomeScore(s => Math.max(0, s - 1))}
                    >
                        -
                    </Button>
                    <Button
                        className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center"
                        variant="primary"
                        onClick={() => setHomeScore(s => s + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>

            {/* Timer */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-3xl md:text-4xl font-mono text-primary font-bold tracking-widest flex items-center gap-2">
                    <FaClock className="w-5 h-5 md:w-6 md:h-6" />
                    {formatTime(time)}
                </div>
                <span className="text-[10px] md:text-xs text-green-500 uppercase tracking-widest font-bold whitespace-nowrap">
                    {isRunning ? 'Em Andamento' : 'Pausado'}
                </span>
            </div>

            {/* Away Score */}
            <div className="flex flex-col items-center">
                <span className="text-secondary text-xs md:text-sm uppercase tracking-wider mb-2">Time B</span>
                <div className="text-4xl md:text-6xl font-bold text-foreground bg-surface/50 rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[100px] text-center">
                    {awayScore}
                </div>
                <div className="flex gap-2 mt-2">
                    <Button
                        className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center"
                        variant="secondary"
                        onClick={() => setAwayScore(s => Math.max(0, s - 1))}
                    >
                        -
                    </Button>
                    <Button
                        className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center"
                        variant="primary"
                        onClick={() => setAwayScore(s => s + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>
        </div>
    );
}
