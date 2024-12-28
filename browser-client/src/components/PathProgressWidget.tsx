import PathProgress from "./PathProgress";
import { Article, ClientGameInterface, GameStatusInterface } from "../utils/utils";

interface PathProgressWidget {
    widgetKey: string;
    isExpanded: boolean;
    onToggle: (widgetKey: string) => void;

    gameClientInformation: ClientGameInterface;
    pathCustomizations: { type: string; directed: boolean; }
    gameStatus: GameStatusInterface;
    path: Article[];
}

function PathProgressWidget({
    widgetKey,
    isExpanded,
    onToggle,
    gameClientInformation,
    pathCustomizations,
    gameStatus,
    path
}: PathProgressWidget) {
    return (
        <div>
            <div
                className={`flex items-center justify-between ${isExpanded
                        ? "bg-blue-500 border-green-400 border-2 border-solid text-white"
                        : "bg-slate-200"
                    } mb-1`}
            >
                <p className="text-base font-medium text-center flex-grow p-1">
                    PATH PROGRESS
                </p>
                <button
                    className="pb-1 h-5 relative right-2 flex items-center justify-center align-middle"
                    onClick={() => onToggle(widgetKey)}
                >
                    {isExpanded ? "▲" : "▼"}
                </button>
            </div>

            {isExpanded && (
                <PathProgress
                    gameClientInformation={gameClientInformation}
                    pathCustomizations={pathCustomizations}
                    gameStatus={gameStatus}
                    path={path}
                />
            )}
        </div>
    );
}

export default PathProgressWidget;