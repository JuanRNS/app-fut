import React, { Dispatch, SetStateAction } from 'react';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import Button from './ui/Button';

interface IMatchControlsProps {
    isRunning: boolean;
    setIsRunning: Dispatch<SetStateAction<boolean>>;
    onFinish: () => void;
    onReset: () => void;
}

export default function MatchControls({
    isRunning,
    setIsRunning,
    onFinish,
    onReset
}: IMatchControlsProps) {
    return (
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-4 px-4">
            <Button
                variant={isRunning ? "secondary" : "primary"}
                onClick={() => setIsRunning(!isRunning)}
                className="w-full md:w-40 flex items-center justify-center gap-2"
            >
                {isRunning ? <><FaPause /> Pausar</> : <><FaPlay /> Continuar</>}
            </Button>
            <Button
                variant="ghost"
                onClick={onFinish}
                className="w-full md:w-40 flex items-center gap-2 justify-center text-red-500 hover:bg-red-500/10 hover:text-red-400 border border-red-500/20"
            >
                <FaStop /> Finalizar
            </Button>
            <Button
                variant="secondary"
                onClick={onReset}
                className="w-full md:w-40 flex items-center gap-2 justify-center text-foreground hover:bg-hover hover:text-foreground"
            >
                <FaStop /> Zerar
            </Button>
        </div>
    );
}
