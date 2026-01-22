import { IResponsePlayer } from "@/interface/player.interface";
import { useEffect, useState } from "react";

export default function Ranking(props: { id: string }) {
    const [ranking, setRanking] = useState<IResponsePlayer[]>([]);

    useEffect(() => {
        getRanking();
    }, []);

    async function getRanking() {
        const response = await fetch(`/api/group/${props.id}/ranking`);
        const data = await response.json();
        setRanking(data);
    }
    const sortedRanking = [...ranking].sort((a, b) => b.goals - a.goals);

    return (<div className="rounded-xl bg-surface/30 border border-white/5 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                <tr>
                    <th className="p-4 font-medium">Pos</th>
                    <th className="p-4 font-medium">Jogador</th>
                    <th className="p-4 font-medium text-center">Gols</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {sortedRanking.map((player, index) => (
                    <tr key={player.id}>
                        <td className="p-4 font-medium">{index + 1}</td>
                        <td className="p-4 font-medium">{player.name}</td>
                        <td className="p-4 font-medium text-center">{player.goals}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}