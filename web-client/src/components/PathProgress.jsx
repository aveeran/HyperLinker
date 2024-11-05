import React, { useState, useEffect, useMemo } from "react";
import * as utils from "@utils/utils";

function PathProgress() {
  const [isPath, setIsPath] = useState(false);
  const [isDirected, setIsDirected] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [visited, setVisited] = useState([]);
  const [edgeHistory, setEdgeHistory] = useState([]);
  const [nodeHistory, setNodeHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);
  const [path, setPath] = useState([]);
  const [freePath, setFreePath] = useState([]);
  const [endIndex, setEndIndex] = useState(0);

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(
        [
          utils.SINGLEPLAYER_GAME_INFORMATION,
          utils.SINGLEPLAYER_GAME_PROPERTIES,
          utils.SINGLEPLAYER_CUSTOMIZATIONS,
          utils.END_GAME_INFO
        ],
        (result) => {
          // the problem here is that we need an indicator that the game is done...?
          const storedEndGameInfo = result[utils.END_GAME_INFO] || utils.defaultEndGameInfo;
          const ended = storedEndGameInfo.ended || false; // TODO: rework the data structure

          const storedGameInformation = ended ? storedEndGameInfo.singleplayerGameInformation : 
          result[utils.SINGLEPLAYER_GAME_INFORMATION] || utils.defaultGameInformation;

          const storedGameProperties = ended ? storedEndGameInfo.singleplayerGameProperties :
          result[utils.SINGLEPLAYER_GAME_PROPERTIES] || utils.defaultGameProperties;

          const storedCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS] || utils.defaultSingleplayerCustomizations;

          setPath(storedGameProperties.path);
          setIsDirected(storedCustomizations.mode.path.directed);
          setIsPath(storedCustomizations.mode.type === "path");

          setEdgeHistory(storedGameInformation.edgeHistory);
          setNodeHistory(storedGameInformation.nodeHistory);
          setCurrentNode(storedGameInformation.currentNode);
          setFreePath(storedGameInformation.freePath);
          setVisited(storedGameInformation.visitedPath);
          
          let endIndex = storedGameProperties.path?.length || storedGameInformation.freePath?.length;
          endIndex--;
          setEndIndex(endIndex);
        }
      );

      function handleTimeChanges(changes, areaName) {
        if (areaName === "local") {
          if (
            changes[utils.SINGLEPLAYER_GAME_INFORMATION] &&
            changes[utils.SINGLEPLAYER_GAME_INFORMATION].newValue
          ) {
            const storedGameInformation =
              changes[utils.SINGLEPLAYER_GAME_INFORMATION].newValue;
            setEdgeHistory(storedGameInformation.edgeHistory);
            setNodeHistory(storedGameInformation.nodeHistory);
            setCurrentNode(storedGameInformation.currentNode);
          }

          if(
            changes[utils.END_GAME_INFO] && 
            changes[utils.END_GAME_INFO].newValue
          ) {
            const storedEndGameInfo = changes[utils.END_GAME_INFO].newValue;
            const storedGameInformation = storedEndGameInfo.singleplayerGameInformation;
            const storedGameProperties = storedEndGameInfo.singleplayerGameProperties;
            const storedCustomizations = storedEndGameInfo.singleplayerCustomizations;


            setPath(storedGameProperties.path);
            setIsDirected(storedCustomizations.mode.path.directed);
            setIsPath(storedCustomizations.mode.type === "path");

            setEdgeHistory(storedGameInformation.edgeHistory);
            setNodeHistory(storedGameInformation.nodeHistory);
            setCurrentNode(storedGameInformation.currentNode);
            setFreePath(storedGameInformation.freePath);
            setVisited(storedGameInformation.visitedPath);
            let endIndex = storedGameProperties.path?.length || storedGameInformation.freePath?.length;
            endIndex--;
            setEndIndex(endIndex);
          }
        }
      }

      chrome.storage.onChanged.addListener(handleTimeChanges);
      return () => {
        chrome.storage.onChanged.removeListener(handleTimeChanges);
      };
    } else {
      const storedGameInformation = utils.defaultGameInformation;

      const storedGameProperties =  utils.defaultGameProperties;

      const storedCustomizations =  utils.defaultSingleplayerCustomizations;

    
      setPath(storedGameProperties.path);
      setIsDirected(storedCustomizations.mode.path.directed);
      setIsPath(storedCustomizations.mode.type === "path");

      setEdgeHistory(storedGameInformation.edgeHistory);
      setNodeHistory(storedGameInformation.nodeHistory);
      setCurrentNode(storedGameInformation.currentNode);
      setFreePath(storedGameInformation.freePath);
      setVisited(storedGameInformation.visitedPath);
      
      let endIndex = storedGameProperties.path?.length || storedGameInformation.freePath?.length;
      endIndex--;
      setEndIndex(endIndex);
    }


    
  }, [isChromeExtension]);

  // useEffect(() => {
  //   if(isChromeExtension) {
  //     function handleTimeChanges(changes, areaName) {
  //       if (areaName === "local") {
  //         if (
  //           changes[utils.SINGLEPLAYER_GAME_INFORMATION] &&
  //           changes[utils.SINGLEPLAYER_GAME_INFORMATION].newValue
  //         ) {
  //           const storedGameInformation =
  //             changes[utils.SINGLEPLAYER_GAME_INFORMATION].newValue;
  //           setEdgeHistory(storedGameInformation.edgeHistory);
  //           setNodeHistory(storedGameInformation.nodeHistory);
  //           setCurrentNode(storedGameInformation.currentNode);
  //         }

  //         if(
  //           changes[utils.END_GAME_INFO] && 
  //           changes[utils.END_GAME_INFO].newValue
  //         ) {
  //           const storedEndGameInfo = changes[utils.END_GAME_INFO].newValue;
  //           const storedGameInformation = storedEndGameInfo.singleplayerGameInformation;
  //           const storedGameProperties = storedEndGameInfo.singleplayerGameProperties;
  //           const storedCustomizations = storedEndGameInfo.singleplayerCustomizations;
  //           console.log('acc updating', storedEndGameInfo, storedGameInformation, storedGameProperties, storedCustomizations);


  //           setPath(storedGameProperties.path);
  //           setIsDirected(storedCustomizations.mode.path.directed);
  //           setIsPath(storedCustomizations.mode.type === "path");

  //           setEdgeHistory(storedGameInformation.edgeHistory);
  //           setNodeHistory(storedGameInformation.nodeHistory);
  //           setCurrentNode(storedGameInformation.currentNode);
  //           setFreePath(storedGameInformation.freePath);
  //           setVisited(storedGameInformation.visitedPath);
  //           let endIndex = storedGameProperties.path?.length || storedGameInformation.freePath?.length;
  //           endIndex--;
  //           setEndIndex(endIndex);
  //         }
  //       }
  //     }

  //     chrome.storage.onChanged.addListener(handleTimeChanges);
  //     return () => {
  //       chrome.storage.onChanged.removeListener(handleTimeChanges);
  //     };
  //   }
  // }, [isChromeExtension])

  const handleMouseEnterNode = (index) => {
    setHoveredNode(index);
  };

  const handleMouseLeaveNode = () => {
    if (activeNode === null) {
      setHoveredNode(null);
    }
  };

  const handleMouseEnterLink = (index) => {
    setHoveredLink(index);
  };

  const handleMouseLeaveLink = () => {
    if (activeLink === null) {
      setHoveredLink(null);
    }
  };

  const handleClickNode = (index) => {
    setActiveNode((prevActiveNode) =>
      prevActiveNode === index ? null : index
    );
    setActiveLink(null);
  };

  const handleClickLink = (index) => {
    setActiveLink((prevActiveLink) =>
      prevActiveLink === index ? null : index
    );
    setActiveNode(null);
  };
  
  return (
    <div className="flex flex-col items-center">

      <div className="flex flex-col gap-4 p-2">
      {(isDirected || !isPath) &&
    path
      .reduce((acc, step, index) => {
        const rowLength = 3; 
        const rowIndex = Math.floor(index / rowLength);
        if (!acc[rowIndex]) acc[rowIndex] = [];
        acc[rowIndex].push(step);
        return acc;
      }, [])
      .map((row, i) => (i % 2 === 1 ? row.reverse() : row)) // Reverse every other row
      .flatMap((row, rowIndex, rows) => [

        <div className="flex items-center gap-4" key={rowIndex}>
          {row.map((step, index) => (
            <React.Fragment key={index+(rowIndex*3)}>
              <div
                className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
                  visited.includes(step.link)
                    ? "bg-blue-500 text-white border-yellow-400"
                    : "bg-white border-gray-300"
                } ${activeNode === (rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1))) ? "border-red-400" : ""}`}
                onMouseEnter={() => handleMouseEnterNode((rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1))))}
                onMouseLeave={handleMouseLeaveNode}
                onClick={() => handleClickNode((rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1))))}
                title={step.title}
              >
                <p className="truncate text-sm" aria-label={step.title}>
                  {step.title + " " + (index+(rowIndex*3))}
                </p>
              </div>

              {index < row.length - 1 && (
                <div
                  className={`h-2 ${//TODO: LOL
                    visited.includes(path[(rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1)))].link) &&
                    visited.includes(path[(rowIndex % 2 == 0 ? (index+(rowIndex*3)+1) : ((rowIndex*3)+(3-index-1))-1)].link)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  } ${activeLink === (rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1)-1)) ? "border-2 border-green-400" : ""}`}
                  style={{ width: "2rem" }}
                  onMouseEnter={() => handleMouseEnterLink((rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1)-1)))}
                  onMouseLeave={handleMouseLeaveLink}
                  onClick={() => handleClickLink((rowIndex % 2 == 0 ? (index+(rowIndex*3)) : ((rowIndex*3)+(3-index-1)-1)))}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>,



        rowIndex < rows.length - 1 && (
          <div
            key={`connector-${rowIndex}`}
            className={`flex ${rowIndex % 2 === 0 ? "justify-end" : "justify-start"}`}
            style={{ width: "100%" }}
            onMouseEnter={() => handleMouseEnterLink(rowIndex % 2 == 0 ? 2 : 5)}
            onMouseLeave={handleMouseLeaveLink}
            onClick={()=>handleClickLink(rowIndex % 2 == 0 ? 2 : 5)}
          >
            <div className={`w-2 bg-gray-300 h-8 
            ${
              rowIndex % 2 == 0 ? 
              (visited.includes(path[2]?.link) && visited.includes(path[3]?.link) ? "bg-green-500" : "bg-gray-300") 
              : (visited.includes(path[5]?.link) && visited.includes(path[6]?.link) ? "bg-green-500" : "bg-gray-300")
            }    
            ${rowIndex % 2 == 0 ? "mr-5":"ml-5"}
            ${activeLink === (rowIndex % 2 == 0 ? 2 : 5)? "border-2 border-green-400" : ""}  `}></div> {/* Vertical connector */}
          </div>
        ),
      ])}


        {!isDirected && isPath
          ? freePath.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
                    visited.includes(step.link)
                      ? "bg-blue-500 text-white"
                      : "bg-white border-gray-300"
                  } ${activeNode === index ? "border-orange-400" : ""}`}
                  onMouseEnter={() => handleMouseEnterNode(index)}
                  onMouseLeave={handleMouseLeaveNode}
                  onClick={() => handleClickNode(index)}
                  title={step.title}
                >
                  <p className="truncate text-sm" aria-label={step.title}>
                    {step.title}
                  </p>
                </div>
                {index < freePath.length - 1 && (
                  <div
                    className={`h-2 ${
                      visited.includes(freePath[index].link) &&
                      visited.includes(freePath[index + 1].link)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } ${
                      activeLink === index ? "border-2 border-green-400" : ""
                    }`}
                    style={{ width: "2rem" }} // Adjust width as needed
                    onMouseEnter={() => handleMouseEnterLink(index)}
                    onMouseLeave={handleMouseLeaveLink}
                    onClick={() => handleClickLink(index)}
                  ></div>
                )}
              </React.Fragment>
            ))
          : null}
      </div>
  
      {((hoveredNode !== null ||
        activeNode !== null ||
        hoveredLink !== null ||
        activeLink !== null) && (hoveredNode !== endIndex && activeNode !== endIndex)) && (
        <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
          {(activeNode !== null || hoveredNode !== null) && (
            <div
              className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 ${
                activeNode !== null ? "border-yellow-400" : "border-red-400"
              }`}
            >
              <h3 className="font-bold">
                Node History for{" "}
                {!isDirected && isPath
                  ? freePath[activeNode ?? hoveredNode]?.title
                  : path[activeNode ?? hoveredNode]?.title}
              </h3>
              <ul>
                {currentNode >= (activeNode ?? hoveredNode) ? (
                  Object.entries(
                    nodeHistory[activeNode ?? hoveredNode] || {
                      clicks: 0,
                      elapsedTime: 0,
                    }
                  ).map(([key, value], i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {key}: {value}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-700">No history to show</p>
                )}
              </ul>
            </div>
          )}
  
          {(activeLink !== null || hoveredLink !== null) && (
            <div className="mt-4 p-2 border border-green-300 bg-white rounded shadow-lg m-2">
              <h3 className="font-bold">
                Edge History for Link between{" "}
                {!isDirected && isPath
                  ? freePath[hoveredLink]?.title
                  : path[hoveredLink]?.title}{" "}
                and{" "}
                {!isDirected && isPath
                  ? freePath[hoveredLink + 1]?.title
                  : path[hoveredLink + 1]?.title}
              </h3>
              <ul>
                {edgeHistory[activeLink ?? hoveredLink]?.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    <a
                      href={entry.url}
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


      {
        (activeNode === endIndex || hoveredNode === endIndex) && (
          <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
            <div
              className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 ${
                activeNode !== null ? "border-yellow-400" : "border-red-400"
              }`}>
                <h3 className="font-bold">
                  Target Node: {!isDirected && isPath ? freePath[activeNode ?? hoveredNode]?.title 
                  : path[activeNode ?? hoveredNode]?.title}
                </h3>
            </div>
          </div>
          )
      }
    </div>
  );
  
  
}

export default PathProgress;