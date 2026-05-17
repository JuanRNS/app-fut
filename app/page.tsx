import Link from 'next/link';
import Button from '@/components/ui/Button';
export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background bg-noise">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-live" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none animate-pulse-live" style={{ animationDelay: '1s' }} />

      <main className="z-10 flex flex-col items-center text-center max-w-3xl space-y-12 animate-slide-up-fade">
        <div className="relative group">
          <div className="w-32 h-32 glass-panel rounded-3xl flex items-center justify-center shadow-2xl border-white/10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <span className="text-6xl drop-shadow-2xl">⚽</span>
          </div>
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
            App <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-400 to-primary animate-shimmer">FUT</span>
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
        </div>

        <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed font-medium">
          O sistema definitivo para gerenciar seus jogos, organizar times e equilibrar as partidas com <span className="text-foreground font-bold">tecnologia de elite</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <Link href="/login">
            <Button className="px-12 py-5 text-xl font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1 bg-gradient-to-br from-primary to-blue-600 animate-shimmer">
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-foreground/30 text-xs font-black uppercase tracking-[0.3em]">
        © 2026 App Fut • Elite Match Management
      </footer>
    </div>
  );
}
