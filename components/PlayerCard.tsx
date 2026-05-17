"use client";

import { useEffect, useState } from 'react';
import { FaBars, FaPen, FaTrash } from 'react-icons/fa6';
import Button from './ui/Button';
import { PlayerCardProps } from '@/interface/player.interface';
import { FaUser } from 'react-icons/fa6';

export default function PlayerCard({ name, id, onClick, onDelete, onEdit, isMatch, isSelected }: PlayerCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(isSelected);

    useEffect(() => {
        setSelectedPlayer(isSelected);
    }, [isSelected]);

    return (
        <div
            onClick={onClick}
            className={`
                relative rounded-2xl glass-panel border border-white/5 p-4 flex items-center justify-between gap-4 transition-all duration-500 bg-noise overflow-hidden group
                ${onClick ? 'cursor-pointer hover:bg-white/5 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1' : ''}
                ${selectedPlayer ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : ''}
                ${isMatch ? 'h-[80px]' : ''}
            `}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                    <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/10
                        ${isMatch 
                            ? 'bg-foreground text-surface' 
                            : 'bg-gradient-to-br from-primary via-blue-500 to-blue-700 text-white shadow-primary/30'}
                    `}>
                        <FaUser className="w-6 h-6 opacity-80" />
                    </div>
                    {selectedPlayer && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-surface animate-pulse-live" />}
                </div>

                <div className="flex flex-col">
                    <span className={`text-foreground font-black uppercase tracking-tighter leading-none transition-colors group-hover:text-primary ${isMatch ? 'text-xl' : 'text-base'}`}>
                        {name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/30" />
                        <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] opacity-50">
                            {isMatch ? "Em Campo" : "Atleta de Elite"}
                        </span>
                    </div>
                </div>
            </div>

            {!isMatch && (
                <div className="relative">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        variant="ghost"
                        className="p-2 text-foreground/60 hover:text-foreground transition-colors rounded-full hover:bg-hover"
                    >
                        <FaBars className="w-4 h-4" />
                    </Button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                }}
                            />
                            <div className="absolute right-0 top-full mt-2 w-36 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                                <Button
                                    variant="ghost"
                                    className="w-full px-4 py-3 text-left text-sm text-foreground/80 hover:bg-hover hover:text-foreground flex items-center gap-3 transition-colors rounded-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                        if (onEdit) onEdit();
                                    }}
                                >
                                    <FaPen className="w-3 h-3" /> Editar
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors rounded-none"
                                    onClick={(e) => {
                                        setIsMenuOpen(false);
                                        if (onDelete) onDelete();
                                    }}
                                >
                                    <FaTrash className="w-3 h-3" /> Excluir
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};


