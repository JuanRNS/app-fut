"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { CreateGroupModalProps } from "@/interface/modal-create-group.interface";

export default function CreateGroupModal({ isOpen, onClose, fetchGroups }: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const group = await fetch("/api/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            if (!group.ok) {
                throw new Error("Erro ao criar grupo");
            }

            toast.success("Grupo criado com sucesso");
            onClose();
            fetchGroups();
            setName("");
            setDescription("");
        } catch (error) {
            toast.error("Erro ao criar grupo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            <Card className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Criar Nova Pelada</h2>
                    <p className="text-gray-400 text-sm mt-1">Organize seus jogos com a galera</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Nome do Grupo"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Ex: Futebol de Quarta"
                    />

                    <Input
                        label="Descrição (Opcional)"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Racha dos amigos"
                    />

                    <div className="flex gap-3 mt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-surface border-white/10 hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Criando..." : "Criar Grupo"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
