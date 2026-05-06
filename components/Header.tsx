import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function Header(props: { isOpen: boolean; onOpen: () => void }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[var(--header-background)] backdrop-blur-md border-b border-border transition-colors duration-300 text-[var(--header-foreground)]">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => props.onOpen()}
                    className="p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-lg font-bold text-foreground tracking-tighter">FUT APP</span>
            </div>

            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-hover transition-colors"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {theme === "dark" ? (
                    <FaSun />
                ) : (
                    <FaMoon />
                )}
            </button>
        </header>
    )
}