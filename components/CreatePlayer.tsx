import { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "./ui/Button";
import Card from "./ui/Card";
import DynamicForm from "./ui/DynamicForm";
import Input from "./ui/Input";

export default function CreatePlayer(props: { id: string, onSuccess?: () => void, playerToEdit?: { id: string, name: string } }) {
    const { id, onSuccess, playerToEdit } = props;
    const [newPlayerName, setNewPlayerName] = useState(playerToEdit?.name || "");
    const [loadingPlayer, setLoadingPlayer] = useState(false);

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
    }
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h3 className="text-xl font-bold text-white mb-6">
                    {playerToEdit ? "Editar Jogador" : "Adicionar Jogador"}
                </h3>
                <DynamicForm
                    onSubmit={(e) => {
                        handleCreatePlayer(e);
                    }}
                    className="flex flex-col gap-4"
                >
                    <Input
                        name="name"
                        label="Nome do Jogador"
                        placeholder="Ex: João Silva"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary">
                        {loadingPlayer ? (playerToEdit ? "Salvando..." : "Criando...") : (playerToEdit ? "Salvar Alterações" : "Adicionar Jogador")}
                    </Button>
                </DynamicForm>
            </Card>
        </div>
    )
}