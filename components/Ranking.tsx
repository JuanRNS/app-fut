import { IPagination } from "@/interface/pagination.interface";
import { IResponsePlayerRanking, IResponseRanking } from "@/interface/player.interface";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";

export default function Ranking(props: { id: string }) {
    const [players, setPlayers] = useState<IResponsePlayerRanking[]>([]);
    const [pagination, setPagination] = useState<IPagination>();
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        getRanking();
    }, [currentPage, filter]);

    async function getRanking() {
        const response = await fetch(`/api/group/${props.id}/ranking?page=${currentPage}&limit=5&filter=${filter}`);
        const data: IResponseRanking = await response.json();
        setPlayers(data.players);
        setPagination(data.pagination);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="bg-surface text-foreground border border-white/10 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/30 transition-colors"
                >
                    <option value="all">Ranking Geral</option>
                    <option value="daily">Ranking do Dia</option>
                    <option value="monthly">Ranking Mensal</option>
                </select>
            </div>
            <div className="rounded-xl bg-surface border border-white/10 overflow-hidden shadow-sm">
                <table className="w-full text-center">
                    <thead className="bg-hover/50 text-foreground/70 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-large">Pos</th>
                            <th className="p-4 font-large">Jogador</th>
                            <th className="p-4 font-large text-center">Gols</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-foreground font-bold">
                        {players.map((player, index) => (
                            <tr key={player.id} className="hover:bg-hover/30 transition-colors">
                                <td className="p-4 font-large">
                                    {(currentPage - 1) * 5 + index + 1}
                                </td>
                                <td className="p-4 font-large">{player.name}</td>
                                <td className="p-4 font-large text-center">{player.goals}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="flex justify-center mt-4 text-foreground">
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