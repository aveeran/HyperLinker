import { useState, useEffect, useCallback, useContext } from "react";
import { Article, UPDATE_PAUSE } from "../../utils/utils";
import { NodeInteractionContext } from "./PathContexts/NodeInteractionContext";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";

function PathNodePanel() {
    const nodeInteraction = useContext(NodeInteractionContext);
    const graphSettings = useContext(GraphSettingsContext);

    if (!nodeInteraction || !graphSettings) {
        throw new Error(
            "PathNodePanel must be used within NodeInteractionContext and GraphSettingsContext providers"
        );
    }

    const {
        activeNode,
        nodeHistory,
        currentNode,
        gameStatus
    } = nodeInteraction;

    const {
        freePath,
        path,
        isDirected,
        isPath
    } = graphSettings;


    if (activeNode === null) return null;
    const [time, setTime] = useState<number>(0); // dummy-variable to force re-render
    let interval: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (gameStatus?.playing) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);

            return () => {
                if (interval) {
                    clearInterval(interval);
                }
            };
        }
    }, [gameStatus?.playing]);
    useEffect(() => {
        if (gameStatus?.playing) {
            chrome.runtime.onMessage.addListener((message, sender, response) => {
                if (message.type === UPDATE_PAUSE) {
                    if (message.pause && interval) {
                        clearInterval(interval);
                    } else if (!message.pause) {
                        interval = setInterval(() => {
                            setTime((prevTime) => prevTime + 1);
                        }, 1000);
                    }
                }
            });
        }
    }, [gameStatus?.playing]);


    const nodeTitle =
        !isDirected && isPath ? freePath[activeNode].title
            : path[activeNode].title;

    const innerNodeHistory = (nodeHistory ?? [])[activeNode] || { clicks: 0 };

    const parseTime = useCallback((seconds: number) => {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours =
            hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
        const formattedMinutes = `${String(minutes).padStart(2, "0")}:`;
        const formattedSeconds = String(remainingSeconds).padStart(2, "0");

        return `${formattedHours}${formattedMinutes}${formattedSeconds}`
    }, []);


    const renderElapsedTime = () => {
        const prevLeave = (nodeHistory ?? [])[(activeNode ?? 1) - 1]?.leaveTime;
        const delay = (nodeHistory ?? [])[activeNode ?? 0]?.delayTime * 1000;

        if ((nodeHistory ?? [])[activeNode ?? 0].leaveTime != null) {
            const leaveTime = (nodeHistory ?? [])[activeNode ?? 0].leaveTime ?? 0;

            if (prevLeave != null) {
                return (
                    <div>
                        {
                            parseTime((leaveTime - prevLeave - delay) / 1000)
                        }
                    </div>
                );
            } else {
                return (
                    <div>
                        {
                            parseTime((leaveTime - (gameStatus?.startTime ?? 0) - delay) / 1000)
                        }
                    </div>
                );
            }
        } else {
            const reference: number = gameStatus?.paused ? gameStatus.pauseStart ?? Date.now() : Date.now();

            if (prevLeave != null) {
                return (
                    <div>
                        {
                            parseTime((reference - prevLeave - delay) / 1000)
                        }
                    </div>
                );
            } else {
                return (
                    <div>
                        {
                            parseTime((reference - (gameStatus?.startTime ?? 0) - delay) / 1000)
                        }
                    </div>
                );
            }
        }
    }

    return (
        <div
            className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 border-yellow-400`}
        >
            <h3 className="font-bold truncate">Node History for {nodeTitle}</h3>
            <ul>
                {(currentNode ?? 0) >= activeNode ? (
                    <div>
                        <li>clicks: {innerNodeHistory.clicks}</li>
                        <li className="flex">
                            <p className="mr-1">elapsed time: </p> {renderElapsedTime()}</li>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700">
                        No history to show
                    </p>
                )}
            </ul>
        </div>
    );
}

export default PathNodePanel;