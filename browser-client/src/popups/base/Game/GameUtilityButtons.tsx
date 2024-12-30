import React from "react";
import { useNavigate } from "react-router-dom";

interface UtilityButtonsProps {
    pausable: boolean;
    paused: boolean;
    onTogglePause: () => void;
    onQuit: () => void;
}

function GameUtilityButtons({
    pausable,
    paused,
    onTogglePause,
    onQuit
}: UtilityButtonsProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center">
            {pausable && (
                <button
                    className={`w-[25%] p-2 border-2 border-gray-200 rounded-md text-white font-custom ${paused ? "bg-green-500" : "bg-gray-500"
                        }`}
                    onClick={onTogglePause}
                >
                    {paused ? "Unpause" : "Pause"}
                </button>
            )}
            <button
                className="w-[25%] bg-red-800 p-2 border-2 border-gray-200 rounded-md text-white mr-2 font-custom"
                onClick={onQuit}
            >
                Quit
            </button>
            <button onClick={() => navigate("/")}>Return</button>
        </div>
    );
}

export default GameUtilityButtons;