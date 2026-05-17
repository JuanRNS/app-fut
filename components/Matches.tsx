import MatchDetails from "./MatchDetails";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { IMatchResponse } from "@/interface/match.interface";
import { IPagination } from "@/interface/pagination.interface";
import Pagination from "./Pagination";
import { toast } from "sonner";

export default function Matches({ groupId }: { groupId: string }) {
    const [matches, setMatches] = useState<IMatchResponse | null>(null);
    const [pagination, setPagination] = useState<IPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchGroup = useCallback(async () => {
        try {
            const response = await fetch(`/api/group/${groupId}/match?page=${currentPage}&limit=5`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            setMatches(data);
            setPagination(data.pagination);
        } catch {
            toast.error("Erro ao sincronizar histórico de partidas");
            setMatches({ matches: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } });
        }
    }, [groupId, currentPage]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!matches) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h2 className="text-xl text-white font-bold">Grupo não encontrado</h2>
                <Link href="/home" className="text-primary hover:underline">Voltar para Home</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {matches?.matches?.length ? (
                matches.matches.map((match) => (
                    <MatchDetails key={match.id} match={match} groupId={groupId} fetchGroup={fetchGroup} />
                ))
            ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma partida realizada.</p>
            )}
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

    );
}


