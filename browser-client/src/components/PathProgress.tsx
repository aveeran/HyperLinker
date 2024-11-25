import { useCallback, useEffect, useState } from "react";
import { Article, ClientGameInterface, GameStatusInterface, MODE_PATH } from "../utils/utils";
import React from "react";

function PathProgress({gameClientInformation, gameStatus, pathCustomizations, path} : {gameClientInformation: ClientGameInterface,
    gameStatus: GameStatusInterface, pathCustomizations: {type: string, directed: boolean}, path : Article[]
}) {
    const [isPath, setIsPath] = useState<boolean>(pathCustomizations.type === MODE_PATH);
    const [isDirected, setIsDirected] = useState<boolean>(pathCustomizations.directed);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [hoveredLink, setHoveredLink] = useState<number | null>(null);
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const [currentNode, setCurrentNode] = useState<number>(0);
    const [endIndex, setEndIndex] = useState<number>(path.length-1);

    const [time, setTime] = useState<number>(0); // dummy-variable to force re-render

    useEffect(() => {
      let interval : NodeJS.Timeout | null = null;
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        if(interval) {
          clearInterval(interval);
        }
      }
    }, [])

    useEffect(() => {
      if(gameClientInformation.currentNode != currentNode) {
        setCurrentNode(gameClientInformation.currentNode);
      }
    }, [gameClientInformation.currentNode, currentNode])


    const handleMouseEnterNode = (index: number) => {
        setHoveredNode(index);
      };
    
      const handleMouseLeaveNode = () => {
        if (activeNode === null) {
          setHoveredNode(null);
        }
      };
    
      const handleMouseEnterLink = (index : number) => {
        setHoveredLink(index);
      };
    
      const handleMouseLeaveLink = () => {
        if (activeLink === null) {
          setHoveredLink(null);
        }
      };
    
      const handleClickNode = (index : number) => {
        setActiveNode((prevActiveNode) =>
          prevActiveNode === index ? null : index
        );
        setActiveLink(null);
      };
    
      const handleClickLink = (index : number) => {
        setActiveLink((prevActiveLink) =>
          prevActiveLink === index ? null : index
        );
        setActiveNode(null);
      };

      const debugLog = (value: any) => {
        console.log(value);
        return value;
      }

      const parseTime = useCallback((seconds: number) => {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
        const formattedMinutes = `${String(minutes).padStart(2, "0")}:`;
        const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    
        return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
      }, []);
   
 
      return (
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-4 p-2">
            {(isDirected || !isPath) &&
              path
                .reduce<Array<Array<Article>>>((acc, step, index) => {
                  const rowLength: number = 3;
                  const rowIndex: number = Math.floor(index / rowLength);
                  if (!acc[rowIndex]) acc[rowIndex] = [];
                  acc[rowIndex].push(step);
                  return acc;
                }, [])
                .map((row, i) => (i % 2 === 1 ? row.reverse() : row)) // Reverse every other row
                .flatMap((row, rowIndex, rows) => [
                  <div className={`flex items-center gap-4 ${rowIndex == 1 ? "justify-end" : ""} `} key={rowIndex}>
                    {row.map((step, index) => (
                      <React.Fragment key={index + rowIndex * 3}>
                        <div
                          className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
                            gameClientInformation.visitedPath.some(
                              (visitedArticle: Article) => visitedArticle.title === step.title && visitedArticle.link === step.link
                            )
                              ? "bg-blue-500 text-white border-green-400"
                              : "bg-white border-gray-300"
                          } ${
                            activeNode ===
                            (rowIndex % 2 == 0
                              ? index + rowIndex * 3
                              : rowIndex * 3 + (3 - index - 1))
                              ? "border-yellow-400 shadow-gray-400 drop-shadow-2xl"
                              : ""
                          }
                           ${
                            hoveredNode ===
                            (rowIndex % 2 == 0
                              ? index + rowIndex * 3
                              : rowIndex * 3 + (3 - index - 1))
                              ? "shadow-gray-400 drop-shadow-2xl"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            handleMouseEnterNode(
                              rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1)
                            )
                          }
                          onMouseLeave={handleMouseLeaveNode}
                          onClick={() =>
                            handleClickNode(
                              rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1)
                            )
                          }
                          title={step.title}
                        >
                          <p className="truncate text-sm" aria-label={step.title}>
                            {step.title}
                            
                          </p>
                        </div>
    
                        {index < row.length - 1 && (
                          <div
                            className={`h-2 ${
                              gameClientInformation.visitedPath.some(
                                (visitedArticle) =>
                                  visitedArticle.title === path[
                                    rowIndex % 2 === 0
                                      ? index + rowIndex * 3
                                      : rowIndex * 3 + (3 - index - 1)
                                  ].title &&
                                  visitedArticle.link === path[
                                    rowIndex % 2 === 0
                                      ? index + rowIndex * 3
                                      : rowIndex * 3 + (3 - index - 1)
                                  ].link
                              ) &&
                              gameClientInformation.visitedPath.some(
                                (visitedArticle) =>
                                  visitedArticle.title === path[
                                    rowIndex % 2 === 0
                                      ? index + rowIndex * 3 + 1
                                      : rowIndex * 3 + (3 - index - 1) - 1
                                  ].title &&
                                  visitedArticle.link === path[
                                    rowIndex % 2 === 0
                                      ? index + rowIndex * 3 + 1
                                      : rowIndex * 3 + (3 - index - 1) - 1
                                  ].link
                              )
                              
                                ? "bg-green-500"
                                : "bg-gray-300"
                            } ${
                              activeLink ===
                              (rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1) - 1)
                                ? "border-2 border-green-400 shadow-gray-600 drop-shadow-xl"
                                : ""
                            }
                            
                            ${
                              hoveredLink ===
                              (rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1) - 1)
                                ? " shadow-gray-600 drop-shadow-xl"
                                : ""
                            }`}
                            style={{ width: "2rem" }}
                            onMouseEnter={() =>
                              handleMouseEnterLink(
                                rowIndex % 2 == 0
                                  ? index + rowIndex * 3
                                  : rowIndex * 3 + (3 - index - 1) - 1
                              )
                            }
                            onMouseLeave={handleMouseLeaveLink}
                            onClick={() =>
                              handleClickLink(
                                rowIndex % 2 == 0
                                  ? index + rowIndex * 3
                                  : rowIndex * 3 + (3 - index - 1) - 1
                              )
                            }
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>,
    
                  rowIndex < rows.length - 1 && (
                    <div
                      key={`connector-${rowIndex}`}
                      className={`flex ${
                        rowIndex % 2 === 0 ? "justify-end" : "justify-start"
                      }`}
                      style={{ width: "100%" }}
                      onMouseEnter={() =>
                        handleMouseEnterLink(rowIndex % 2 == 0 ? 2 : 5)
                      }
                      onMouseLeave={handleMouseLeaveLink}
                      onClick={() => handleClickLink(rowIndex % 2 == 0 ? 2 : 5)}
                    >
                      <div
                        className={`w-2 bg-gray-300 h-8 
                ${
                  rowIndex % 2 === 0
                  ? gameClientInformation.visitedPath.some(
                      (visitedArticle) =>
                        visitedArticle.title === path[2].title && visitedArticle.link === path[2].link
                    ) &&
                    gameClientInformation.visitedPath.some(
                      (visitedArticle) =>
                        visitedArticle.title === path[3].title && visitedArticle.link === path[3].link
                    )
                    ? "bg-green-500"
                    : "bg-gray-300"
                  : gameClientInformation.visitedPath.some(
                      (visitedArticle) =>
                        visitedArticle.title === path[5].title && visitedArticle.link === path[5].link
                    ) &&
                    gameClientInformation.visitedPath.some(
                      (visitedArticle) =>
                        visitedArticle.title === path[6].title && visitedArticle.link === path[6].link
                    )
                  ? "bg-green-500"
                  : "bg-gray-300"
                }    
                ${rowIndex % 2 == 0 ? "mr-5" : "ml-5"}
                ${
                  activeLink === (rowIndex % 2 == 0 ? 2 : 5)
                    ? "border-2 border-green-400 shadow-gray-400 drop-shadow-xl"
                    : ""
                }  ${
                  hoveredLink === (rowIndex % 2 == 0 ? 2 : 5)
                    ? "shadow-gray-400 drop-shadow-xl"
                    : ""
                }`}
                      ></div>{" "}
                      {/* Vertical connector */}
                    </div>
                  ),
                ])}
    
            {(!isDirected &&
              isPath) &&
              gameClientInformation.freePath
                .reduce<Array<Array<Article>>>((acc, step, index) => {
                  const rowLength = 3;
                  const rowIndex = Math.floor(index / rowLength);
                  if (!acc[rowIndex]) acc[rowIndex] = [];
                  acc[rowIndex].push(step);
                  return acc;
                }, [])
                .map((row, i) => (i % 2 === 1 ? row.reverse() : row)) // Reverse every other row
                .flatMap((row, rowIndex, rows) => [
                  <div className={`flex gap-4 items-center ${rowIndex % 2 == 0 ? "" : "justify-end"}`} key={rowIndex}>
                    {row.map((step, index) => (
                      <React.Fragment key={index + rowIndex * 3}>
                        <div
                          className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
                            gameClientInformation.visitedPath.some(
                              (visitedArticle) => visitedArticle.title === step.title && visitedArticle.link === step.link
                            )
                              ? "bg-blue-500 text-white border-yellow-400"
                              : "bg-white border-gray-300"
                          } ${
                            activeNode ===
                            (rowIndex % 2 == 0
                              ? index + rowIndex * 3
                              : rowIndex * 3 + (3 - index - 1))
                              ? "border-red-400"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            handleMouseEnterNode(
                              rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1)
                            )
                          }
                          onMouseLeave={handleMouseLeaveNode}
                          onClick={() =>
                            handleClickNode(
                              rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1)
                            )
                          }
                          title={step.title}
                        >
                          <p className="truncate text-sm" aria-label={step.title}>
                            {step.title}
                          </p>
                        </div>
                        {index < row.length - 1 && (
                          <div
                            className={`h-2 ${
                              gameClientInformation.visitedPath.some(
                                (visitedArticle) =>
                                  visitedArticle.title ===
                                    path[
                                      rowIndex % 2 === 0
                                        ? index + rowIndex * 3
                                        : rowIndex * 3 + (3 - index - 1)
                                    ].title &&
                                  visitedArticle.link ===
                                    path[
                                      rowIndex % 2 === 0
                                        ? index + rowIndex * 3
                                        : rowIndex * 3 + (3 - index - 1)
                                    ].link
                              ) &&
                              gameClientInformation.visitedPath.some(
                                (visitedArticle) =>
                                  visitedArticle.title ===
                                    path[
                                      rowIndex % 2 === 0
                                        ? index + rowIndex * 3 + 1
                                        : rowIndex * 3 + (3 - index - 1) - 1
                                    ].title &&
                                  visitedArticle.link ===
                                    path[
                                      rowIndex % 2 === 0
                                        ? index + rowIndex * 3 + 1
                                        : rowIndex * 3 + (3 - index - 1) - 1
                                    ].link
                              )
                                ? "bg-green-500"
                                : "bg-gray-300"
                            } ${
                              activeLink ===
                              (rowIndex % 2 == 0
                                ? index + rowIndex * 3
                                : rowIndex * 3 + (3 - index - 1) - 1)
                                ? "border border-green-400 shadow-2xl"
                                : ""
                            }`}
                            style={{ width: "2rem" }}
                            onMouseEnter={() =>
                              handleMouseEnterLink(
                                rowIndex % 2 == 0
                                  ? index + rowIndex * 3
                                  : rowIndex * 3 + (3 - index - 1) - 1
                              )
                            }
                            onMouseLeave={handleMouseLeaveLink}
                            onClick={() =>
                              handleClickLink(
                                rowIndex % 2 == 0
                                  ? index + rowIndex * 3
                                  : rowIndex * 3 + (3 - index - 1) - 1
                              )
                            }
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>,
    
                  rowIndex < rows.length - 1 && (
                    <div
                      key={`connector-${rowIndex}`}
                      className={`flex ${
                        rowIndex % 2 === 0 ? "justify-end" : "justify-start"
                      }`}
                      style={{ width: "100%" }}
                      onMouseEnter={() =>
                        handleMouseEnterLink(rowIndex % 2 == 0 ? 2 : 5)
                      }
                      onMouseLeave={handleMouseLeaveLink}
                      onClick={() => handleClickLink(rowIndex % 2 == 0 ? 2 : 5)}
                    >
                      <div
                        className={`w-2 bg-gray-300 h-8 
                      ${
                        rowIndex % 2 === 0
                      ? gameClientInformation.visitedPath.some(
                          (visitedArticle) =>
                            visitedArticle.title === path[2].title && visitedArticle.link === path[2].link
                        ) &&
                        gameClientInformation.visitedPath.some(
                          (visitedArticle) =>
                            visitedArticle.title === path[3].title && visitedArticle.link === path[3].link
                        )
                        ? "bg-green-500"
                        : "bg-gray-300"
                      : gameClientInformation.visitedPath.some(
                          (visitedArticle) =>
                            visitedArticle.title === path[5].title && visitedArticle.link === path[5].link
                        ) &&
                        gameClientInformation.visitedPath.some(
                          (visitedArticle) =>
                            visitedArticle.title === path[6].title && visitedArticle.link === path[6].link
                        )
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }    
                      ${rowIndex % 2 == 0 ? "mr-5" : "ml-5"}
                      ${
                        activeLink === (rowIndex % 2 == 0 ? 2 : 5) ? "border-2 border-green-400" : ""
                      }  `}
                      ></div>{" "}
                    </div>
                  ),
                ])}
    
          </div>
    
          {(hoveredNode !== null ||
            activeNode !== null ||
            hoveredLink !== null ||
            activeLink !== null) &&
            hoveredNode !== endIndex &&
            activeNode !== endIndex && (
              <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
                {(activeNode !== null || hoveredNode !== null) && (
                  <div
                    className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 ${
                      activeNode !== null ? "border-yellow-400" : "border-gray-400"
                    }`}
                  >
                    <h3 className="font-bold truncate">
                      Node History for{" "}
                      {!isDirected && isPath
                        ? gameClientInformation.freePath[(activeNode ?? hoveredNode) ?? 0]?.title
                        : path[(activeNode ?? hoveredNode) ?? 0]?.title}
                    </h3>
                    <ul>
                      {currentNode >= ((activeNode ?? hoveredNode) ?? 0) ? (
                        <>
                          <li>
                            clicks: {gameClientInformation.nodeHistory[(activeNode ?? hoveredNode) ?? 0].clicks}
                          </li>
                          <li>
                            elapsedTime: {

                              gameClientInformation.nodeHistory[((activeNode ?? hoveredNode)) ?? 0]?.leaveTime != null ? 
                              (<>
                              {parseTime( 

                                (
                                (gameClientInformation.nodeHistory[ (activeNode ?? hoveredNode) ?? 0].leaveTime ?? 0 )
                                - (gameStatus.startTime) - 
                                gameClientInformation.nodeHistory
                                .slice(0, (activeNode ?? hoveredNode) ?? 0) 
                                .reduce((totalDelay, current) => totalDelay + (current.delayTime ?? 0), 0) 
                                ) / 1000
                                )}
                              </>) :
                              (
                              gameClientInformation.nodeHistory[((activeNode ?? hoveredNode) ?? 0) - 1]?.leaveTime != null ? (
                                <>
                                  {parseTime(
                                    (Date.now() -
                                    (gameClientInformation.nodeHistory[((activeNode ?? hoveredNode) ?? 0) - 1].leaveTime ?? 0))/1000
                                  )}
                                </>
                              ) : (
                                <>
                                {parseTime(
                                  (
                                  Date.now()-gameStatus.startTime-
                                  (gameClientInformation.nodeHistory[ (activeNode ?? hoveredNode) ?? 0].delayTime)
                                  ) / 1000
                                )}
                                
                                </>
                              )
                            )
                            }
                          </li>
                        </>
                      )
                         : (
                        <p className="text-sm text-gray-700">No history to show because {currentNode}</p>
                      )}
                    </ul>
                  </div>
                )}
    
                {(activeLink !== null || hoveredLink !== null) && (
                  <div className="mt-4 p-2 border border-green-300 bg-white rounded shadow-2xl m-2">
                    <h3 className="font-bold truncate">
                      Edge History for Link between{" "}
                      {!isDirected && isPath
                        ? gameClientInformation.freePath[hoveredLink ?? 0]?.title
                        : path[hoveredLink ?? 0]?.title}{" "}
                      and{" "}
                      {!isDirected && isPath
                        ? gameClientInformation.freePath[(hoveredLink ?? 0) + 1]?.title
                        : path[(hoveredLink ?? 0) + 1]?.title}
                    </h3>
                    <ul>
                      {gameClientInformation.edgeHistory[ (activeLink ?? hoveredLink) ?? 0]?.map((entry, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          <a
                            href={entry.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {entry.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
    
          {(activeNode === endIndex || hoveredNode === endIndex) && (
            <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
              <div
                className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 ${
                  activeNode !== null ? "border-yellow-400" : "border-gray-400"
                }`}
              >
                <h3 className="font-bold truncate">
                  Target Node:{" "}
                  {!isDirected && isPath
                    ? gameClientInformation.freePath[(activeNode ?? hoveredNode) ?? 0]?.title
                    : path[(activeNode ?? hoveredNode) ?? 0]?.title}
                </h3>
              </div>
            </div>
          )}
        </div>
      );
    }

export default PathProgress;