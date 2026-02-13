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
                const data: IMatchResponseDetails = await response.json();
                setDetails(data);
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
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
        <div className="flex flex-col rounded-xl bg-surface border border-border transition-all duration-300 relative">
            <div className="p-4 flex justify-between items-center hover:bg-hover transition-colors">
                <span className="text-secondary text-sm font-bold">{new Date(match.createdAt).toLocaleDateString()}</span>
                <span className="text-foreground font-bold">Partida</span>

                {isExpanded ? (
                    <button
                        className="text-primary text-sm hover:underline"
                        onClick={toggleDetails}
                    >
                        Esconder detalhes
                    </button>
                ) : (
                    <div className="relative">
                        <button
                            className="text-secondary hover:text-foreground p-2 rounded-full hover:bg-hover transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <FaEllipsisV />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-40 bg-surface rounded-xl border border-border shadow-2xl z-20 overflow-hidden flex flex-col py-1">
                                    <button
                                        onClick={toggleDetails}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-hover hover:text-foreground transition-colors text-left w-full cursor-pointer"
                                    >
                                        <FaEye className="text-primary" />
                                        Visualizar
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-hover hover:text-foreground transition-colors text-left w-full cursor-pointer"
                                    >
                                        <FaEdit className="text-blue-400" />
                                        Editar
                                    </button>
                                    <EditStatisticsModal matchId={match.id} groupId={groupId} open={isEditModalOpen} setOpen={setIsEditModalOpen} />
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-hover hover:text-foreground transition-colors text-left w-full cursor-pointer"
                                    >
                                        <FaTrash className="text-red-400" />
                                        Deletar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>


            {/* Painel de Expansão */}
            {isExpanded && (
                <div className="bg-surface/50 p-4 border-t border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {loading ? (
                        <p className="text-center text-secondary text-sm italic">Carregando detalhes...</p>
                    ) : details ? (
                        <>
                            {/* Placar */}
                            <div className="flex justify-center items-center gap-8 text-2xl font-bold text-foreground">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-normal text-secondary">Time A</span>
                                    <span className="text-blue-400">{details.goalsHome}</span>
                                </div>
                                <span className="text-secondary">x</span>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-normal text-secondary">Time B</span>
                                    <span className="text-red-400">{details.goalsAway}</span>
                                </div>
                            </div>

                            {/* Lista de Goleadores */}
                            {details.players && details.players.length > 0 ? (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-secondary border-b border-border pb-1">Gols</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {details.players.map((player) => (
                                            <div key={player.id} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${player.team === 'HOME' ? 'bg-blue-400' : 'bg-red-400'}`} />
                                                    <span className="text-foreground">{player.name}</span>
                                                </div>
                                                <span className="text-foreground font-bold">{player.goals} {player.goals === 1 ? 'gol' : 'gols'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-secondary text-sm py-2">0 x 0 (Sem marcadores)</p>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-red-400 text-sm">Erro ao carregar dados.</p>
                    )}
                </div>
            )}
        </div>
    );
}


