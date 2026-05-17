import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import { FaPlus, FaTimes, FaSpinner, FaSearch, FaUser, FaPen, FaTrash } from "react-icons/fa";
import CreatePlayer from "./CreatePlayer";
import { IPlayer } from "@/interface/player.interface";
import { IPagination } from "@/interface/pagination.interface";
import Pagination from "./Pagination";
import { toast } from "sonner";

export default function Players(props: { groupId: string }) {
    const { groupId } = props;
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [pagination, setPagination] = useState<IPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playerToEdit, setPlayerToEdit] = useState<IPlayer | undefined>(undefined);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchPlayers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: "10",
                ...(debouncedSearch ? { search: debouncedSearch } : {}),
            });
            const response = await fetch(`/api/group/${groupId}/player?${params}`);
            if (!response.ok) throw new Error("Falha ao buscar jogadores");
            const data = await response.json();
            setPlayers(data.players || []);
            setPagination(data.pagination);
        } catch {
            toast.error("Erro ao buscar jogadores");
        } finally {
            setLoading(false);
        }
    }, [groupId, currentPage, debouncedSearch]);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(value);
            setCurrentPage(1);
        }, 400);
    };

    const handleDeletePlayer = async (id: string) => {
        try {
            const response = await fetch(`/api/group/${groupId}/player/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Erro ao deletar jogador");
            toast.success("Jogador removido com sucesso");
            fetchPlayers();
        } catch {
            toast.error("Falha ao remover jogador");
        }
    };

    const playerModal = isModalOpen ? (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-300"
            onClick={() => {
                setIsModalOpen(false);
                setPlayerToEdit(undefined);
            }}
        >
            <div
                className="glass-panel rounded-[2.5rem] border border-white/10 w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 bg-noise"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                    <div className="flex flex-col gap-1">
                        <h3 className="font-black text-foreground text-2xl uppercase italic tracking-tighter">
                            {playerToEdit ? "Editar Perfil" : "Contratar Atleta"}
                        </h3>
                        <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-50">Configuracao de elenco de elite</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                            setPlayerToEdit(undefined);
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl glass-panel border-white/10 hover:bg-white/5 text-foreground transition-all active:scale-90"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="p-8">
                    <CreatePlayer
                        id={groupId}
                        playerToEdit={playerToEdit}
                        onSuccess={() => {
                            fetchPlayers();
                            setIsModalOpen(false);
                            setPlayerToEdit(undefined);
                        }}
                    />
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="space-y-8 bg-noise p-1 animate-in fade-in duration-700">
            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="BUSCAR ATLETA NO ELENCO..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 glass-panel border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary/50 transition-all placeholder:text-secondary/30"
                    />
                </div>

                <Button
                    onClick={() => {
                        setPlayerToEdit(undefined);
                        setIsModalOpen(true);
                    }}
                    variant="primary"
                    className="w-full md:w-auto px-8 py-4 rounded-2xl uppercase font-black tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.5)] animate-shimmer"
                >
                    <FaPlus /> Novo Atleta
                </Button>
            </div>

            {/* Tactical Table Area */}
            <div className="glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface/40 text-secondary/50 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-8 py-6">Atleta</th>
                            <th className="px-8 py-6 hidden sm:table-cell">Status</th>
                            <th className="px-8 py-6 text-right">Acoes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="py-20 text-center">
                                    <FaSpinner className="mx-auto h-8 w-8 animate-spin text-primary" />
                                </td>
                            </tr>
                        ) : players.length > 0 ? (
                            players.map((player) => (
                                <tr key={player.id} className="group hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-blue-700 flex items-center justify-center font-black text-white shadow-xl group-hover:scale-110 transition-transform border border-white/10">
                                                    <FaUser className="w-6 h-6 opacity-80" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">
                                                    {player.name}
                                                </span>
                                                <span className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-50 mt-1">ID: #{player.id.slice(-4)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 hidden sm:table-cell">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Disponivel</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setPlayerToEdit(player);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-3 text-secondary hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                                                title="Editar"
                                            >
                                                <FaPen size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlayer(player.id)}
                                                className="p-3 text-secondary hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                                                title="Excluir"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-20 text-center space-y-4">
                                    <FaUser className="mx-auto h-12 w-12 text-secondary/20" />
                                    <p className="text-secondary font-black uppercase tracking-widest text-xs">Nenhum atleta encontrado no elenco</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {playerModal && typeof document !== "undefined" ? createPortal(playerModal, document.body) : null}
        </div>
    );
}
