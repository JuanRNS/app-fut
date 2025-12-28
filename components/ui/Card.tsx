import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default Card;
