import { useCallback, useEffect, useState } from "react";
import { Article, ClientGameInterface, GameStatusInterface, MODE_PATH, UPDATE_PAUSE } from "../utils/utils";
import React from "react";

function PathProgress({gameClientInformation, gameStatus, pathCustomizations, path} : {gameClientInformation: ClientGameInterface,
    gameStatus: GameStatusInterface, pathCustomizations: {type: string, directed: boolean}, path : Article[]
}) {

    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [hoveredLink, setHoveredLink] = useState<number | null>(null);
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const [currentNode, setCurrentNode] = useState<number>(0);
    const [endIndex, setEndIndex] = useState<number>(path.length-1);

    let isPath = pathCustomizations.type == MODE_PATH;
    let isDirected = pathCustomizations.directed;


    const [time, setTime] = useState<number>(0); // dummy-variable to force re-render
    let interval : NodeJS.Timeout | null = null;

    useEffect(() => {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        if(interval) {
          clearInterval(interval);
        }
      }
    }, [])

    console.log(gameStatus.paused);

    useEffect(() => {
      chrome.runtime.onMessage.addListener((message, sender, response) => {
        if(message.type === UPDATE_PAUSE) {
          if(message.pause && interval) {
            clearInterval(interval);
          } else if (!message.pause) {
            interval = setInterval(() => {
              setTime((prevTime) => prevTime + 1);
            }, 1000);
          }
        }
      })
    }, []);

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


      const renderElapsedTime = () => {        
        const prevLeave = gameClientInformation.nodeHistory[ (((activeNode ?? hoveredNode)) ?? 0) - 1]?.leaveTime;
        const delay = gameClientInformation.nodeHistory[ (((activeNode ?? hoveredNode)) ?? 0)]?.delayTime * 1000;

        if(gameClientInformation.nodeHistory[ ((activeNode ?? hoveredNode)) ?? 0].leaveTime != null) {
          // if we already left, use leave time and either gameStatus.startTime or prevLeave
          const leaveTime = (gameClientInformation.nodeHistory[ ((activeNode ?? hoveredNode)) ?? 0].leaveTime ?? 0);

          if(prevLeave != null) {
            return (
              <>
                {parseTime((leaveTime- prevLeave - delay)/1000)}
              </>
            )
          } else {
            return (
              <>
                {parseTime((leaveTime - gameStatus.startTime - delay) / 1000)}
              </>
            )

          }
        } else {
          // if not left yet, worry about pausing
          const reference: number = gameStatus.paused ? gameStatus.pauseStart ?? Date.now() : Date.now();
          if(prevLeave != null) {
            return (
              <>
                {parseTime((reference-prevLeave-delay)/1000)}
              </>
            );
          } else {
            return (
              <>
                {parseTime((reference-gameStatus.startTime-delay)/1000)}
              </>
            )
          }
        }
      }
      function generateNode(rowIndex: number, step: Article, index: number, rowLength: number) {
        const nodeIndex = rowIndex % 2 === 0 ? index + rowIndex * rowLength : rowIndex * rowLength + (rowLength - index - 1);
        const isVisited = gameClientInformation.visitedPath.some(
          (visitedArticle: Article) => visitedArticle.title === step.title && visitedArticle.link === step.link
        );
        const isActive = activeNode === nodeIndex;
        const isHovered = hoveredNode === nodeIndex;
      
        return (
          <div
            key={nodeIndex}
            className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
              isVisited ? "bg-blue-500 text-white border-green-400" : "bg-white border-gray-300"
            } ${isActive ? "border-yellow-400 shadow-gray-400 drop-shadow-2xl" : ""} ${
              isHovered ? "shadow-gray-400 drop-shadow-2xl" : ""
            }`}
            onMouseEnter={() => handleMouseEnterNode(nodeIndex)}
            onMouseLeave={handleMouseLeaveNode}
            onClick={() => handleClickNode(nodeIndex)}
            title={step.title}
          >
            <p className="truncate text-sm" aria-label={step.title}>
              {step.title}
            </p>
          </div>
        );
      }
      
      function generateLink(rowIndex: number, index: number, rowLength: number) {
        const linkIndex = rowIndex % 2 === 0 ? index + rowIndex * rowLength : rowIndex * rowLength + (rowLength - index - 1) - 1;
        const isActive = activeLink === linkIndex;
        const isHovered = hoveredLink === linkIndex;
        const isVisited =
          gameClientInformation.visitedPath.some(
            (visitedArticle) =>
              visitedArticle.title === path[linkIndex]?.title && visitedArticle.link === path[linkIndex]?.link
          ) &&
          gameClientInformation.visitedPath.some(
            (visitedArticle) =>
              visitedArticle.title === path[linkIndex + 1]?.title && visitedArticle.link === path[linkIndex + 1]?.link
          );
      
        return (
          <div
            key={`link-${linkIndex}`}
            className={`h-2 w-8 ${isVisited ? "bg-green-500" : "bg-gray-300"} ${
              isActive ? "border-2 border-green-400 shadow-gray-600 drop-shadow-xl" : ""
            } ${isHovered ? "shadow-gray-600 drop-shadow-xl" : ""}`}
            onMouseEnter={() => handleMouseEnterLink(linkIndex)}
            onMouseLeave={handleMouseLeaveLink}
            onClick={() => handleClickLink(linkIndex)}
          ></div>
        );
      }
      
      function generateRow(row: Article[], rowIndex: number, rowLength: number) {
        return (
          <div
            className={`flex items-center gap-4 ${rowIndex === 1 ? "justify-end" : ""}`}
            key={`row-${rowIndex}`}
          >
            {row.map((step, index) => (
              <React.Fragment key={`node-${rowIndex}-${index}`}>
                {generateNode(rowIndex, step, index, rowLength)}
                {index < row.length - 1 && generateLink(rowIndex, index, rowLength)}
              </React.Fragment>
            ))}
          </div>
        );
      }
      
      function generateVerticalConnector(rowIndex: number) {
        const connectorIndex = rowIndex % 2 === 0 ? 2 : 5;
        const isActive = activeLink === connectorIndex;
        const isHovered = hoveredLink === connectorIndex;
        const isVisited =
          rowIndex % 2 === 0
            ? gameClientInformation.visitedPath.some(
                (visitedArticle) => visitedArticle.title === path[2].title && visitedArticle.link === path[2].link
              ) &&
              gameClientInformation.visitedPath.some(
                (visitedArticle) => visitedArticle.title === path[3].title && visitedArticle.link === path[3].link
              )
            : gameClientInformation.visitedPath.some(
                (visitedArticle) => visitedArticle.title === path[5].title && visitedArticle.link === path[5].link
              ) &&
              gameClientInformation.visitedPath.some(
                (visitedArticle) => visitedArticle.title === path[6].title && visitedArticle.link === path[6].link
              );
      
        return (
          <div
            key={`connector-${rowIndex}`}
            className={`flex ${rowIndex % 2 === 0 ? "justify-end" : "justify-start"}`}
            style={{ width: "100%" }}
            onMouseEnter={() => handleMouseEnterLink(connectorIndex)}
            onMouseLeave={handleMouseLeaveLink}
            onClick={() => handleClickLink(connectorIndex)}
          >
            <div
              className={`w-2 h-8 ${
                isVisited ? "bg-green-500" : "bg-gray-300"
              } ${rowIndex % 2 === 0 ? "mr-5" : "ml-5"} ${
                isActive ? "border-2 border-green-400 shadow-gray-400 drop-shadow-xl" : ""
              } ${isHovered ? "shadow-gray-400 drop-shadow-xl" : ""}`}
            ></div>
          </div>
        );
      }
      
      // TODO: the only difference between the two is which type of path they get
       function RenderPath() {
        const rowLength = 3;
      
        const rows = path.reduce<Array<Array<Article>>>((acc, step, index) => {
          const rowIndex = Math.floor(index / rowLength);
          if (!acc[rowIndex]) acc[rowIndex] = [];
          acc[rowIndex].push(step);
          return acc;
        }, []);
      
        return (
          <>
            {rows.map((row, rowIndex) => (
              <>
                {generateRow(row, rowIndex, rowLength)}
                {rowIndex < rows.length - 1 && generateVerticalConnector(rowIndex)}
              </>
            ))}
          </>
        );
      }

      function RenderFreePath() {
        const rowLength = 3;
      
        // Group the free path into rows
        const rows = gameClientInformation.freePath.reduce<Array<Array<Article>>>(
          (acc, step, index) => {
            const rowIndex = Math.floor(index / rowLength);
            if (!acc[rowIndex]) acc[rowIndex] = [];
            acc[rowIndex].push(step);
            return acc;
          },
          []
        );
      
        // Reverse every other row
        rows.forEach((row, index) => {
          if (index % 2 === 1) row.reverse();
        });
      
        return (
          <>
            {rows.map((row, rowIndex) => (
              <React.Fragment key={`free-path-row-${rowIndex}`}>
                {generateRow(row, rowIndex, rowLength)}
                {rowIndex < rows.length - 1 && generateVerticalConnector(rowIndex)}
              </React.Fragment>
            ))}
          </>
        );
      }

      return (
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-4 p-2">
            
            {(isDirected || !isPath) && RenderPath()
              }
    
            {(!isDirected &&
              isPath) &&
              RenderFreePath()}
    
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
                            elapsedTime: {renderElapsedTime()}
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