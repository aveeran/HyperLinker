import React from "react";
import PlayerSelector from "./PlayerSelector";

interface PlayerSelectorWidgetProps {
    widgetKey: string;
    isExpanded: boolean;
    onToggle: (widgetKey: string) => void;

    currentPlayer: string;
    playerIDs: string[];
    onDataChange: (playerID: string) => void;
}

function PlayerSelectorWidget({
    widgetKey,
    isExpanded,
    onToggle,
    currentPlayer,
    playerIDs,
    onDataChange
}: PlayerSelectorWidgetProps) {
    return (
        <div className="mb-1">
            <div
                className={`flex items-center justify-between ${isExpanded
                        ? "bg-blue-500 border-green-400 border-2 border-solid text-white"
                        : "bg-slate-200"
                    }`}
            >
                <p className="text-base font-medium text-center flex-grow p-1 mb-1">
                    PLAYER SELECTOR
                </p>

                <button
                    className="pb-1 h-5 relative right-2 flex items-center justify-center"
                    onClick={() => onToggle(widgetKey)}
                >
                    {isExpanded ? "▲" : "▼"}
                </button>
            </div>

            {isExpanded ? (
                <PlayerSelector
                    onDataChange={onDataChange}
                    playerIDs={playerIDs}
                    currentPlayer={currentPlayer}
                />
            ) : null}
        </div>
    );
}


export default PlayerSelectorWidget;