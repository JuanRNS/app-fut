'use client';

import { DynamicFormProps } from '@/interface/ui.interface';
import { toast } from 'sonner';

export default function DynamicForm({ children, className = '', onSubmit }: DynamicFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        } else {
            toast.success('Formulário enviado com sucesso!');
        }
    };

    return (
        <form className={className} onSubmit={handleSubmit}>
            {children}
        </form>
    );
};


