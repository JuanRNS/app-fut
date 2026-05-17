"use client";

import { useState } from "react";
import { IGroupCardProps } from "@/interface/group.interface";
import { FaBars, FaPen, FaTrash, FaUsers } from "react-icons/fa6";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import CreateGroupModal from "./modais/CreateGroupModal";

export default function GroupCard({ group, index = 0, fetchGroups }: IGroupCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/group/${group.id}`);
    };

    return (
        <>
        <motion.article
            className="relative w-full max-w-md cursor-pointer group"
            onClick={handleClick}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: index * 0.04 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.985 }}
        >
            <div className="glass-panel relative rounded-2xl border border-white/5 transition-colors duration-300 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-4 h-full min-h-[196px] overflow-hidden bg-noise">
                <motion.div
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.03 }}
                />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-40" />

                <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/15">
                                <FaUsers className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300 break-words flex-1 uppercase tracking-tighter">
                                {group.name}
                            </h3>
                        </div>

                        <div className="relative">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                variant="ghost"
                                aria-label="Abrir menu do grupo"
                                className="min-h-11 min-w-11 p-2 text-secondary hover:text-foreground transition-all rounded-xl hover:bg-white/5"
                            >
                                <FaBars className="w-5 h-5" />
                            </Button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <>
                                        <motion.div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                        <motion.div
                                            className="absolute right-0 top-full mt-2 w-40 glass-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                            transition={{ duration: 0.18, ease: "easeOut" }}
                                        >
                                            <button
                                                className="w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-widest text-foreground/80 hover:bg-primary hover:text-white flex items-center gap-3 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMenuOpen(false);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                <FaPen className="w-3 h-3" /> Editar
                                            </button>
                                            <button
                                                className="w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-3 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.info(`Excluir grupo ${group.name}`);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <FaTrash className="w-3 h-3" /> Excluir
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <p className="text-secondary text-sm font-medium line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {group.description || "Sem descrição disponível."}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary/60">Abrir grupo</span>
                        <motion.span
                            className="h-px w-12 bg-primary"
                            initial={{ scaleX: 0.35 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </div>
            </div>
        </motion.article>

        <CreateGroupModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            fetchGroups={fetchGroups}
            groupToEdit={{
                id: group.id,
                name: group.name,
                description: group.description,
            }}
        />
        </>
    );
}
