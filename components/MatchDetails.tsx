import { IMatch, IMatchResponseDetails } from "@/interface/match.interface";
import { useState } from "react";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import EditStatisticsModal from "./modais/EditStatisticsModal";

export default function MatchDetails({ match, groupId, fetchGroup }: { match: IMatch, groupId: string, fetchGroup: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [details, setDetails] = useState<IMatchResponseDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const toggleDetails = async () => {
        const nextState = !isExpanded;
        setIsExpanded(nextState);
        setIsDropdownOpen(false);

        if (nextState && !details) {
            setLoading(true);
            try {
                const response = await fetch(`/api/group/${groupId}/${match.id}`);
                if (!response.ok) throw new Error("Erro ao carregar detalhes");
                const data: IMatchResponseDetails = await response.json();
                setDetails(data);
            } catch (error) {
                toast.error("Erro ao buscar detalhes táticos");
                setIsExpanded(false);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/group/${groupId}/${match.id}`, {
                method: 'DELETE'
            });
            setIsDropdownOpen(false);
            toast.success("Partida deletada com sucesso");
            fetchGroup();
        } catch (error) {
            toast.error("Erro ao deletar partida");
        }
    };



    return (
        <div className="flex flex-col rounded-[2rem] glass-panel border border-white/5 transition-all duration-500 relative bg-noise overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/30">
            {/* Header / Date Area */}
            <div className="px-8 py-4 flex justify-between items-center bg-surface/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/70">
                        {new Date(match.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDetails}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-400 transition-colors"
                    >
                        {isExpanded ? "Fechar Detalhes" : "Ver Detalhes"}
                    </button>

                    {!isExpanded && (
                        <div className="relative">
                            <button
                                className="text-secondary hover:text-foreground p-2 rounded-xl hover:bg-white/5 transition-all active:scale-90"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <FaEllipsisV size={12} />
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col py-2 animate-slide-up-fade bg-noise">
                                        <button
                                            onClick={toggleDetails}
                                            className="flex items-center gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-secondary hover:bg-primary hover:text-white transition-all text-left w-full"
                                        >
                                            <FaEye className="text-primary group-hover:text-white" />
                                            Analisar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditModalOpen(true);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-secondary hover:bg-blue-500 hover:text-white transition-all text-left w-full"
                                        >
                                            <FaEdit className="text-blue-400" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all text-left w-full"
                                        >
                                            <FaTrash className="text-red-400" />
                                            Remover
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Scoreboard Preview Area */}
            <div className="p-8 flex items-center justify-center gap-10 md:gap-16">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center border-primary/20 shadow-lg mb-1">
                        <span className="text-2xl">🛡️</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-secondary">Time A</span>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-5xl md:text-7xl font-black italic tracking-tighter text-foreground tabular-nums drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        {(match.statistics || []).filter(s => s.type === 'GOAL' && s.team === 'HOME').length}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        <span className="text-lg font-black italic text-secondary/30 tracking-tighter">VS</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    </div>
                    <span className="text-5xl md:text-7xl font-black italic tracking-tighter text-foreground tabular-nums drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        {(match.statistics || []).filter(s => s.type === 'GOAL' && s.team === 'AWAY').length}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center border-blue-400/20 shadow-lg mb-1">
                        <span className="text-2xl">⚔️</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-secondary">Time B</span>
                </div>
            </div>

            <EditStatisticsModal matchId={match.id} groupId={groupId} open={isEditModalOpen} setOpen={setIsEditModalOpen} />

            {/* Expanded Details Section */}
            {isExpanded && (
                <div className="px-8 pb-8 pt-4 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    {loading ? (
                        <div className="flex flex-col items-center py-10 gap-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Replay Tático...</p>
                        </div>
                    ) : details ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Goals List */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                                    <div className="w-1 h-3 bg-primary rounded-full" />
                                    Registro de Gols
                                </h4>
                                
                                {details.players && details.players.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {details.players.map((player) => (
                                            <div key={player.id} className="glass-panel p-4 rounded-2xl border-white/5 flex justify-between items-center group/item hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${player.team === 'HOME' ? 'bg-primary shadow-primary/20' : 'bg-blue-500 shadow-blue-500/20'}`}>
                                                        {player.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black uppercase tracking-tighter text-foreground">{player.name}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary opacity-50">{player.team === 'HOME' ? 'Time A' : 'Time B'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {player.goals > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl font-black italic tracking-tighter text-foreground">{player.goals}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">GOL</span>
                                                        </div>
                                                    )}
                                                    {(player.ownGoals ?? 0) > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl font-black italic tracking-tighter text-red-400">{player.ownGoals ?? 0}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">CONTRA</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center glass-panel rounded-2xl border-dashed border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 italic">0 x 0 • Placar Inalterado</p>
                                    </div>
                                )}
                            </div>

                            {/* Tactical Stats Summary (Placeholder for future expansion) */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                                    <div className="w-1 h-3 bg-blue-400 rounded-full" />
                                    Resumo da Partida
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col items-center gap-2">
                                        <span className="text-3xl font-black italic tracking-tighter text-foreground">{details.goalsHome + details.goalsAway}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Total Gols</span>
                                    </div>
                                    <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col items-center gap-2">
                                        <span className="text-3xl font-black italic tracking-tighter text-foreground">
                                            {details.players.length}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Marcadores</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-10 text-center glass-panel rounded-3xl border-red-500/20 bg-red-500/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Falha ao recuperar registros táticos.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


