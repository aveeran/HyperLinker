import React, { useContext } from "react";
import { Article } from "../../utils/utils";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";
import { EdgeInteractionContext } from "./PathContexts/EdgeInteractionContext";

interface PathEdgeProps {
    rowIndex: number;
    index: number;
    rowLength: number;
}

function PathEdge({ rowIndex, index }: PathEdgeProps) {
    const graphSettings = useContext(GraphSettingsContext);
    const edgeInteraction = useContext(EdgeInteractionContext);

    if (!graphSettings || !edgeInteraction) {
        throw new Error(
            "PathEdge must be used within GraphSettingsContext and EdgeInteractionContext providers"
        );
    }

    const {
        handleMouseEnterEdge,
        handleMouseLeaveEdge,
        handleClickEdge,
        path,
        rowLength,
    } = graphSettings;

    const { activeEdge, hoveredEdge, visitedPath } = edgeInteraction;

    const linkIndex =
        rowIndex % 2 === 0
            ? index + rowIndex * rowLength
            : rowIndex * rowLength + (rowLength - index - 1) - 1;

    let isVisited = false;

    if (visitedPath != null && path != null) {
        isVisited =
            visitedPath.some(
                (visitedArticle) =>
                    visitedArticle.title === path[linkIndex]?.title &&
                    visitedArticle.link === path[linkIndex]?.link
            ) &&
            visitedPath.some(
                (visitedArticle) =>
                    visitedArticle.title === path[linkIndex + 1]?.title &&
                    visitedArticle.link === path[linkIndex + 1]?.link
            );
    }

    const isActive = activeEdge === linkIndex;
    const isHovered = hoveredEdge === linkIndex;

    return (
        <div
            key={`link-${linkIndex}`}
            className={`h-2 w-8 ${isVisited ? "bg-green-500" : "bg-gray-300"}
            ${isActive && "border-2 border-green-400 shadow-gray-600 drop-shadow-xl"}
            ${isHovered && "shadow-gray-600 drop-shadow-xl"}`}
            onMouseEnter={() => handleMouseEnterEdge?.(linkIndex)}
            onMouseLeave={handleMouseLeaveEdge ?? (() => {})}
            onClick={() => handleClickEdge(linkIndex)}
        ></div>
    );
}

export default PathEdge;
