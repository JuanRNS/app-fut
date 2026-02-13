import { InputProps } from '@/interface/ui.interface';

export default function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-foreground ml-1">{label}</label>}
            <input
                className={`bg-surface border border-gray-700 text-foreground rounded-lg px-4 py-3 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_10px_var(--color-primary)] placeholder-gray-500 ${className}`}
                {...props}
            />
        </div>
    );
};


