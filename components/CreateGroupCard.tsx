"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CreateGroupModal from "./modais/CreateGroupModal";

export default function CreateGroupCard(props: { fetchGroups: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="block group cursor-pointer h-full"
            >
                <div className="relative overflow-hidden rounded-2xl bg-surface/50 p-8 border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] h-full min-w-[20vw] flex flex-col items-center justify-center text-center gap-4">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-white/10 shadow-lg group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
                        <FaPlus className="text-primary w-6 h-6" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                            Criar Nova Pelada
                        </h3>
                        <p className="text-sm text-gray-400 max-w-[200px] mx-auto">
                            Crie um grupo, convide amigos e organize seus jogos.
                        </p>
                    </div>
                </div>
            </div>

            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchGroups={props.fetchGroups}
            />
        </>
    );
}
