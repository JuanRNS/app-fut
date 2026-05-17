"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CreateGroupModal from "./modais/CreateGroupModal";
import { motion } from "motion/react";

export default function CreateGroupCard(props: { fetchGroups: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="block group cursor-pointer w-full h-full text-left"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                aria-label="Criar novo grupo de futebol"
            >
                <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 border border-white/5 backdrop-blur-xl transition-colors duration-300 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex flex-col items-center justify-center text-center gap-4 min-h-[180px] bg-noise">
                    <motion.div
                        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-accent opacity-60"
                        initial={{ width: "20%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    />

                    <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[60px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                    <motion.div
                        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl glass-panel border border-white/10 shadow-xl group-hover:border-primary/50"
                        whileHover={{ rotate: 6, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    >
                        <FaPlus className="text-primary w-7 h-7 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                    </motion.div>

                    <div className="relative z-10 space-y-2 text-center">
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                            Criar Nova Pelada
                        </h3>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] max-w-[200px] mx-auto opacity-70">
                            Organize seu time agora
                        </p>
                    </div>

                    <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            Iniciar <span className="w-4 h-px bg-primary" />
                        </span>
                    </div>
                </div>
            </motion.button>

            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchGroups={props.fetchGroups}
            />
        </>
    );
}
