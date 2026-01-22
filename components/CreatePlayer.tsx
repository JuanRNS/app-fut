import { useState } from "react";
import { toast } from "sonner";
import Button from "./ui/Button";
import Card from "./ui/Card";
import DynamicForm from "./ui/DynamicForm";
import Input from "./ui/Input";

export default function CreatePlayer(props: { id: string, onSuccess?: () => void }) {
    const { id, onSuccess } = props;
    const [newPlayerName, setNewPlayerName] = useState("");
    const [loadingPlayer, setLoadingPlayer] = useState(false);

    const handleCreatePlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPlayer(true);
        try {
            const response = await fetch(`/api/group/${id}/player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newPlayerName }),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar jogador");
            }

            setNewPlayerName("");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            // Optionally handle error toast here if not handled globally or by parent.
            // But checking previous context, error handling might be good here.
            throw error; // Let it propagate or handle. The previous code threw error. 
        } finally {
            setLoadingPlayer(false);
        }
    }
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h3 className="text-xl font-bold text-white mb-6">Adicionar Jogador</h3>
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
                        {loadingPlayer ? "Criando..." : "Adicionar Jogador"}
                    </Button>
                </DynamicForm>
            </Card>
        </div>
    )
}