import { Article } from "../../utils/utils";

interface PathNodeProps {
    rowIndex: number,
    step: Article,
    index: number,
    rowLength: number,
    handleMouseEnterNode?: ((nodeIndex: number) => void),
    handleMouseLeaveNode?: (() => void),
    handleClickNode: (nodeIndex: number) => void,
    activeNode: number,
    hoveredNode: number,
    visitedPath: Article[] | null
}

function PathNode({
    rowIndex,
    step, 
    index, 
    rowLength, 
    handleMouseEnterNode = () => {}, 
    handleMouseLeaveNode = () => {}, 
    handleClickNode,
    activeNode, hoveredNode, visitedPath
} : PathNodeProps) {
    // Calculate nodeIndex while accounting for row pattern
    const nodeIndex: number = rowIndex % 2 === 0 ? 
    index + rowIndex * rowLength : 
    rowIndex * rowLength + (rowLength - index - 1);

    let isVisited = false;
    if(visitedPath != null) {
       isVisited = visitedPath.some(
            (visitedArticle: Article) =>
                visitedArticle.title === step.title && visitedArticle.link === step.link
        );
    }

    const isActive = activeNode === nodeIndex;
    const isHovered = hoveredNode === nodeIndex;

    return (
        <div 
        key={nodeIndex}
        className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer
            ${isVisited ? "bg-blue-500 text-white border-green-400" : "bg-white border-gray-300"}
            ${isActive && "border-yellow-400 shadow-gray-400 drop-shadow-2xl"}
            ${isHovered && "shadow-gray-400 drop-shadow-2xl"}`}
            onMouseEnter={() => handleMouseEnterNode(nodeIndex)}
            onMouseLeave={handleMouseLeaveNode}
            onClick={()=>handleClickNode(nodeIndex)}
            title={step.title}
            >
                <p className="truncate text-xs" aria-label={step.title}>
                    {step.title}
                </p>
            </div>
    );
}

export default PathNode;

