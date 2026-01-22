import { useState } from "react";
import { FaFutbol } from "react-icons/fa";
import MatchInterface from "./MatchInterface";
import { IGroupDetails } from "@/interface/group.interface";
import Button from "./ui/Button";

export default function CreateMatch(props: { group: IGroupDetails }) {
    const { group } = props;
    const [isMatchActive, setIsMatchActive] = useState(false);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    players={group.players || []}
                    onFinish={() => setIsMatchActive(false)}
                    groupId={group.id}
                />
            )}
        </div>
    )
}