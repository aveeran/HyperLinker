import { Article } from "../../utils/utils";

interface PathEdgeProps {
    rowIndex: number,
    index: number,
    rowLength: number,
    handleMouseEnterLink?: (linkIndex: number) => void,
    handleMouseLeaveLink?: () => void,
    handleClickLink?: (linkIndex: number) => void,
    activeLink: number,
    hoveredLink: number
    visitedPath: Article[] | null
    path: Article[] | null
}

function PathEdge(
    {
        rowIndex,
        index,
        rowLength,
        handleMouseEnterLink = (linkIndex: number) => { },
        handleMouseLeaveLink = () => { },
        handleClickLink = (linkIndex: number) => { },
        activeLink,
        hoveredLink,
        visitedPath,
        path
    }: PathEdgeProps) {
    const linkIndex = rowIndex % 2 === 0
        ? index + rowIndex * rowLength
        : rowIndex * rowLength + (rowLength - index - 1) - 1;

    let isVisited = false;

    if (visitedPath != null && path != null) {
        isVisited = visitedPath.some(
            (visitedArticle) =>
                visitedArticle.title === path[linkIndex]?.title &&
                visitedArticle.link === path[linkIndex]?.link
        ) && visitedPath.some(
            (visitedArticle) =>
                visitedArticle.title === path[linkIndex + 1]?.title &&
                visitedArticle.link === path[linkIndex + 1]?.link)
    }

    const isActive = activeLink === linkIndex;
    const isHovered = hoveredLink === linkIndex;

    return (
        <div
        key={`link-${linkIndex}`}
        className={`h-2 w-8 ${isVisited ? "bg-green-500" : "bg-gray-300"}
        ${isActive && "border-2 border-green-400 shadow-gray-600 drop-shadow-xl"}
        ${isHovered && "shadow-gray-600 dropshadow-xl"}`}
        onMouseEnter={() => handleMouseEnterLink(linkIndex)}
        onMouseLeave={handleMouseLeaveLink}
        onClick={() => handleClickLink(linkIndex)}
        ></div>
    );
}

export default PathEdge;