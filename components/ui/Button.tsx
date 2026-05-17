import { ButtonProps } from '@/interface/ui.interface';

export default function Button({ children, variant = 'primary', className = '', isActive = false, ...props }: ButtonProps) {
    const baseStyles = "transition-all duration-200 transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "px-5 py-2.5 rounded-lg font-semibold bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md",
        outline: "px-5 py-2.5 rounded-lg font-semibold border border-primary text-primary hover:bg-primary/5",
        ghost: "bg-transparent rounded-lg hover:bg-hover",
        selected: "bg-primary text-white font-semibold shadow-md",
        secondary: isActive
            ? "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap bg-primary text-white font-semibold"
            : "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap bg-surface text-secondary hover:text-primary hover:bg-hover border border-border"
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
