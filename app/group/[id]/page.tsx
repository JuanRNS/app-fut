"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUsers, FaFutbol, FaTrophy, FaChartBar, FaSpinner, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { IGroupDetails } from "@/interface/group.interface";
import Button from "@/components/ui/Button";
import Ranking from "@/components/Ranking";
import Matches from "@/components/Matches";
import CreateMatch from "@/components/CreateMatch";
import Players from "@/components/Players";
import { toast } from "sonner";
import Overview from "@/components/Overview";

export default function GroupPage() {
    const params = useParams();
    const id = params?.id as string;

    const [group, setGroup] = useState<IGroupDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tabs = [
        { id: "overview", label: "Visão Geral", icon: FaChartBar },
        { id: "players", label: "Jogadores", icon: FaUsers },
        { id: "matches", label: "Partidas", icon: FaFutbol },
        { id: "ranking", label: "Ranking", icon: FaTrophy },
        { id: "createMatch", label: "Cria Partida", icon: FaPlus },
    ];

    const fetchGroup = async () => {
        if (!id) return;

        try {
            const response = await fetch(`/api/group/${id}`);
            if (!response.ok) throw new Error("Falha ao buscar grupo");
            const data = await response.json();
            setGroup(data);
        } catch (error) {
            toast.error("Erro ao buscar grupo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FaSpinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h2 className="text-xl text-primary font-bold">Grupo não encontrado</h2>
                <Link href="/home" className="text-primary hover:underline">Voltar para Home</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4">
            <div className="flex-1 relative rounded-2xl bg-surface border border-border backdrop-blur-md p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                    <Link href="/home" className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors w-fit">
                        <FaArrowLeft /> Voltar
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{group.group.name}</h1>
                        <p className="text-secondary">{group.group.description}</p>
                    </div>

                    <div className="flex gap-4 text-sm text-secondary mt-2">
                        <span className="flex items-center gap-2">
                            <FaUsers className="text-primary" /> {group.players.length} Jogadores
                        </span>
                        <span className="flex items-center gap-2">
                            <FaFutbol className="text-primary" /> {group.matches.length} Partidas
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            variant="secondary"
                            isActive={isActive}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon />
                            {tab.label}
                        </Button>
                    );
                })}
            </div>

            <div className="md:hidden relative z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl text-foreground font-bold backdrop-blur-md transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-2">
                        {(() => {
                            const currentTab = tabs.find(t => t.id === activeTab);
                            const Icon = currentTab?.icon || FaChartBar;
                            return (
                                <>
                                    <Icon className="text-primary" />
                                    <span>{currentTab?.label}</span>
                                </>
                            );
                        })()}
                    </div>
                    {isMobileMenuOpen ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-secondary" />}
                </button>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-2 px-4 py-3 transition-colors ${isActive
                                        ? "bg-primary/20 text-primary border-l-4 border-primary"
                                        : "text-secondary hover:bg-white/5 hover:text-foreground border-l-4 border-transparent"
                                        }`}
                                >
                                    <Icon className={isActive ? "text-primary" : ""} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                    <Overview />
                )}

                {activeTab === "players" && (
                    <Players group={group} fetchGroup={fetchGroup} />
                )}

                {activeTab === "createMatch" && (
                    <CreateMatch group={group} />
                )}

                {activeTab === "matches" && (
                    <Matches groupId={id} />
                )}

                {activeTab === "ranking" && (
                    <Ranking id={id} />
                )}
            </div>
        </div>
    );
}
