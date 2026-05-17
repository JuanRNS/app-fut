import { IPagination } from "@/interface/pagination.interface";
import { IResponsePlayerRanking, IResponseRanking } from "@/interface/player.interface";
import { useEffect, useState, useCallback } from "react";
import Pagination from "./Pagination";
import { FaCrown, FaTrophy, FaMedal } from "react-icons/fa6";
import { toast } from "sonner";

export default function Ranking(props: { id: string }) {
    const [players, setPlayers] = useState<IResponsePlayerRanking[]>([]);
    const [pagination, setPagination] = useState<IPagination>();
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');

    const getRanking = useCallback(async () => {
        try {
            const response = await fetch(`/api/group/${props.id}/ranking?page=${currentPage}&limit=5&filter=${filter}`);
            if (!response.ok) throw new Error("Falha ao carregar ranking");
            const data: IResponseRanking = await response.json();
            setPlayers(data.players || []);
            setPagination(data.pagination);
        } catch {
            toast.error("Erro ao sincronizar ranking de elite");
            setPlayers([]);
        }
    }, [props.id, currentPage, filter]);

    useEffect(() => {
        getRanking();
    }, [getRanking]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getRankIcon = (index: number) => {
        const absoluteRank = (currentPage - 1) * 5 + index + 1;
        if (absoluteRank === 1) return <FaCrown className="text-yellow-500 animate-bounce" />;
        if (absoluteRank === 2) return <FaTrophy className="text-gray-400" />;
        if (absoluteRank === 3) return <FaMedal className="text-amber-700" />;
        return null;
    };

    return (
        <div className="space-y-6 bg-noise p-1">
            <div className="flex justify-between items-center px-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary/50">Classificação de Elite</h2>
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="glass-panel text-foreground border border-white/5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:border-primary/50 transition-all shadow-lg"
                >
                    <option value="all">Ranking Geral</option>
                    <option value="daily">Ranking do Dia</option>
                    <option value="monthly">Ranking Mensal</option>
                </select>
            </div>

            <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                
                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface/40 text-secondary/50 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-8 py-5 text-center w-24">Pos</th>
                            <th className="px-8 py-5">Jogador</th>
                            <th className="px-8 py-5 text-right w-32">Gols</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold">
                        {players.map((player, index) => {
                            const rank = (currentPage - 1) * 5 + index + 1;
                            const isTop3 = rank <= 3;

                            return (
                                <tr key={player.id} className="group hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className={`text-2xl italic tracking-tighter tabular-nums ${isTop3 ? 'text-primary' : 'text-foreground/40'}`}>
                                                #{rank.toString().padStart(2, '0')}
                                            </span>
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-transform group-hover:scale-110 border border-white/10 ${isTop3 ? 'bg-foreground text-surface' : 'bg-surface text-foreground/40'}`}>
                                                    {player.name.charAt(0).toUpperCase()}
                                                </div>
                                                {isTop3 && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface animate-pulse-live" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                                    {player.name}
                                                </span>
                                                <span className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-50">
                                                    Atacante de Elite
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-3xl font-black tabular-nums tracking-tighter drop-shadow-lg ${player.goals > 0 ? 'text-foreground' : 'text-foreground/20'}`}>
                                                {player.goals}
                                            </span>
                                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-50">Gols Marcados</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {players.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <span className="text-4xl opacity-20">📊</span>
                        <p className="text-secondary font-black uppercase tracking-widest text-xs">Dados insuficientes para classificação</p>
                    </div>
                )}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    )
}