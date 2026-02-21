import { CardProps } from '@/interface/ui.interface';

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ${className}`}>
            {children}
        </div>
    );
};


