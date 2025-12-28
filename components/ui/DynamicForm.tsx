'use client';

import React from 'react';

interface DynamicFormProps {
    children: React.ReactNode;
    className?: string;
    onSubmit?: (e: React.FormEvent) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ children, className = '', onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        } else {
            console.log('Form submitted');
        }
    };

    return (
        <form className={className} onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default DynamicForm;
