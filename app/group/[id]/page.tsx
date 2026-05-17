"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSpinner, FaChevronDown } from "react-icons/fa";
import { FaArrowLeft, FaBan, FaChartLine, FaFutbol } from "react-icons/fa6";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Ranking from "@/components/Ranking";
import Matches from "@/components/Matches";
import CreateMatch from "@/components/CreateMatch";
import Players from "@/components/Players";
import { toast } from "sonner";
import Overview from "@/components/Overview";
import { TABS } from "@/constants/tabs.constants";
import { AnimatePresence, motion, type Variants } from "motion/react";

const pageMotion: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const blockMotion: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 130, damping: 18 },
    },
};

export default function GroupPage() {
    const params = useParams();
    const id = params?.id as string;

    const [group, setGroup] = useState<{ id: string; name: string; description: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const handleLocationChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const tab = urlParams.get("tab");
            if (tab) setActiveTab(tab);
        };

        handleLocationChange();
        window.addEventListener("popstate", handleLocationChange);
        return () => window.removeEventListener("popstate", handleLocationChange);
    }, []);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tabId);
        window.history.pushState({}, "", url);
        window.dispatchEvent(new Event("popstate"));
    };

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) return;

            try {
                const response = await fetch(`/api/group/${id}`);
                if (!response.ok) throw new Error("Falha ao buscar grupo");
                const data = await response.json();
                setGroup({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                });
            } catch {
                toast.error("Erro ao buscar grupo");
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <FaSpinner className="w-12 h-12 animate-spin text-primary" />
                <p className="text-secondary font-black uppercase tracking-widest text-xs">Carregando táticas...</p>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-noise">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-red-500/10 text-red-400">
                    <FaBan className="h-8 w-8" aria-hidden="true" />
                </div>
                <h2 className="text-2xl text-foreground font-black uppercase tracking-tighter">Grupo não encontrado</h2>
                <Link href="/home">
                    <Button variant="primary" className="px-8 py-3 rounded-2xl uppercase font-black tracking-widest text-xs">
                        <FaArrowLeft className="mr-2" /> Voltar para Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className="w-full space-y-10 pb-20 bg-noise"
            variants={pageMotion}
            initial="hidden"
            animate="visible"
        >
            <motion.section
                variants={blockMotion}
                className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] glass-panel p-6 md:p-12 border-white/5 shadow-2xl"
            >
                <motion.div
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-blue-400 to-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.75, ease: "easeOut" }}
                />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex flex-col gap-4 text-left">
                        <Link href="/home" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] w-fit">
                            <FaArrowLeft /> Voltar ao Início
                        </Link>

                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase italic tracking-tighter leading-none mb-4">
                                {group.name}
                            </h1>
                            <p className="text-secondary font-medium text-lg max-w-xl leading-relaxed opacity-90 italic">
                                &quot;{group.description || "Sem descrição disponível para este grupo de elite."}&quot;
                            </p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-4 lg:w-auto">
                        <motion.div
                            className="glass-panel rounded-2xl p-5 border-white/5 flex flex-col items-center min-w-[120px]"
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 240, damping: 20 }}
                        >
                            <FaFutbol className="mb-2 text-primary" aria-hidden="true" />
                            <span className="text-3xl font-black text-primary">--</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mt-1">Partidas</span>
                        </motion.div>
                        <motion.div
                            className="glass-panel rounded-2xl p-5 border-white/5 flex flex-col items-center min-w-[120px]"
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 240, damping: 20 }}
                        >
                            <FaChartLine className="mb-2 text-accent" aria-hidden="true" />
                            <span className="text-3xl font-black text-accent">--</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mt-1">Média Gols</span>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.nav variants={blockMotion} className="lg:hidden relative">
                {(() => {
                    const activeTabData = TABS.find((t) => t.id === activeTab);
                    const ActiveIcon = activeTabData?.icon;
                    return (
                        <>
                            {ActiveIcon && (
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
                                    <ActiveIcon size={14} />
                                </div>
                            )}
                            <select
                                value={activeTab}
                                onChange={(e) => handleTabChange(e.target.value)}
                                className="w-full glass-panel text-foreground border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:border-primary/50 transition-all shadow-lg appearance-none"
                            >
                                {TABS.map((tab) => (
                                    <option key={tab.id} value={tab.id} className="bg-surface text-foreground">
                                        {tab.label}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={12} />
                        </>
                    );
                })()}
            </motion.nav>

            <motion.section variants={blockMotion} className="min-h-[400px]">
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full hidden lg:block" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 14, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.99 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            {activeTab === "overview" && <Overview groupId={id} />}
                            {activeTab === "players" && <Players groupId={id} />}
                            {activeTab === "createMatch" && <CreateMatch groupId={id} />}
                            {activeTab === "matches" && <Matches groupId={id} />}
                            {activeTab === "ranking" && <Ranking id={id} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.section>
        </motion.div>
    );
}
