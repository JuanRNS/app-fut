import MatchDetails from "./MatchDetails";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IMatchResponse } from "@/interface/match.interface";
import { IPagination } from "@/interface/pagination.interface";
import Pagination from "./Pagination";

export default function Matches({ groupId }: { groupId: string }) {
    const [matches, setMatches] = useState<IMatchResponse | null>(null);
    const [pagination, setPagination] = useState<IPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchGroup();
    }, [groupId, currentPage])

    async function fetchGroup() {
        const response = await fetch(`/api/group/${groupId}?page=${currentPage}&limit=5`);
        const data = await response.json();
        setMatches(data);
        setPagination(data.pagination);
    }

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

    );
}


