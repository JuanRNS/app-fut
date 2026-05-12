"use client";

import CreateGroupCard from "@/components/CreateGroupCard";
import GroupCard from "@/components/GroupCard";
import { IResponseGroup } from "../../interface/group.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, type Variants } from "motion/react";
import { FaChartLine, FaShieldHalved, FaTrophy } from "react-icons/fa6";

const containerMotion: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const sectionMotion: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 18 },
    },
};

export default function HomePage() {
    const [groups, setGroups] = useState<IResponseGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch("/api/group", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data: IResponseGroup[] = await response.json();
            setGroups(data);
        } catch {
            toast.error("Erro ao buscar grupos");
        } finally {
            setLoading(false);
        }
    };

    const totalGroups = groups.length;

    return (
        <motion.div
            className="flex h-full w-full max-w-[1600px] flex-col gap-6 overflow-hidden bg-noise"
            variants={containerMotion}
            initial="hidden"
            animate="visible"
        >
            <motion.section
                variants={sectionMotion}
                className="relative flex shrink-0 flex-col items-center justify-between gap-6 overflow-hidden rounded-[2rem] border-white/5 p-6 shadow-2xl glass-panel md:p-8 lg:flex-row xl:min-h-[300px]"
            >
                <motion.div
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-accent opacity-70"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-[90px] pointer-events-none" />
                <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[90px] pointer-events-none" />

                <div className="z-10 flex flex-col gap-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto md:mx-0">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-live" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sistema Online</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-foreground xl:text-5xl 2xl:text-6xl">
                        Bem-vindo ao <span className="text-primary italic">FutApp</span>
                    </h1>
                    <p className="max-w-lg text-base font-medium leading-relaxed text-secondary xl:text-lg">
                        Gerencie seus grupos de futebol com precisão de elite. Organize partidas, acompanhe estatísticas e domine o campo.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                        {["Grupos", "Partidas", "Ranking"].map((item) => (
                            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="relative hidden shrink-0 md:block"
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                    <div className="grid h-40 w-40 place-items-center rounded-full border border-primary/20 bg-surface/60 shadow-[0_0_60px_rgba(37,99,235,0.22)] backdrop-blur-xl 2xl:h-48 2xl:w-48">
                        <div className="grid h-24 w-24 place-items-center rounded-[1.75rem] bg-gradient-to-br from-primary to-accent text-white shadow-2xl shadow-primary/30 2xl:h-28 2xl:w-28">
                            <FaTrophy className="h-10 w-10 2xl:h-12 2xl:w-12" aria-hidden="true" />
                        </div>
                    </div>
                    <motion.div
                        className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-3xl"
                        animate={{ opacity: [0.45, 0.9, 0.45], scale: [0.96, 1.04, 0.96] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.section>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden xl:grid-cols-4 xl:gap-8">
                <motion.aside variants={sectionMotion} className="grid min-h-0 gap-5 xl:col-span-1">
                    <div className="space-y-3">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary/50 px-2">Ações Rápidas</h2>
                        <CreateGroupCard fetchGroups={fetchGroups} />
                    </div>

                    <motion.div
                        className="space-y-4 overflow-hidden rounded-3xl border-white/5 p-5 glass-panel"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-black uppercase tracking-widest text-xs text-primary">Estatísticas Globais</h3>
                            <FaChartLine className="text-accent" aria-hidden="true" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-white/5 bg-surface/40 p-3">
                                <p className="text-2xl font-black text-foreground">{totalGroups}</p>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Grupos</p>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-surface/40 p-3">
                                <p className="text-2xl font-black text-foreground">{totalGroups > 0 ? "Ativo" : "--"}</p>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Status</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.aside>

                <motion.section variants={sectionMotion} className="min-h-0 space-y-6 overflow-hidden xl:col-span-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground italic">Seus Grupos de Elite</h2>
                        </div>
                        <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-2xl border-white/5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{totalGroups} Grupos Sincronizados</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-56 glass-panel rounded-[2rem]" />
                            ))}
                        </div>
                    ) : totalGroups > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8"
                            variants={containerMotion}
                            initial="hidden"
                            animate="visible"
                        >
                            {groups.map((group, index) => (
                                <GroupCard key={group.id} group={group} index={index} fetchGroups={fetchGroups} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="glass-panel rounded-3xl p-10 md:p-20 text-center border-dashed border-white/10 space-y-5"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 160, damping: 18 }}
                        >
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                                <FaShieldHalved className="h-7 w-7" aria-hidden="true" />
                            </div>
                            <p className="text-secondary font-black uppercase tracking-widest text-sm">Nenhum grupo encontrado</p>
                            <p className="text-secondary/50 text-xs">Comece criando seu primeiro grupo de futebol.</p>
                        </motion.div>
                    )}
                </motion.section>
            </div>
        </motion.div>
    );
}
