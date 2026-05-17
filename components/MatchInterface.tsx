import React, { useState, useEffect } from 'react';
import { FaPlay, FaPlus, FaTimes, FaUserShield, FaSpinner } from 'react-icons/fa';
import Button from './ui/Button';
import PlayerCard from './PlayerCard';
import DropdownStatistics from './DropdownStatistics';
import ScoreBoard from './Scoreboard';
import MatchControls from './MatchControls';
import { IMatch, IMatchInterfaceProps, IMatchPlayer, IMatchResponseInterface } from '@/interface/match.interface';
import { IPlayer } from '@/interface/player.interface';
import { toast } from 'sonner';
import { MatchStatisticsType, Team } from '@/generated/prisma/enums';
import PlayerSelectionModal from './modais/PlayerSelectionModal';

export default function MatchInterface({ players, onFinish, groupId }: IMatchInterfaceProps) {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openDropdownPlayerId, setOpenDropdownPlayerId] = useState<string | null>(null);
    const [matchId, setMatchId] = useState<string | null>(null);

    const [teamA, setTeamA] = useState<IPlayer[]>([]);
    const [teamB, setTeamB] = useState<IPlayer[]>([]);
    const [selectingFor, setSelectingFor] = useState<Team | null>(null);

    useEffect(() => {
        const storedMatchId = localStorage.getItem('matchId');
        if (storedMatchId) {
            handleGetMatch(storedMatchId);
        }
    }, [groupId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
    };



    const handleGetMatch = async (id?: string) => {
        const targetId = id || matchId;
        if (!targetId) return;

        try {
            const response = await fetch(`/api/group/${groupId}/${targetId}`);

            if (!response.ok) {
                toast.error("Erro ao recuperar partida");
                return;
            }

            const data: IMatchResponseInterface = await response.json();
            if (data.match) {
                localStorage.setItem('matchId', data.match.id);
                setMatchId(data.match.id);
                setHasStarted(true);
                if (data.match.teams) {
                    const players = data.match.teams;
                    const homePlayers = players.filter((p: IMatchPlayer) => p.team === 'HOME').map((p: IMatchPlayer) => ({ id: p.player!.id, name: p.player!.name }));
                    const awayPlayers = players.filter((p: IMatchPlayer) => p.team === 'AWAY').map((p: IMatchPlayer) => ({ id: p.player!.id, name: p.player!.name }));
                    setTeamA(homePlayers);
                    setTeamB(awayPlayers);
                }
                if (data.goalsAway && data.goalsHome) {
                    setHomeScore(data.goalsHome);
                    setAwayScore(data.goalsAway);
                }

                setIsRunning(false);
            }
        } catch (error) {
            toast.error("Erro ao recuperar partida");
        }
    };

    const handleStatistics = (type?: MatchStatisticsType, team?: Team) => {
        if (type === 'GOAL' && team) {
            if (team === 'HOME') {
                setHomeScore((prev) => prev + 1);
            } else if (team === 'AWAY') {
                setAwayScore((prev) => prev + 1);
            }
        } else if (type === 'OWN_GOAL' && team) {
            if (team === 'HOME') {
                setAwayScore((prev) => prev + 1);
            } else if (team === 'AWAY') {
                setHomeScore((prev) => prev + 1);
            }
        }
        setOpenDropdownPlayerId(null);
    };

    const handleStartMatch = async () => {
        if (teamA.length === 0 && teamB.length === 0) {
            toast.error("Selecione jogadores para os times");
            return;
        }

        if (teamA.length !== 5 || teamB.length !== 5) {
            toast.error("Selecione 5 jogadores para cada time");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/group/${groupId}/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamA: teamA.map(p => p.id),
                    teamB: teamB.map(p => p.id)
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao criar partida");
            }

            const newMatch: IMatch = await response.json();
            localStorage.setItem('matchId', newMatch.id);
            setMatchId(newMatch.id);

            setHasStarted(true);
            setIsRunning(true);
        } catch (error) {
            toast.error("Erro ao iniciar partida");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemovePlayer = (team: Team, playerId: string) => {
        if (hasStarted) return;

        if (team === 'HOME') {
            setTeamA(prev => prev.filter(p => p.id !== playerId));
        } else {
            setTeamB(prev => prev.filter(p => p.id !== playerId));
        }
    };

    const toggleDropdown = (playerId: string) => {
        if (openDropdownPlayerId === playerId) {
            setOpenDropdownPlayerId(null);
        } else {
            setOpenDropdownPlayerId(playerId);
        }
    };

    const renderTeamSlot = (team: Team, index: number) => {
        const currentTeam = team === 'HOME' ? teamA : teamB;
        const player = currentTeam[index];
        const isGK = index === 0;

        if (player) {
            return (
                <div
                    key={index}
                    className={`relative group animate-slide-up-fade ${openDropdownPlayerId === player.id ? 'z-[5000]' : 'z-0'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <PlayerCard
                        name={player.name}
                        id={player.id}
                        isMatch={true}
                    />
                    {isGK && (
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg z-10" title="Goleiro">
                            <FaUserShield size={14} />
                        </div>
                    )}
                    {!hasStarted && (
                        <button
                            onClick={() => handleRemovePlayer(team, player.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                        >
                            <FaTimes size={12} />
                        </button>
                    )}
                    {hasStarted && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDropdown(player.id);
                                }}
                            className={`absolute bottom-6 -right-2 p-1.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 z-[10000] ${openDropdownPlayerId === player.id
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-green-500 text-black hover:bg-green-600'
                                    }`}
                            >
                                {openDropdownPlayerId === player.id ? <FaTimes size={14} /> : <FaPlus size={14} />}
                            </button>

                            {openDropdownPlayerId === player.id && (
                                <DropdownStatistics
                                    onClose={handleStatistics}
                                    playerId={player.id}
                                    matchId={matchId}
                                    groupId={groupId}
                                    team={team}
                                />
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (hasStarted) {
            return (
                <div key={index} className="w-full h-[72px] rounded-xl border-2 border-dashed border-border bg-surface/20 flex items-center justify-center text-secondary/30">
                    <span className="text-sm">Vazio</span>
                </div>
            );
        }

        return (
            <button
                key={index}
                onClick={() => setSelectingFor(team)}
                className={`w-full h-[72px] rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all group overflow-hidden relative
                    ${isGK
                        ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'
                        : 'border-border text-secondary/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isGK ? <FaUserShield /> : <FaPlus />}
                <span className="text-sm font-black uppercase tracking-widest">{isGK ? "Goleiro" : "Adicionar"}</span>
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-8 relative bg-noise py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {/* VS Badge Overlay for Desktop */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 glass-panel rounded-full items-center justify-center border-primary/30 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    <span className="text-2xl font-black italic text-primary tracking-tighter">VS</span>
                </div>

                {/* Team A Panel */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-white/5 shadow-xl relative overflow-visible">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-foreground font-black text-2xl uppercase tracking-tighter">Time A</h3>
                        </div>
                        <span className="text-xs font-black bg-primary/10 px-3 py-1 rounded-full text-primary border border-primary/20">
                            {teamA.length} / 5
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {Array.from({ length: 5 }).map((_, i) => renderTeamSlot('HOME', i))}
                    </div>
                </div>

                {/* Team B Panel */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-white/5 shadow-xl relative overflow-visible">
                    <div className="absolute top-0 right-0 w-1 h-full bg-blue-400" />
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-foreground font-black text-2xl uppercase tracking-tighter">Time B</h3>
                        </div>
                        <span className="text-xs font-black bg-blue-400/10 px-3 py-1 rounded-full text-blue-400 border border-blue-400/20">
                            {teamB.length} / 5
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {Array.from({ length: 5 }).map((_, i) => renderTeamSlot('AWAY', i))}
                    </div>
                </div>
            </div>

            {!hasStarted ? (
                <div className="flex justify-center mt-6 animate-slide-up-fade">
                    <Button
                        variant="primary"
                        onClick={handleStartMatch}
                        className="px-16 py-5 text-2xl font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_40px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_50px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-1 flex items-center gap-4 bg-gradient-to-br from-primary to-blue-600 animate-shimmer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                        Iniciar Partida
                    </Button>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl flex flex-col items-center gap-8 py-10 animate-slide-up-fade shadow-2xl border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse-live" />
                    <ScoreBoard
                        homeScore={homeScore}
                        awayScore={awayScore}
                        time={time}
                        isRunning={isRunning}
                        setHomeScore={setHomeScore}
                        setAwayScore={setAwayScore}
                    />

                    <MatchControls
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        onFinish={onFinish}
                        onReset={resetTimer}
                    />
                </div>
            )}

            {selectingFor && (
                <PlayerSelectionModal
                    selectingFor={selectingFor}
                    players={players}
                    setSelectingFor={setSelectingFor}
                    teamA={teamA}
                    teamB={teamB}
                    setTeamA={setTeamA}
                    setTeamB={setTeamB}
                />
            )}
        </div>
    );
}
