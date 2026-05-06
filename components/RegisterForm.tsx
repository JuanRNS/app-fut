'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DynamicForm from '@/components/ui/DynamicForm';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import LoadingSpinner from './ui/LoadingSpinner';

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch("/api/user-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error("Falha ao registrar usuário");
            }

            setSuccess(true);
            setName("");
            setEmail("");
            setPassword("");
            router.push("/login");
        } catch (err) {
            toast.error("Erro ao registrar usuário");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    return (
        <Card className="w-full p-6 max-w-md relative z-10 backdrop-blur-xl border-border">
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-hover transition-colors z-20"
                title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
                {theme === "dark" ? (
                    <FaSun />
                ) : (
                    <FaMoon />
                )}
            </button>
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <span className="text-3xl">📝</span>
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    Criar Conta
                </h1>
                <p className="text-gray-400 mt-2">Junte-se à nossa comunidade!</p>
            </div>

            {success && (
                <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded border border-green-500/50 text-center">
                    Usuário registrado com sucesso!
                </div>
            )}

            <DynamicForm className="flex flex-col gap-6" onSubmit={handleRegister}>
                <Input
                    label="Nome"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome completo"
                />
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                />
                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Sua senha segura"
                />

                <Button type="submit" disabled={loading} className="mt-4">
                    {loading ? "REGISTRANDO..." : "REGISTRAR"}
                </Button>

                <div className="text-center mt-4">
                    <Link href="/login" className="text-sm text-primary hover:text-secondary transition-colors">
                        Já tem uma conta? Faça login
                    </Link>
                </div>
            </DynamicForm>
        </Card>
    );
}
