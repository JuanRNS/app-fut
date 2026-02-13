import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { FaTrash, FaFutbol, FaHandsHelping, FaPlus, FaTimes } from "react-icons/fa";
import { Team } from "@/generated/prisma/enums";

interface IStatistic {
    id: string;
    type: "GOAL" | "ASSISTANCE";
    team: Team;
    player: string;
    playerId: string;
}

interface IMatchPlayer {
    team: {
        id: string;
        matchId: string;
        playerId: string;
        team: Team;
        player: {
            id: string;
            name: string;
            groupId: string;
        }
    }
}

interface IResponse {
    statistics: IStatistic[];
    match: IMatchPlayer[];
}

export default function EditStatisticsModal({ matchId, groupId, open, setOpen }: { matchId: string, groupId: string, open: boolean, setOpen: (open: boolean) => void }) {
    const [statistics, setStatistics] = useState<IStatistic[]>([]);
    const [matchPlayers, setMatchPlayers] = useState<IMatchPlayer[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, matchId, groupId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/group/${groupId}/statistics/${matchId}`);
            if (!response.ok) throw new Error("Falha ao buscar dados");
            const data: IResponse = await response.json();
            setStatistics(data.statistics);
            setMatchPlayers(data.match);
        } catch (error) {
            toast.error("Erro ao carregar dados da partida");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/group/${groupId}/statistics`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Falha ao deletar");

            setStatistics((prev) => prev.filter((stat) => stat.id !== id));
            toast.success("Evento removido com sucesso");
        } catch (error) {
            toast.error("Erro ao remover evento");
        }
    };

    const handleAddEvent = async (type: "GOAL" | "ASSISTANCE") => {
        if (!selectedPlayerId || !selectedTeam) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/group/${groupId}/statistics`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId,
                    playerId: selectedPlayerId,
                    type,
                    team: selectedTeam,
                }),
            });

            if (!response.ok) throw new Error("Falha ao criar");

            const newStat: IStatistic = await response.json();
            // The API returns the raw stat, we need to manually reconstruct the object for the UI or refetch. 
            // Re-fetching is safer to get the player name populated correctly without complex logic here, 
            // but for UI responsiveness we can try to find the player name.
            const player = matchPlayers.find(mp => mp.team.playerId === selectedPlayerId)?.team.player.name || "Desconhecido";

            const optimisicStat: IStatistic = {
                ...newStat,
                player: player,
                id: newStat.id // Ensure ID is present from response
            };

            setStatistics((prev) => [...prev, optimisicStat]);
            toast.success("Evento adicionado com sucesso");
            setIsAddingEvent(false);
            setSelectedPlayerId(null);
            setSelectedTeam(null);
        } catch (error) {
            toast.error("Erro ao adicionar evento");
        } finally {
            setIsLoading(false);
        }
    };

    const homeScore = useMemo(() => statistics.filter((s) => s.team === "HOME" && s.type === "GOAL").length, [statistics]);
    const awayScore = useMemo(() => statistics.filter((s) => s.team === "AWAY" && s.type === "GOAL").length, [statistics]);

    const homePlayers = useMemo(() => matchPlayers.filter((p) => p.team.team === "HOME"), [matchPlayers]);
    const awayPlayers = useMemo(() => matchPlayers.filter((p) => p.team.team === "AWAY"), [matchPlayers]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="bg-surface rounded-xl border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
                    <DialogTitle className="text-xl font-bold text-foreground flex justify-between items-center mb-4">
                        <span>Editar Estatísticas</span>
                        <button onClick={() => setOpen(false)} className="text-secondary hover:text-foreground">
                            <FaTimes />
                        </button>
                    </DialogTitle>

                    {/* PLACAR */}
                    <div className="flex items-center justify-center gap-8 mb-8 bg-surface-secondary/30 p-4 rounded-xl border border-border/50">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground">Time A</h3>
                            <span className="text-4xl font-bold text-primary">{homeScore}</span>
                        </div>
                        <span className="text-2xl font-bold text-secondary">X</span>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-foreground">Time B</h3>
                            <span className="text-4xl font-bold text-blue-500">{awayScore}</span>
                        </div>
                    </div>

                    {!isAddingEvent ? (
                        <>
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setIsAddingEvent(true)}
                                    className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <FaPlus size={14} />
                                    Adicionar Evento
                                </button>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">Histórico de Eventos</h4>
                                {statistics.length === 0 ? (
                                    <div className="text-center py-8 text-secondary">Nenhum evento registrado.</div>
                                ) : (
                                    statistics.map((stat) => (
                                        <div key={stat.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border group hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${stat.type === 'GOAL' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {stat.type === 'GOAL' ? <FaFutbol size={16} /> : <FaHandsHelping size={16} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{stat.player}</span>
                                                    <span className="text-xs text-secondary flex items-center gap-1">
                                                        {stat.type === 'GOAL' ? 'Gol' : 'Assistência'} •
                                                        <span className={stat.team === 'HOME' ? 'text-primary' : 'text-blue-500'}>
                                                            {stat.team === 'HOME' ? ' Time A' : ' Time B'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(stat.id)}
                                                className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remover evento"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-foreground">Novo Evento</h3>
                                <button onClick={() => {
                                    setIsAddingEvent(false);
                                    setSelectedPlayerId(null);
                                    setSelectedTeam(null);
                                }} className="text-sm text-secondary hover:text-foreground">Cancelar</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-primary">Time A</h4>
                                    <div className="space-y-1">
                                        {homePlayers.map((p) => (
                                            <button
                                                key={p.team.playerId}
                                                onClick={() => {
                                                    setSelectedPlayerId(p.team.playerId);
                                                    setSelectedTeam("HOME");
                                                }}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPlayerId === p.team.playerId
                                                        ? 'bg-primary/10 border-primary text-primary font-bold'
                                                        : 'bg-surface border-border hover:bg-surface-secondary text-foreground'
                                                    }`}
                                            >
                                                {p.team.player.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-blue-500">Time B</h4>
                                    <div className="space-y-1">
                                        {awayPlayers.map((p) => (
                                            <button
                                                key={p.team.playerId}
                                                onClick={() => {
                                                    setSelectedPlayerId(p.team.playerId);
                                                    setSelectedTeam("AWAY");
                                                }}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPlayerId === p.team.playerId
                                                        ? 'bg-blue-500/10 border-blue-500 text-blue-500 font-bold'
                                                        : 'bg-surface border-border hover:bg-surface-secondary text-foreground'
                                                    }`}
                                            >
                                                {p.team.player.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {selectedPlayerId && (
                                <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                                    <button
                                        onClick={() => handleAddEvent("GOAL")}
                                        disabled={isLoading}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FaFutbol /> Gol
                                    </button>
                                    <button
                                        onClick={() => handleAddEvent("ASSISTANCE")}
                                        disabled={isLoading}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FaHandsHelping /> Assistência
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}