'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DynamicForm from '@/components/ui/DynamicForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import LoadingSpinner from './ui/LoadingSpinner';

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await fetch("/api/user-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Falha ao fazer login");
            }

            setSuccess(true);
            setEmail("");
            setPassword("");
            router.push("/home");
        } catch (err) {
            setError("Ocorreu um erro ao tentar fazer login.");
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
        <Card className="w-full p-6 max-w-md relative z-10 backdrop-blur-xl border-border bg-surface/50">
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
                    <span className="text-3xl">⚽</span>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text bg-gradient-to-r text-foreground">
                    Bem-vindo!
                </h1>
                <p className="text-foreground/60 mt-2">Pronto para o jogo?</p>
            </div>

            {success && (
                <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded border border-green-500/50 text-center">
                    Login realizado com sucesso!
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded border border-red-500/50 text-center">
                    {error}
                </div>
            )}

            <DynamicForm className="flex flex-col gap-6" onSubmit={handleLogin}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="mt-4">
                    {loading ? "FAZENDO LOGIN..." : "FAZER LOGIN"}
                </Button>

                <div className="text-center mt-4 flex flex-col gap-2">
                    <a href="#" className="text-sm text-primary hover:text-secondary transition-colors">
                        Esqueceu a senha?
                    </a>
                    <Link href="/register" className="text-sm text-primary hover:text-secondary transition-colors">
                        Não tem uma conta? Cadastre-se
                    </Link>
                </div>
            </DynamicForm>
        </Card>
    );
}
