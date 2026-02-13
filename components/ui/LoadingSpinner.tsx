import { FaSpinner } from "react-icons/fa";

interface LoadingSpinnerProps {
    className?: string;
    size?: number;
}

export default function LoadingSpinner({ className = "", size = 24 }: LoadingSpinnerProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <FaSpinner
                className="animate-spin text-primary"
                size={size}
            />
        </div>
    );
}
