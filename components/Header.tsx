export default function Header(props: { isOpen: boolean; onOpen: () => void }) {

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md border-b border-white/5">
            <button
                onClick={() => props.onOpen()}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <span className="text-lg font-bold text-primary tracking-tighter">FUT APP</span>
        </header>
    )
}