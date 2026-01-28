import React, { useState, useRef, useEffect } from 'react';
import { FaFutbol, FaHandsHelping, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { IDropdownStatisticsProps, IRequestMatchStatistics } from '@/interface/modal-statistics.interface'; // Typo in original filename preserved to avoid confusion

export default function DropdownStatistics({ onClose, playerId, matchId, groupId, team }: IDropdownStatisticsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleStat = async (type: 'GOAL' | 'ASSISTANCE') => {
        if (!matchId) {
            toast.error("Partida não identificada");
            return;
        }

        const body: IRequestMatchStatistics = {
            matchId,
            playerId,
            type,
            team
        };

        setIsLoading(true);
        try {
            const response = await fetch(`/api/group/${groupId}/statistics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error("Erro ao registrar estatística");
            }

            toast.success(type === 'GOAL' ? "Gol registrado!" : "Assistência registrada!");
            onClose(type, team);
        } catch (error) {
            toast.error("Erro ao registrar estatística");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute -top-6 -right-2 z-[50] bg-[#1a1b26] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[160px] animate-in slide-in-from-top-2 fade-in duration-200"
        >
            <div className="flex flex-col p-1">
                <button
                    onClick={() => handleStat('GOAL')}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left disabled:opacity-50"
                >
                    {isLoading ? <FaSpinner className="animate-spin text-primary" /> : <FaFutbol className="text-primary" />}
                    <span>Gol</span>
                </button>
                <div className="h-px bg-white/5 mx-2" />
                <button
                    onClick={() => handleStat('ASSISTANCE')}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left disabled:opacity-50"
                >
                    {isLoading ? <FaSpinner className="animate-spin text-blue-400" /> : <FaHandsHelping className="text-blue-400" />}
                    <span>Assistência</span>
                </button>
            </div>
        </div>
    );
}
