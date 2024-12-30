import React, { useContext } from "react";


import { Article } from "../../utils/utils";
import { NodeInteractionContext } from "./PathContexts/NodeInteractionContext";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";

interface PathNodeProps {
    rowIndex: number;
    step: Article;
    index: number;
    rowLength: number;
}

function PathNode({ rowIndex, step, index }: PathNodeProps) {
    const nodeInteraction = useContext(NodeInteractionContext);
    const graphSettings = useContext(GraphSettingsContext);

    if (!nodeInteraction || !graphSettings) {
        throw new Error(
            "PathNode must be used within NodeInteractionContext and GraphSettingsContext providers"
        );
    }

    const {
        activeNode,
        hoveredNode,
        visitedPath,
    } = nodeInteraction;

    // TODO: add error checking for nodeInteraction consumption

    const { handleMouseEnterNode, handleMouseLeaveNode, handleClickNode, rowLength } = graphSettings;

    const nodeIndex: number =
        rowIndex % 2 === 0
            ? index + rowIndex * rowLength
            : rowIndex * rowLength + (rowLength - index - 1);

    const isVisited =
        visitedPath != null &&
        visitedPath.some(
            (visitedArticle: Article) =>
                visitedArticle.title === step.title && visitedArticle.link === step.link
        );

    const isActive = activeNode === nodeIndex;
    const isHovered = hoveredNode === nodeIndex;

    return (
        <div
            key={nodeIndex}
            className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer
            ${isVisited ? "bg-blue-500 text-white border-green-400" : "bg-white border-gray-300"}
            ${isActive && "border-yellow-400 shadow-gray-400 drop-shadow-2xl"}
            ${isHovered && "shadow-gray-400 drop-shadow-2xl"}`}
            onMouseEnter={() => handleMouseEnterNode?.(nodeIndex)}
            onMouseLeave={handleMouseLeaveNode ?? (() => {})}
            onClick={() => handleClickNode?.(nodeIndex)}
            title={step.title}
        >
            <p className="truncate text-xs" aria-label={step.title}>
                {step.title}
            </p>
        </div>
    );
}

export default PathNode;
