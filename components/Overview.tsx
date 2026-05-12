"use client";

import { FaFutbol, FaTrophy, FaUsers } from "react-icons/fa";
import { motion } from "motion/react";

const cards = [
    {
        title: "Destaques",
        description: "Em breve: estatísticas gerais do grupo.",
        icon: FaTrophy,
        accent: "text-yellow-500",
    },
    {
        title: "Última Partida",
        description: "Nenhuma partida registrada ainda.",
        icon: FaFutbol,
        accent: "text-primary",
    },
    {
        title: "Elenco",
        description: "Acompanhe jogadores, presença e desempenho.",
        icon: FaUsers,
        accent: "text-accent",
    },
];

export default function Overview(props: { groupId: string }) {
    const { groupId } = props;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 background-container p-1">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <motion.div
                        key={`${groupId}-${card.title}`}
                        className="relative overflow-hidden rounded-2xl bg-surface/30 border border-border p-6 glass-panel"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 140, damping: 18, delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
                        <div className="relative z-10">
                            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 border border-white/10">
                                <Icon className={card.accent} aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-3 uppercase tracking-tight">
                                {card.title}
                            </h3>
                            <p className="text-secondary text-sm leading-relaxed">{card.description}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
