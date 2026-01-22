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
        <div className="relative w-full max-w-md cursor-pointer" onClick={handleClick}> {/* Increased max-w-sm to max-w-md */}
            <div className="relative rounded-2xl bg-surface/50 border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col gap-4 h-full min-h-[200px]">

                {/* Background Elements Container - Handles Overflow for decorations */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-[50px]" />
                </div>

                <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 break-words flex-1">
                            {group.name}
                        </h3>

                        <div className="relative">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                variant="ghost"
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
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
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-[#1a1b26] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                        <Button
                                            variant="ghost"
                                            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors rounded-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info(`Editar grupo ${group.name}`);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <FaPen className="w-3 h-3" /> Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors rounded-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info(`Excluir grupo ${group.name}`);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <FaTrash className="w-3 h-3" /> Excluir
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-3">
                        {group.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
