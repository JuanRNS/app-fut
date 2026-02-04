import { IPagination } from "@/interface/pagination.interface";
import { IResponsePlayerRanking, IResponseRanking } from "@/interface/player.interface";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";

export default function Ranking(props: { id: string }) {
    const [players, setPlayers] = useState<IResponsePlayerRanking[]>([]);
    const [pagination, setPagination] = useState<IPagination>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getRanking();
    }, [currentPage]);

    async function getRanking() {
        const response = await fetch(`/api/group/${props.id}/ranking?page=${currentPage}&limit=5`);
        const data: IResponseRanking = await response.json();
        setPlayers(data.players);
        setPagination(data.pagination);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-surface/30 border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Pos</th>
                            <th className="p-4 font-medium">Jogador</th>
                            <th className="p-4 font-medium text-center">Gols</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {players.map((player, index) => (
                            <tr key={player.id}>
                                <td className="p-4 font-medium">
                                    {(currentPage - 1) * 5 + index + 1}
                                </td>
                                <td className="p-4 font-medium">{player.name}</td>
                                <td className="p-4 font-medium text-center">{player.goals}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="flex justify-center mt-4 text-black">
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