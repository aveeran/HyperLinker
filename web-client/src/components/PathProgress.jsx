import React, { useState, useEffect, useMemo } from "react";
import * as utils from "@utils/utils";

function PathProgress() {
  const [isPath, setIsPath] = useState(false);
  const [isDirected, setIsDirected] = useState(false);
  const [endArticle, setEndArticle] = useState({});
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
          // console.log(isPath, isDirected);

          setEdgeHistory(storedGameInformation.edgeHistory);
          setNodeHistory(storedGameInformation.nodeHistory);
          setCurrentNode(storedGameInformation.currentNode);
          setFreePath(storedGameInformation.freePath);
          setVisited(storedGameInformation.visitedPath);
          setEndArticle(storedCustomizations.end);
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
        }
      }

      chrome.storage.onChanged.addListener(handleTimeChanges);
      return () => {
        chrome.storage.onChanged.removeListener(handleTimeChanges);
      };
    }
  }, [isChromeExtension]);

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
      <div className="flex flex-wrap items-center gap-4 p-2">
        {isDirected || !isPath
          ? path.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${
                    visited.includes(step.link)
                      ? "bg-blue-500 text-white border-green-400"
                      : "bg-white border-gray-300"
                  } ${activeNode === index ? "border-yellow-400" : ""}`}
                  onMouseEnter={() => handleMouseEnterNode(index)}
                  onMouseLeave={handleMouseLeaveNode}
                  onClick={() => handleClickNode(index)}
                  title={step.title}
                >
                  <p className="truncate text-sm" aria-label={step.title}>
                    {step.title}
                  </p>
                </div>
                {index < path.length - 1 && (
                  <div
                    className={`h-2 ${
                      visited.includes(path[index].link) &&
                      visited.includes(path[index + 1].link)
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
  
      {(hoveredNode !== null ||
        activeNode !== null ||
        hoveredLink !== null ||
        activeLink !== null) && (
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
    </div>
  );
  
  
}

export default PathProgress;