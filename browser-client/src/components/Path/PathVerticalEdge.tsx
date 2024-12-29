import { useContext } from "react";
import { EdgeInteractionContext } from "./PathContexts/EdgeInteractionContext";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";

interface PathVerticalEdgeProps {
    rowIndex: number;
}

function PathVerticalEdge( {rowIndex} : PathVerticalEdgeProps) {
    const edgeInteraction = useContext(EdgeInteractionContext);
    const graphSettings = useContext(GraphSettingsContext);

    if (!edgeInteraction) {
        throw new Error("PathRow must be used within a EdgeInteractionContext provider");
    }

    const { activeEdge, hoveredEdge, visitedPath } = edgeInteraction;

    if(!graphSettings) {
        throw new Error("PathRow must be used within a GraphSettingsContext provider");
    }

    const { 
        path,
        handleMouseEnterEdge,
        handleMouseLeaveEdge,
        handleClickEdge,
     } = graphSettings;


    const connectorIndex = rowIndex % 2 === 0 ? 2 : 5;
    const isActive = activeEdge === connectorIndex;
    const isHovered = hoveredEdge === connectorIndex;
    const isVisited = rowIndex % 2 === 0
        ? visitedPath.some((visitedArticle) =>
            visitedArticle.title === path[2].title && 
            visitedArticle.link === path[2].link) 
        && visitedPath.some((visitedArticle) =>
            visitedArticle.title === path[3].title && 
            visitedArticle.link === path[3].link) :
        visitedPath.some((visitedArticle) =>
            visitedArticle.title === path[5].title && 
            visitedArticle.link === path[5].link) && 
        visitedPath.some((visitedArticle) =>
            visitedArticle.title === path[6].title && 
            visitedArticle.link === path[6].link);

    return (
        <div 
        key={`connector-${rowIndex}`}
        className={`flex ${rowIndex % 2 === 0 ? "justify-end" : "justify-start"}`}
        style={{width: "100%"}}
        onMouseEnter={() => handleMouseEnterEdge?.(connectorIndex)}
        onMouseLeave={handleMouseLeaveEdge ?? (() => {})}
        onClick={() => handleClickEdge(connectorIndex)}
        >
            <div className={`w-2 h-8 mt-3 mb-3 ${isVisited ? "bg-green-500" : "bg-gray-300"}
            ${rowIndex % 2 == 0 ? "mr-5": "ml-5"}
            ${isActive && "border-2 border-green-400 shadow-gray-400 drop-shadow-xl"}
            ${isHovered && "shadow-gray-400 drop-shadow-xl"}
            `}></div>
        </div>
    );
}

export default PathVerticalEdge;