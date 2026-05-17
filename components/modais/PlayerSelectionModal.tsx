import { IPlayer, IPlayerMatch } from "@/interface/player.interface";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaPlus, FaSearch, FaTimes, FaUser, FaUserShield, FaUsers } from "react-icons/fa";
import { toast } from "sonner";
import Input from "../ui/Input";

export default function PlayerSelectionModal({
    selectingFor,
    setSelectingFor,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
    players
}: {
    selectingFor: "HOME" | "AWAY" | null;
    setSelectingFor: (team: "HOME" | "AWAY" | null) => void;
    teamA: IPlayer[];
    teamB: IPlayer[];
    setTeamA: Dispatch<SetStateAction<IPlayer[]>>;
    setTeamB: Dispatch<SetStateAction<IPlayer[]>>;
    players: IPlayer[];
}) {
    const [selectedPlayers, setSelectedPlayers] = useState<IPlayerMatch[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const availablePlayers = useMemo(() => {
        return players.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !teamA.some(ta => ta.id === p.id) &&
            !teamB.some(tb => tb.id === p.id)
        ).sort((a, b) => a.name.localeCompare(b.name));
    }, [players, searchQuery, teamA, teamB]);

    const selectedCount = selectedPlayers.length;
    const teamLabel = selectingFor === "HOME" ? "Time A" : "Time B";
    const currentTeamSize = selectingFor === "HOME" ? teamA.length : teamB.length;
    const remainingSlots = Math.max(5 - currentTeamSize - selectedCount, 0);
    const teamAccent = selectingFor === "HOME" ? "text-primary" : "text-blue-400";
    const teamBorder = selectingFor === "HOME" ? "border-primary/40" : "border-blue-400/40";

    const handleAddPlayer = (listPlayers: IPlayerMatch[]) => {
        listPlayers.forEach(player => {
            if (player.team === "HOME") {
                setTeamA(prev => prev.length < 5 ? [...prev, player] : prev);
            } else if (player.team === "AWAY") {
                setTeamB(prev => prev.length < 5 ? [...prev, player] : prev);
            }
        });

        setSelectingFor(null);
        setSelectedPlayers([]);
    };

    const addPlayerList = (player: IPlayer) => {
        if (!selectingFor) return;

        if (selectedPlayers.some(p => p.id === player.id)) {
            setSelectedPlayers(prev => prev.filter(selected => selected.id !== player.id));
            return;
        }

        if (remainingSlots <= 0) {
            toast.error(`${teamLabel} ja tem 5 jogadores selecionados`);
            return;
        }

        setSelectedPlayers(prev => [...prev, { ...player, team: selectingFor }]);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/90 animate-in fade-in duration-200"
            onClick={() => setSelectingFor(null)}
        >
            <section
                className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-surface/95 shadow-[0_24px_70px_rgba(0,0,0,0.52)] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent ${selectingFor === "HOME" ? "via-primary" : "via-blue-400"} to-transparent`} />

                <header className="relative z-10 border-b border-white/10 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-white/5 ${teamBorder}`}>
                                <FaUsers className={`h-6 w-6 ${teamAccent}`} />
                            </div>
                            <div>
                                <p className={`mb-1 text-[10px] font-black uppercase tracking-[0.32em] ${teamAccent}`}>Convocacao</p>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                                    Adicionar ao {teamLabel}
                                </h3>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-secondary">
                                    Escolha ate completar 5 atletas. Clique novamente para remover da selecao.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectingFor(null)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary transition-all hover:bg-white/10 hover:text-foreground active:scale-95"
                            aria-label="Fechar selecao de jogadores"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                            <span className="block text-2xl font-black italic text-foreground">{currentTeamSize}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">No time</span>
                        </div>
                        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center">
                            <span className="block text-2xl font-black italic text-primary">{selectedCount}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Selecionados</span>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                            <span className="block text-2xl font-black italic text-foreground">{remainingSlots}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Vagas</span>
                        </div>
                    </div>
                </header>

                <div className="relative z-10 border-b border-white/10 p-4 sm:p-5">
                    <div className="relative">
                        <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                        <Input
                            placeholder="Buscar jogador"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-11 rounded-2xl border-white/10 bg-black/25 py-4 font-bold focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                        />
                    </div>
                </div>

                <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 custom-scrollbar [scrollbar-gutter:stable]">
                    {availablePlayers.length === 0 ? (
                        <div className="flex min-h-[230px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center">
                            <FaUserShield className="mb-4 h-14 w-14 text-secondary/25" />
                            <p className="text-sm font-black uppercase tracking-widest text-secondary">Nenhum jogador disponivel</p>
                            <p className="mt-2 max-w-xs text-sm text-secondary/70">Tente limpar a busca ou cadastrar novos atletas no elenco.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {availablePlayers.map(player => {
                                const isSelected = selectedPlayers.some(p => p.id === player.id);

                                return (
                                    <div key={player.id} className="relative">
                                        {isSelected && (
                                            <div className="absolute right-4 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                                                <FaCheck size={13} />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => addPlayerList(player)}
                                            aria-pressed={isSelected}
                                            className={`group flex h-[76px] w-full items-center gap-4 rounded-2xl border px-4 text-left transition-colors duration-150 ${
                                                isSelected
                                                    ? "border-primary/70 bg-primary/12 text-foreground"
                                                    : "border-white/10 bg-black/15 text-foreground hover:border-primary/35 hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                                                isSelected
                                                    ? "border-primary/60 bg-primary text-white"
                                                    : "border-white/10 bg-surface/70 text-secondary group-hover:text-primary"
                                            }`}>
                                                <FaUser className="h-5 w-5" />
                                            </span>

                                            <span className="min-w-0">
                                                <span className="block truncate text-xl font-black uppercase leading-none tracking-tighter">
                                                    {player.name}
                                                </span>
                                                <span className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-secondary/60">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-secondary/30"}`} />
                                                    {isSelected ? "Selecionado" : "Em campo"}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="relative z-10 border-t border-white/10 bg-surface/95 p-4 sm:p-5">
                    <button
                        onClick={() => handleAddPlayer(selectedPlayers)}
                        disabled={selectedPlayers.length === 0}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white shadow-[0_18px_45px_rgba(37,99,235,0.34)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FaPlus />
                        Adicionar Jogadores
                    </button>
                </footer>
            </section>
        </div>
    );

    if (typeof document === "undefined") return null;

    return createPortal(modal, document.body);
}
