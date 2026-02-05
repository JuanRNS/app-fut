import { IGroupDetails } from "@/interface/group.interface";
import PlayerCard from "./PlayerCard";
import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { FaPlus, FaTimes } from "react-icons/fa";
import CreatePlayer from "./CreatePlayer";

export default function Players(props: { group: IGroupDetails, fetchGroup: () => void }) {
    const { group, fetchGroup } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchGroup();
    }, []);

    const handleDeletePlayer = async (id: string) => {
        const response = await fetch(`/api/group/${id}/player`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar jogador");
        }
        fetchGroup();
    }
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} variant="primary" className="flex items-center gap-2">
                    <FaPlus /> Novo Jogador
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.players?.length > 0 ? (
                    group.players.map((player) => (
                        <PlayerCard key={player.id} name={player.name} id={player.id} onDelete={() => handleDeletePlayer(player.id)} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">Nenhum jogador cadastrado.</p>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-surface rounded-2xl border border-border w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
                            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                                <FaPlus className="text-primary" />
                                Adicionar Novo Jogador
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover text-foreground/60 hover:text-foreground transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <CreatePlayer id={group.group.id} onSuccess={() => {
                                fetchGroup();
                                setIsModalOpen(false);
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}