import { IPlayer, IPlayerMatch } from "@/interface/player.interface";
import { FaPlus, FaTimes, FaUserShield } from "react-icons/fa";
import PlayerCard from "../PlayerCard";
import Button from "../ui/Button";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { toast } from 'sonner';
import Input from "../ui/Input";

export default function PlayerSelectionModal({
    selectingFor,
    setSelectingFor,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
    players
}: {
    selectingFor: 'HOME' | 'AWAY' | null;
    setSelectingFor: (team: 'HOME' | 'AWAY' | null) => void;
    teamA: IPlayer[];
    teamB: IPlayer[];
    setTeamA: Dispatch<SetStateAction<IPlayer[]>>;
    setTeamB: Dispatch<SetStateAction<IPlayer[]>>;
    players: IPlayer[];
}) {
    const [selectedPlayers, setSelectedPlayers] = useState<IPlayerMatch[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [availablePlayers, setAvailablePlayers] = useState<IPlayer[]>([]);

    useEffect(() => {
        const availablePlayers = players.filter(p =>
            !teamA.some(ta => ta.id === p.id) &&
            !teamB.some(tb => tb.id === p.id)
        ).sort((a, b) => a.name.localeCompare(b.name));
        setAvailablePlayers(availablePlayers);
    }, [teamA, teamB]);


    const handleAddPlayer = (listPlayers: IPlayerMatch[]) => {
        console.log(listPlayers);
        listPlayers.forEach(player => {
            if (player.team === 'HOME') {
                setTeamA(prev => prev.length < 5 ? [...prev, player] : prev);
            } else if (player.team === 'AWAY') {
                setTeamB(prev => prev.length < 5 ? [...prev, player] : prev);
            }
        })
        setSelectingFor(null);
        setSelectedPlayers([]);
    };

    const addPlayerList = (player: IPlayer) => {
        if (selectedPlayers.some(p => p.id === player.id)) {
            toast.error("Jogador já selecionado");
            return;
        }

        const teamA = selectedPlayers.filter(p => p.team === 'HOME');
        const teamB = selectedPlayers.filter(p => p.team === 'AWAY');

        if (teamA.length === 5) {
            toast.error("Time A já tem 5 jogadores");
            return;
        }
        if (teamB.length === 5) {
            toast.error("Time B já tem 5 jogadores");
            return;
        }
        setSelectedPlayers(prev => [...prev, { ...player, team: selectingFor! }]);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filteredPlayers = players.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        const availablePlayers = filteredPlayers.filter(p =>
            !teamA.some(ta => ta.id === p.id) &&
            !teamB.some(tb => tb.id === p.id)
        ).sort((a, b) => a.name.localeCompare(b.name));
        setAvailablePlayers(availablePlayers);
    };
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectingFor(null)}
        >
            <div
                className="bg-surface rounded-2xl border border-border w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2" onClick={() => setSelectedPlayers([])}>
                        <FaPlus className="text-primary" />
                        Adicionar ao Time {selectingFor === 'HOME' ? 'A' : 'B'}
                    </h3>
                    <button
                        onClick={() => setSelectingFor(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover text-foreground/60 hover:text-foreground transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-[200px]">
                    <Input
                        placeholder="Buscar jogador"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {availablePlayers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-12 text-gray-500 gap-3">
                            <FaUserShield className="w-12 h-12 opacity-20" />
                            <p>Nenhum jogador disponível</p>
                        </div>
                    ) : (
                        availablePlayers.map(player => (
                            <div key={player.id} className="transform transition-all duration-200 hover:scale-[1.01]">
                                <PlayerCard
                                    name={player.name}
                                    id={player.id}
                                    isMatch={true}
                                    isSelected={selectedPlayers.some(p => p.id === player.id)}
                                    onClick={() => addPlayerList(player)}
                                />
                            </div>
                        ))
                    )}
                    <Button onClick={() => handleAddPlayer(selectedPlayers)}>
                        Adicionar Jogadores
                    </Button>
                </div>
            </div>
        </div>
    );
}