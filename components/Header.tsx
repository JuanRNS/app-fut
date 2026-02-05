import { useTheme } from "./ThemeProvider";

export default function Header(props: { isOpen: boolean; onOpen: () => void }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[var(--header-background)] backdrop-blur-md border-b border-white/5 transition-colors duration-300 text-[var(--header-foreground)]">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => props.onOpen()}
                    className="p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-lg font-bold text-white tracking-tighter">FUT APP</span>
            </div>

            <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-foreground rounded-lg hover:bg-hover transition-colors"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {theme === "dark" ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>
        </header>
    )
}