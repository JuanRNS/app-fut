"use client";

import { useState } from "react";
import { IGroupCardProps } from "@/interface/group.interface";
import { FaBars, FaPen, FaTrash } from "react-icons/fa6";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GroupCard({ group }: IGroupCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/group/${group.id}`);
    };

    return (
        <div className="relative w-full max-w-md cursor-pointer group" onClick={handleClick}>
            <div className="relative rounded-xl bg-surface border border-border transition-all duration-200 hover:border-primary/50 hover:shadow-lg flex flex-col gap-4 h-full min-h-[180px] overflow-hidden">
                
                <div className="relative z-10 p-6 flex flex-col gap-3 h-full">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 break-words flex-1">
                            {group.name}
                        </h3>

                        <div className="relative">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                variant="ghost"
                                className="p-2 text-secondary hover:text-foreground transition-colors rounded-lg"
                            >
                                <FaBars className="w-5 h-5" />
                            </Button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMenuOpen(false);
                                        }}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                                        <button
                                            className="w-full px-4 py-3 text-left text-sm text-foreground/80 hover:bg-hover hover:text-foreground flex items-center gap-3 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info(`Editar grupo ${group.name}`);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <FaPen className="w-3 h-3" /> Editar
                                        </button>
                                        <button
                                            className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 flex items-center gap-3 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info(`Excluir grupo ${group.name}`);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <FaTrash className="w-3 h-3" /> Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-secondary text-sm line-clamp-2 leading-relaxed">
                        {group.description || "Sem descrição disponível."}
                    </p>
                </div>
                
                {/* Visual Accent */}
                <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </div>
    );
}
