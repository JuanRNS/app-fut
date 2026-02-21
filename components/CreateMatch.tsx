import { useEffect, useState } from "react";
import { FaFutbol, FaSpinner } from "react-icons/fa";
import MatchInterface from "./MatchInterface";
import Button from "./ui/Button";
import { IPlayer } from "@/interface/player.interface";
import { toast } from "sonner";

export default function CreateMatch(props: { groupId: string }) {
    const { groupId } = props;
    const [isMatchActive, setIsMatchActive] = useState(false);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedMatchId = localStorage.getItem('matchId');
        if (storedMatchId) {
            setIsMatchActive(true);
        }
        fetchPlayers();
    }, [groupId]);

    const fetchPlayers = async () => {
        try {
            const response = await fetch(`/api/group/${groupId}/player`);
            if (!response.ok) throw new Error("Falha ao buscar jogadores");
            const data = await response.json();
            setPlayers(data || []);
        } catch (error) {
            toast.error("Erro ao buscar jogadores");
        } finally {
            setLoading(false);
        }
    };

    const finishMatch = () => {
        setIsMatchActive(false);
        localStorage.removeItem('matchId');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <FaSpinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 background-container">
            {!isMatchActive ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FaFutbol className="w-16 h-16 text-primary mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold text-white mb-2">Iniciar Nova Partida</h3>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Comece uma partida agora para cronometrar e registrar estatísticas em tempo real.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => setIsMatchActive(true)}
                        className="px-8 py-3 text-lg"
                    >
                        Começar Partida
                    </Button>
                </div>
            ) : (
                <MatchInterface
                    players={players}
                    onFinish={finishMatch}
                    groupId={groupId}
                />
            )}
        </div>
    )
}