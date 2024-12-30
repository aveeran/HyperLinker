import React from "react";
import GameTracker from "./GameTracker";

import { ClientGameInterface, GameStatusInterface, Mode } from "../utils/utils";

interface TrackingWidgetProps {
    widgetKey: string;
    isExpanded: boolean;
    onToggle: (widgetKey: string) => void;

    gameClientInformation: ClientGameInterface;
    gameStatus: GameStatusInterface;
    tracking: string;
    countDown: number;
    mode: string
}

function TrackingWidgetProps({
    widgetKey,
    isExpanded,
    onToggle,
    gameClientInformation,
    gameStatus,
    tracking,
    countDown,
    mode
}: TrackingWidgetProps) {
    return (
        <div className="mb-1">
            <div
                className={`flex items-center justify-between ${isExpanded
                        ? "bg-blue-500 border-green-400 border-2 border-solid text-white"
                        : "bg-slate-200"
                    } mb-1`}
            >
                <p className="text-base font-medium text-center flex-grow p-1">
                    TRACKING INFORMATION
                </p>
                <button
                    className="pb-1 h-5 relative right-2 flex items-center justify-center"
                    onClick={() => onToggle(widgetKey)}
                >
                    {isExpanded ? "▲" : "▼"}
                </button>
            </div>

            {isExpanded && (
                <GameTracker
                    gameClientInformation={gameClientInformation}
                    gameStatus={gameStatus}
                    tracking={tracking}
                    countDown={countDown}
                    mode={mode}
                />
            )}
        </div>
    );
}

export default TrackingWidgetProps;