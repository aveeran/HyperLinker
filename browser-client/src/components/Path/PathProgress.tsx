import React, { useState, useMemo, useEffect, useCallback } from "react";

import { GraphSettingsContextType, GraphSettingsProvider } from "./PathContexts/GraphSettingsContext";
import { NodeInteractionContextType, NodeInteractionProvider } from "./PathContexts/NodeInteractionContext";
import { EdgeInteractionContextType, EdgeInteractionProvider } from "./PathContexts/EdgeInteractionContext";
import { Article, ClientGameInterface, defaultClientGame, GameStatusInterface, Mode } from "../../utils/utils";
import PathRow from "./PathRow";
import PathVerticalEdge from "./PathVerticalEdge";
import PathNodePanel from "./PathNodePanel";
import PathEdgePanel from "./PathEdgePanel";

interface PathProgressProps {
    gameClientInformation: ClientGameInterface;
    gameStatus: GameStatusInterface;
    pathCustomizations: { type: string; directed: boolean };
    path: Article[];
}

function PathProgress({
    gameClientInformation,
    gameStatus,
    pathCustomizations,
    path
}: PathProgressProps) {

    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [activeEdge, setActiveEdge] = useState<number | null>(null);
    const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);
    const [currentNode, setCurrentNode] = useState<number>(0);

    if (!gameClientInformation) {
        gameClientInformation = defaultClientGame;
    }

    const nodeHistory = gameClientInformation?.nodeHistory || [];

    let isPath: boolean = pathCustomizations.type === Mode.Path;
    let isDirected: boolean = pathCustomizations.directed;

    useEffect(() => {
        if (gameClientInformation?.currentNode != currentNode) {
            setCurrentNode(gameClientInformation?.currentNode);
        }
    }, [gameClientInformation?.currentNode, currentNode]);

    const handleMouseEnterNode = (index: number) => {
        setHoveredNode(index);
    };

    const handleMouseLeaveNode = () => {
        if (activeNode === null) {
            setHoveredNode(null);
        }
    };

    const handleMouseEnterEdge = (index: number) => {
        setHoveredEdge(index);
    };

    const handleMouseLeaveEdge = () => {
        if (activeEdge === null) {
            setHoveredEdge(null);
        }
    };

    const handleClickNode = (index: number) => {
        setActiveNode((prevActiveNode) =>
            prevActiveNode === index ? null : index
        );
        setActiveEdge(null);
    };

    const handleClickEdge = (index: number) => {
        setActiveEdge((prevActiveLink) =>
            prevActiveLink === index ? null : index
        );
        setActiveNode(null);
    };

    function renderProgress(renderPath: Article[]) {
        const rowLength = 3;
        const rows = renderPath.reduce<Array<Array<Article>>>((acc, step, index) => {
            const rowIndex = Math.floor(index / rowLength);
            if (!acc[rowIndex]) acc[rowIndex] = [];
            acc[rowIndex].push(step);
            return acc;
        }, []);

        // Reverse every other row
        rows.forEach((row, index) => {
            if (index % 2 === 1) row.reverse();
        });

        const graphSettingsValue: GraphSettingsContextType = {
            rowLength: 3,
            isDirected: pathCustomizations.directed,
            isPath: pathCustomizations.type === Mode.Path,
            path: path,
            freePath: gameClientInformation.freePath,
            handleMouseEnterNode: handleMouseEnterNode,
            handleMouseLeaveNode: handleMouseLeaveNode,
            handleClickNode: handleClickNode,
            handleMouseEnterEdge: handleMouseEnterEdge,
            handleMouseLeaveEdge: handleMouseLeaveEdge,
            handleClickEdge: handleClickEdge
        }

        const nodeInteractionValue: NodeInteractionContextType = {
            activeNode: activeNode,
            hoveredNode: hoveredNode,
            nodeHistory: nodeHistory,
            visitedPath: gameClientInformation.visitedPath,
            currentNode: currentNode,
            gameStatus: gameStatus
        }

        const edgeInteractionValue: EdgeInteractionContextType = {
            activeEdge: activeEdge,
            hoveredEdge: hoveredEdge,
            edgeHistory: gameClientInformation.edgeHistory,
            visitedPath: gameClientInformation.visitedPath
        }

        return (
            <div className="flex flex-col items-center">
                <GraphSettingsProvider value={graphSettingsValue}>
                    <NodeInteractionProvider value={nodeInteractionValue}>
                        <EdgeInteractionProvider value={edgeInteractionValue}>
                            {rows.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <PathRow row={row} rowIndex={rowIndex} />
                                    {rowIndex < rows.length - 1 && (
                                        <PathVerticalEdge rowIndex={rowIndex} />
                                    )}
                                </React.Fragment>
                            ))}

                            {
                                activeNode != null && (
                                    <PathNodePanel />
                                )
                            }

                            {
                                activeEdge != null && (
                                    <PathEdgePanel />
                                )
                            }
                        </EdgeInteractionProvider>
                    </NodeInteractionProvider>
                </GraphSettingsProvider>
            </div>
        );
    }

    return (
        isDirected ? renderProgress(path) : renderProgress(gameClientInformation.freePath)
    );
}

export default PathProgress;