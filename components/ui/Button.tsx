import { ButtonProps } from '@/interface/ui.interface';

export default function Button({ children, variant = 'primary', className = '', isActive = false, ...props }: ButtonProps) {
    const baseStyles = "transition-all duration-300 transform active:scale-95 cursor-pointer";

    const variants = {
        primary: "px-4 py-2 rounded-full font-bold bg-gradient-to-r from-primary to-secondary text-black shadow-[0_0_15px_rgba(0,255,157,0.5)] hover:shadow-[0_0_25px_rgba(0,255,157,0.7)]",
        outline: "px-6 py-3 rounded-full font-bold border-2 border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]",
        ghost: "bg-transparent rounded-full",
        selected: "bg-primary text-black font-bold shadow-[0_0_15px_rgba(0,255,157,0.5)] hover:shadow-[0_0_25px_rgba(0,255,157,0.7)]",
        secondary: isActive
            ? "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-primary text-black font-bold"
            : "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-surface/50 text-gray-400 hover:text-primary hover:bg-white/10"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};


