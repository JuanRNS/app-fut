import React, { Dispatch, SetStateAction } from 'react';

interface IScoreBoardProps {
    homeScore: number;
    awayScore: number;
    time: number;
    isRunning: boolean;
    setHomeScore?: Dispatch<SetStateAction<number>>;
    setAwayScore?: Dispatch<SetStateAction<number>>;
}

export default function ScoreBoard({
    homeScore,
    awayScore,
    time,
    isRunning,
}: IScoreBoardProps) {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-4">
            <div className="relative group">
                {/* Scoreboard Main Container */}
                <div className="glass-panel rounded-2xl overflow-hidden flex items-stretch shadow-2xl border-white/10">
                    
                    {/* Home Team */}
                    <div className="flex items-center px-6 py-4 bg-primary/20 min-w-[120px] justify-end gap-4">
                        <span className="text-foreground font-black text-lg uppercase tracking-tighter hidden sm:block">Time A</span>
                        <div className="text-4xl md:text-5xl font-black text-foreground tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            {homeScore}
                        </div>
                    </div>

                    {/* Timer & Divider */}
                    <div className="flex flex-col items-center justify-center px-4 md:px-8 border-x border-white/10 bg-surface/40 min-w-[100px] md:min-w-[140px]">
                        <div className={`flex items-center gap-2 font-mono text-xl md:text-2xl font-bold tracking-widest ${isRunning ? 'text-accent' : 'text-secondary'}`}>
                            {isRunning && <div className="w-2 h-2 rounded-full bg-accent animate-pulse-live" />}
                            {formatTime(time)}
                        </div>
                        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-secondary mt-1">
                            {isRunning ? 'Live' : 'Pausado'}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center px-6 py-4 bg-secondary/10 min-w-[120px] justify-start gap-4">
                        <div className="text-4xl md:text-5xl font-black text-foreground tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            {awayScore}
                        </div>
                        <span className="text-foreground font-black text-lg uppercase tracking-tighter hidden sm:block">Time B</span>
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-20 transition-all duration-1000 -z-10 ${isRunning ? 'bg-primary' : 'bg-transparent'}`} />
            </div>
        </div>
    );
}
