"use client";

import { useEffect, useState } from 'react';
import { FaBars, FaPen, FaTrash } from 'react-icons/fa6';
import Button from './ui/Button';
import { PlayerCardProps } from '@/interface/player.interface';
import { toast } from 'sonner';

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
                relative rounded-xl bg-surface/30 border border-border p-4 flex items-center justify-between gap-3 transition-colors 
                ${onClick ? 'cursor-pointer hover:bg-hover/30' : ''}
                ${selectedPlayer ? 'border-primary' : ''}
            `}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-primary/20">
                    {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground font-medium">{name}</span>
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
                            <div className="absolute right-0 top-full mt-2 w-36 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                                <Button
                                    variant="ghost"
                                    className="w-full px-4 py-3 text-left text-sm text-foreground/80 hover:bg-hover hover:text-foreground flex items-center gap-3 transition-colors rounded-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toast.info(`Editar jogador ${name}`);
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


