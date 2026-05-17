import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header(props: { isOpen: boolean; onOpen: () => void }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background border-b border-white/5 transition-all duration-300">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => props.onOpen()}
                    className="lg:hidden p-2 text-secondary hover:text-foreground rounded-xl hover:bg-white/5 transition-all active:scale-90"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <div className="flex items-center gap-2">
                    <span className="hidden sm:block text-xs font-black uppercase tracking-[0.4em] text-secondary/50">Dashboard</span>
                    <div className="w-1 h-1 rounded-full bg-primary hidden sm:block" />
                    <span className="text-sm font-black uppercase tracking-widest text-foreground">Elite Control</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-3 text-secondary hover:text-primary rounded-2xl glass-panel border-white/5 hover:bg-white/5 transition-all active:scale-95 shadow-lg"
                    title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                >
                    {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>
                
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
                    U
                </div>
            </div>
        </header>
    )
}
