import { useEffect, useState } from "react";
import { FaArrowRight, FaIdBadge, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { toast } from "sonner";
import Button from "./ui/Button";
import DynamicForm from "./ui/DynamicForm";
import Input from "./ui/Input";

export default function CreatePlayer(props: { id: string, onSuccess?: () => void, playerToEdit?: { id: string, name: string } }) {
    const { id, onSuccess, playerToEdit } = props;
    const [newPlayerName, setNewPlayerName] = useState(playerToEdit?.name || "");
    const [loadingPlayer, setLoadingPlayer] = useState(false);
    const isEditing = Boolean(playerToEdit);

    useEffect(() => {
        if (playerToEdit) {
            setNewPlayerName(playerToEdit.name);
        } else {
            setNewPlayerName("");
        }
    }, [playerToEdit]);

    const handleCreatePlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPlayer(true);
        try {
            const url = playerToEdit
                ? `/api/group/${id}/player/${playerToEdit.id}`
                : `/api/group/${id}/player`;

            const method = playerToEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newPlayerName }),
            });

            if (!response.ok) {
                throw new Error(playerToEdit ? "Erro ao editar jogador" : "Erro ao criar jogador");
            }

            setNewPlayerName("");
            if (onSuccess) onSuccess();
            toast.success(playerToEdit ? "Jogador editado com sucesso!" : "Jogador criado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error(playerToEdit ? "Erro ao editar jogador" : "Erro ao criar jogador");
        } finally {
            setLoadingPlayer(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/15 p-5 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_34%)]" />

            <div className="relative z-10 mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_28px_rgba(37,99,235,0.18)]">
                    {isEditing ? <FaUserEdit className="h-6 w-6" /> : <FaUserPlus className="h-6 w-6" />}
                </div>
                <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        {isEditing ? "Atualizar ficha" : "Novo reforco"}
                    </p>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                        {isEditing ? "Editar Jogador" : "Adicionar Jogador"}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-secondary">
                        {isEditing ? "Ajuste o nome do atleta sem mexer no historico dele." : "Cadastre um atleta para deixar o elenco pronto para a proxima partida."}
                    </p>
                </div>
            </div>

            <DynamicForm
                onSubmit={(e) => {
                    handleCreatePlayer(e);
                }}
                className="relative z-10 flex flex-col gap-5"
            >
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-secondary">
                        <FaIdBadge className="text-primary" />
                        Identificacao
                    </div>
                    <Input
                        name="name"
                        label="Nome do Jogador"
                        placeholder="Ex: Joao Silva"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        required
                        className="rounded-2xl border-white/10 bg-black/25 px-5 py-4 text-base font-bold focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingPlayer}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-[0.22em] shadow-[0_18px_45px_rgba(37,99,235,0.32)]"
                >
                    {loadingPlayer ? (isEditing ? "Salvando..." : "Criando...") : (isEditing ? "Salvar Alteracoes" : "Adicionar Jogador")}
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
            </DynamicForm>
        </div>
    );
}
