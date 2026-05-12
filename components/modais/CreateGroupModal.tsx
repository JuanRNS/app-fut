"use client";

import React, { useEffect, useState } from "react";
import { FaClipboardList, FaFutbol, FaTimes, FaUsers } from "react-icons/fa";
import { toast } from "sonner";
import { CreateGroupModalProps } from "@/interface/modal-create-group.interface";

export default function CreateGroupModal({ isOpen, onClose, fetchGroups, groupToEdit }: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const isEditing = Boolean(groupToEdit);

    useEffect(() => {
        if (!isOpen) return;

        setName(groupToEdit?.name || "");
        setDescription(groupToEdit?.description || "");
    }, [groupToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const group = await fetch(groupToEdit ? `/api/group/${groupToEdit.id}` : "/api/group", {
                method: groupToEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            if (!group.ok) {
                throw new Error(isEditing ? "Erro ao editar grupo" : "Erro ao criar grupo");
            }

            toast.success(isEditing ? "Grupo editado com sucesso" : "Grupo criado com sucesso");
            onClose();
            fetchGroups();
            setName("");
            setDescription("");
        } catch {
            toast.error(isEditing ? "Erro ao editar grupo" : "Erro ao criar grupo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-surface/90 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_28%)]" />
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-accent" />

                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary transition-all hover:scale-105 hover:bg-white/10 hover:text-white active:scale-95"
                    aria-label="Fechar modal"
                >
                    <FaTimes className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-6 sm:p-8">
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_35px_rgba(37,99,235,0.25)]">
                            <FaFutbol className="h-7 w-7" />
                        </div>
                        <div className="pr-12">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-primary">{isEditing ? "Ajustar arena" : "Nova arena"}</p>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{isEditing ? "Editar Pelada" : "Criar Nova Pelada"}</h2>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-secondary">
                                {isEditing ? "Atualize nome e descricao do grupo sem mexer no elenco." : "Monte o grupo, chame a galera e deixe o campeonato pronto para rolar."}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-foreground">
                                <FaUsers className="text-primary" />
                                Nome do Grupo
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Ex: Futebol de Quarta"
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-base font-bold text-foreground outline-none transition-all placeholder:text-secondary/45 focus:border-primary/70 focus:bg-primary/5 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-foreground">
                                <FaClipboardList className="text-accent" />
                                Descricao opcional
                            </span>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Racha dos amigos"
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-base font-bold text-foreground outline-none transition-all placeholder:text-secondary/45 focus:border-accent/70 focus:bg-accent/5 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.12)]"
                            />
                        </label>

                        <div className="grid gap-3 pt-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-white/10 active:scale-[0.98]"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-2xl bg-primary px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_24px_55px_rgba(37,99,235,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (isEditing ? "Salvando..." : "Criando...") : (isEditing ? "Salvar Grupo" : "Criar Grupo")}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
