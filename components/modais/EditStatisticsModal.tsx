import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFutbol, FaHandsHelping, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
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

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/group/${groupId}/statistics/${matchId}`);
            if (!response.ok) throw new Error("Falha ao buscar dados");
            const data: IResponse = await response.json();
            setStatistics(data.statistics);
            setMatchPlayers(data.match);
        } catch {
            toast.error("Erro ao carregar dados da partida");
        }
    }, [groupId, matchId]);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open, fetchData]);

    const closeModal = () => {
        setOpen(false);
        setIsAddingEvent(false);
        setSelectedPlayerId(null);
        setSelectedTeam(null);
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
        } catch {
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
            const player = matchPlayers.find(mp => mp.team.playerId === selectedPlayerId)?.team.player.name || "Desconhecido";

            const optimisticStat: IStatistic = {
                ...newStat,
                player,
                id: newStat.id
            };

            setStatistics((prev) => [...prev, optimisticStat]);
            toast.success("Evento adicionado com sucesso");
            setIsAddingEvent(false);
            setSelectedPlayerId(null);
            setSelectedTeam(null);
        } catch {
            toast.error("Erro ao adicionar evento");
        } finally {
            setIsLoading(false);
        }
    };

    const homeScore = useMemo(() => statistics.filter((s) => s.team === "HOME" && s.type === "GOAL").length, [statistics]);
    const awayScore = useMemo(() => statistics.filter((s) => s.team === "AWAY" && s.type === "GOAL").length, [statistics]);
    const assistanceCount = useMemo(() => statistics.filter((s) => s.type === "ASSISTANCE").length, [statistics]);

    const homePlayers = useMemo(() => matchPlayers.filter((p) => p.team.team === "HOME"), [matchPlayers]);
    const awayPlayers = useMemo(() => matchPlayers.filter((p) => p.team.team === "AWAY"), [matchPlayers]);

    return (
        <Dialog open={open} onClose={closeModal} className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
            <DialogBackdrop className="fixed inset-0 bg-black/85" />

            <div className="fixed inset-0 flex w-screen items-center justify-center p-3 sm:p-4">
                <DialogPanel className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-surface/95 shadow-[0_24px_70px_rgba(0,0,0,0.52)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_28%)]" />
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-accent" />

                    <header className="relative z-10 border-b border-white/10 p-5 sm:p-6">
                        <DialogTitle className="flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Central da partida</p>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground sm:text-3xl">Editar Estatisticas</h2>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-secondary">Atualize gols e assistencias sem perder o ritmo do jogo.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary transition-all hover:bg-white/10 hover:text-foreground active:scale-95"
                                aria-label="Fechar estatisticas"
                            >
                                <FaTimes />
                            </button>
                        </DialogTitle>

                        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5 sm:p-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Time A</p>
                                    <span className="mt-1 block text-5xl font-black italic tracking-tighter text-foreground sm:text-6xl">{homeScore}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary">VS</span>
                                    <span className="h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-400">Time B</p>
                                    <span className="mt-1 block text-5xl font-black italic tracking-tighter text-foreground sm:text-6xl">{awayScore}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 border-t border-white/10 bg-white/[0.03]">
                                <div className="border-r border-white/10 p-3 text-center">
                                    <span className="block text-xl font-black italic text-foreground">{statistics.length}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Eventos</span>
                                </div>
                                <div className="p-3 text-center">
                                    <span className="block text-xl font-black italic text-foreground">{assistanceCount}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Assistencias</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 custom-scrollbar [scrollbar-gutter:stable]">
                        {!isAddingEvent ? (
                            <div className="space-y-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">Historico de eventos</h3>
                                        <p className="mt-1 text-sm text-secondary/75">Remova registros errados ou adicione novos lances.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingEvent(true)}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/15 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary transition-colors duration-150 hover:bg-primary hover:text-white active:scale-[0.98]"
                                    >
                                        <FaPlus size={13} />
                                        Adicionar Evento
                                    </button>
                                </div>

                                {statistics.length === 0 ? (
                                    <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center">
                                        <FaFutbol className="mx-auto mb-4 h-12 w-12 text-secondary/25" />
                                        <p className="text-sm font-black uppercase tracking-widest text-secondary">Nenhum evento registrado</p>
                                        <p className="mt-2 text-sm text-secondary/70">Quando sair gol ou assistencia, registre por aqui.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {statistics.map((stat) => {
                                            const isGoal = stat.type === "GOAL";
                                            const teamColor = stat.team === "HOME" ? "text-primary" : "text-blue-400";

                                            return (
                                                <div key={stat.id} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 p-4 transition-colors duration-150 hover:border-primary/30 hover:bg-white/[0.04]">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${isGoal ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-blue-500/30 bg-blue-500/10 text-blue-400"}`}>
                                                            {isGoal ? <FaFutbol size={17} /> : <FaHandsHelping size={17} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="block truncate text-base font-black uppercase tracking-tight text-foreground">{stat.player}</span>
                                                            <span className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                                                                {isGoal ? "Gol" : "Assistencia"}
                                                                <span className="h-1 w-1 rounded-full bg-secondary/40" />
                                                                <span className={teamColor}>{stat.team === "HOME" ? "Time A" : "Time B"}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(stat.id)}
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-secondary opacity-100 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                                                        title="Remover evento"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Novo Evento</h3>
                                        <p className="mt-1 text-sm text-secondary">Escolha o atleta e registre o tipo de lance.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsAddingEvent(false);
                                            setSelectedPlayerId(null);
                                            setSelectedTeam(null);
                                        }}
                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-secondary transition-colors duration-150 hover:text-foreground"
                                    >
                                        Cancelar
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-[1.5rem] border border-primary/20 bg-black/10 p-3">
                                        <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Time A</h4>
                                        <div className="space-y-2">
                                            {homePlayers.map((p) => (
                                                <button
                                                    key={p.team.playerId}
                                                    onClick={() => {
                                                        setSelectedPlayerId(p.team.playerId);
                                                        setSelectedTeam("HOME");
                                                    }}
                                                    className={`w-full rounded-2xl border px-4 py-3 text-left font-black uppercase tracking-tight transition-colors duration-150 ${selectedPlayerId === p.team.playerId
                                                        ? "border-primary bg-primary text-white"
                                                        : "border-white/10 bg-black/15 text-foreground hover:border-primary/40 hover:bg-primary/10"
                                                        }`}
                                                >
                                                    {p.team.player.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.5rem] border border-blue-400/20 bg-black/10 p-3">
                                        <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-blue-400">Time B</h4>
                                        <div className="space-y-2">
                                            {awayPlayers.map((p) => (
                                                <button
                                                    key={p.team.playerId}
                                                    onClick={() => {
                                                        setSelectedPlayerId(p.team.playerId);
                                                        setSelectedTeam("AWAY");
                                                    }}
                                                    className={`w-full rounded-2xl border px-4 py-3 text-left font-black uppercase tracking-tight transition-colors duration-150 ${selectedPlayerId === p.team.playerId
                                                        ? "border-blue-400 bg-blue-500 text-white"
                                                        : "border-white/10 bg-black/15 text-foreground hover:border-blue-400/40 hover:bg-blue-400/10"
                                                        }`}
                                                >
                                                    {p.team.player.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {selectedPlayerId && (
                                    <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                                        <button
                                            onClick={() => handleAddEvent("GOAL")}
                                            disabled={isLoading}
                                            className="flex items-center justify-center gap-3 rounded-2xl bg-green-500 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors duration-150 hover:bg-green-600 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <FaFutbol />
                                            Gol
                                        </button>
                                        <button
                                            onClick={() => handleAddEvent("ASSISTANCE")}
                                            disabled={isLoading}
                                            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-500 px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors duration-150 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <FaHandsHelping />
                                            Assistencia
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
