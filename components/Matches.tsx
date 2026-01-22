import { IGroupDetails } from "@/interface/group.interface";
import MatchDetails from "./MatchDetails";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IMatch, IMatchResponse } from "@/interface/match.interface";

export default function Matches({ groupId }: { groupId: string }) {
    const [matches, setMatches] = useState<IMatchResponse | null>(null);
    useEffect(() => {
        fetchGroup();
    }, [groupId])

    const fetchGroup = async () => {
        const response = await fetch(`/api/group/${groupId}`);
        const data = await response.json();
        setMatches(data);
    }

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
        </div>
    );
}


