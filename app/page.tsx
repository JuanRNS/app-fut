import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0B1121]">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center max-w-3xl space-y-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] mb-4">
          <span className="text-4xl">⚽</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
          App <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">FUT</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
          O sistema definitivo para gerenciar seus jogos, organizar times e equilibrar as partidas com tecnologia de ponta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/login">
            <Button className="px-10 py-4 text-lg">
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-gray-500 text-sm">
        © 2026 App Fut. Todos os direitos reservados.
      </footer>
    </div>
  );
}
