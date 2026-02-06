export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'selected';
    isActive?: boolean;
}


export interface CardProps {
    children: React.ReactNode;
    className?: string;
}


export interface DynamicFormProps {
    children: React.ReactNode;
    className?: string;
    onSubmit?: (e: React.FormEvent) => void;
}


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

