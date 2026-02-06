import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaClock, FaPlus, FaTimes, FaUserShield, FaSpinner } from 'react-icons/fa';
import Button from './ui/Button';
import Card from './ui/Card';
import PlayerCard from './PlayerCard';
import DropdownStatistics from './DropdownStatistics';
import { IMatch, IMatchInterfaceProps, IMatchPlayer, IMatchResponse, IMatchResponseInterface } from '@/interface/match.interface';
import { IPlayer, IPlayerMatch } from '@/interface/player.interface';
import { toast } from 'sonner';
import { Team } from '@/generated/prisma/enums';
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

    const handleStatistics = (type?: 'GOAL' | 'ASSISTANCE', team?: Team) => {
        if (type === 'GOAL' && team) {
            if (team === 'HOME') {
                setHomeScore((prev) => prev + 1);
            } else if (team === 'AWAY') {
                setAwayScore((prev) => prev + 1);
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
                <div key={index} className="relative group">
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
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
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
                                className={`absolute bottom-6 -right-2 p-1.5 rounded-full shadow-lg z-10 cursor-pointer transition-colors ${openDropdownPlayerId === player.id
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
                <div key={index} className="w-full h-[72px] rounded-xl border-2 border-dashed border-border bg-surface/50 flex items-center justify-center text-secondary/30">
                    <span className="text-sm">Vazio</span>
                </div>
            );
        }

        return (
            <button
                key={index}
                onClick={() => setSelectingFor(team)}
                className={`w-full h-[72px] rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all group
                    ${isGK
                        ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500/50 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'
                        : 'border-border text-secondary/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
                    }`}
            >
                {isGK ? <FaUserShield /> : <FaPlus />}
                <span className="text-sm font-medium">{isGK ? "Goleiro" : "Adicionar"}</span>
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-6 relative">
            {/* Players Team Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team A Data */}
                <div className="bg-surface rounded-xl p-6 border border-border flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-8 bg-primary rounded-full"></div>
                            <h3 className="text-foreground font-bold text-xl">Time A</h3>
                        </div>
                        <span className="text-xs font-mono bg-surface/50 px-3 py-1 rounded-full text-secondary border border-border">
                            {teamA.length}/5
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => renderTeamSlot('HOME', i))}
                    </div>
                </div>

                {/* Team B Data */}
                <div className="bg-surface rounded-xl p-6 border border-border flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
                            <h3 className="text-foreground font-bold text-xl">Time B</h3>
                        </div>
                        <span className="text-xs font-mono bg-surface/50 px-3 py-1 rounded-full text-secondary border border-border">
                            {teamB.length}/5
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => renderTeamSlot('AWAY', i))}
                    </div>
                </div>
            </div>

            {!hasStarted ? (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="primary"
                        onClick={handleStartMatch}
                        className="px-12 py-4 text-xl font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                        Iniciar Partida
                    </Button>
                </div>
            ) : (
                <Card className="flex flex-col items-center gap-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-center gap-4 md:gap-12 w-full px-2">
                        {/* Home Score */}
                        <div className="flex flex-col items-center">
                            <span className="text-secondary text-xs md:text-sm uppercase tracking-wider mb-2">Time A</span>
                            <div className="text-4xl md:text-6xl font-bold text-foreground bg-surface/50 rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[100px] text-center decoration-0">
                                {homeScore}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Button className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center" variant="secondary" onClick={() => setHomeScore(s => Math.max(0, s - 1))}>-</Button>
                                <Button className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center" variant="primary" onClick={() => setHomeScore(s => s + 1)}>+</Button>
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
                                <Button className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center" variant="secondary" onClick={() => setAwayScore(s => Math.max(0, s - 1))}>-</Button>
                                <Button className="w-8 h-8 md:w-auto md:h-auto flex items-center justify-center" variant="primary" onClick={() => setAwayScore(s => s + 1)}>+</Button>
                            </div>
                        </div>
                    </div>

                    {/* Match Controls */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-4 px-4">
                        <Button
                            variant={isRunning ? "secondary" : "primary"}
                            onClick={() => setIsRunning(!isRunning)}
                            className="w-full md:w-40 flex items-center justify-center gap-2"
                        >
                            {isRunning ? <><FaPause /> Pausar</> : <><FaPlay /> Continuar</>}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onFinish}
                            className="w-full md:w-40 flex items-center gap-2 justify-center text-red-500 hover:bg-red-500/10 hover:text-red-400 border border-red-500/20"
                        >
                            <FaStop /> Finalizar
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => resetTimer()}
                            className="w-full md:w-40 flex items-center gap-2 justify-center text-foreground hover:bg-hover hover:text-foreground"
                        >
                            <FaStop /> Zerar
                        </Button>
                    </div>
                </Card>
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
