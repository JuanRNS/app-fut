import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-black shadow-[0_0_15px_rgba(0,255,157,0.5)] hover:shadow-[0_0_25px_rgba(0,255,157,0.7)]",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]"
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

export default Button;
