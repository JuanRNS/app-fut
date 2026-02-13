"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Ranking from "@/components/Ranking";
import Matches from "@/components/Matches";
import CreateMatch from "@/components/CreateMatch";
import Players from "@/components/Players";
import { toast } from "sonner";
import Overview from "@/components/Overview";
import { TABS } from "@/constants/tabs.constants";
import MobileMenuOpen from "@/components/MobileMenuOpen";

export default function GroupPage() {
    const params = useParams();
    const id = params?.id as string;

    const [group, setGroup] = useState<{ id: string; name: string; description: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const tabs = TABS;

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
                        <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
                        <p className="text-secondary">{group.description}</p>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex justify-between items-center gap-2 overflow-x-auto pb-2 scrollbar-hide background-container p-4">
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

            <div className="md:hidden relative">
                <MobileMenuOpen tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "overview" && (
                    <Overview groupId={id} />
                )}

                {activeTab === "players" && (
                    <Players groupId={id} />
                )}

                {activeTab === "createMatch" && (
                    <CreateMatch groupId={id} />
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
