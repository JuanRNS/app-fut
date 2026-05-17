"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaFutbol, FaHouse, FaOutdent } from "react-icons/fa6";
import { logout } from "@/lib/logout";
import { SidebarProps } from "@/interface/sidebar.interface";
import { TABS } from "@/constants/tabs.constants";
import { motion } from "motion/react";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const params = useParams();
    const groupId = params?.id as string;
    const [activeTab, setActiveTab] = useState("overview");

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        const handleLocationChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            setActiveTab(urlParams.get("tab") ?? "overview");
        };

        handleLocationChange();
        window.addEventListener("popstate", handleLocationChange);
        return () => window.removeEventListener("popstate", handleLocationChange);
    }, []);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-72 transition-transform duration-300 ease-out glass-panel border-r border-white/5 flex flex-col bg-noise ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="p-8 flex items-center justify-between">
                    <Link href="/home" className="group" onClick={onClose}>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center border-primary/30 text-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                                whileHover={{ scale: 1.08, rotate: -4 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                                <FaFutbol className="text-xl" aria-hidden="true" />
                            </motion.div>
                            <span className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                                Fut<span className="text-primary group-hover:text-blue-400 transition-colors">App</span>
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        aria-label="Fechar menu"
                        className="lg:hidden min-h-11 min-w-11 p-2 text-secondary hover:text-foreground rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <CgClose size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-8 py-4">
                    <div className="space-y-3">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/50">Menu Principal</p>
                        <Link
                            href="/home"
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 group ${
                                isActive("/home")
                                    ? "bg-primary text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
                                    : "text-secondary hover:text-foreground hover:bg-white/5"
                            }`}
                        >
                            <FaHouse className={`text-lg ${isActive("/home") ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                            Home
                        </Link>
                    </div>

                    {groupId && (
                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/50">Gestão do Grupo</p>
                            <div className="flex flex-col gap-2">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const selected = activeTab === tab.id;

                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => {
                                                onClose();
                                                setActiveTab(tab.id);
                                                const url = new URL(window.location.href);
                                                url.searchParams.set("tab", tab.id);
                                                window.history.pushState({}, "", url);
                                                window.dispatchEvent(new Event("popstate"));
                                            }}
                                            className={`flex min-h-11 items-center gap-4 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors duration-200 group w-full text-left ${
                                                selected
                                                    ? "bg-primary text-white shadow-[0_10px_20px_rgba(37,99,235,0.25)]"
                                                    : "text-secondary hover:text-foreground hover:bg-white/5"
                                            }`}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Icon className={`text-lg ${selected ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                                            {tab.label}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 mt-auto">
                    <button
                        onClick={logout}
                        className="flex min-h-11 items-center gap-4 w-full px-4 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                        <FaOutdent className="text-lg group-hover:-translate-x-1 transition-transform" />
                        Sair
                    </button>
                </div>

            </aside>
        </>
    );
}
