import { FaTrophy, FaFutbol } from "react-icons/fa";

export default function Overview(props: { groupId: string }) {
    const { groupId } = props;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 background-container p-4">
            <div className="rounded-xl bg-surface/30 border border-white/5 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" /> Destaques
                </h3>
                <p className="text-secondary text-sm italic">Em breve: estatísticas gerais do grupo.</p>
            </div>
            <div className="rounded-xl bg-surface/30 border border-white/5 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaFutbol className="text-primary" /> Última Partida
                </h3>
                <p className="text-secondary text-sm italic">Nenhuma partida registrada ainda.</p>
            </div>
        </div>
    );
}