import React, { useState, useEffect, useMemo } from "react";
const defaultGame = {
  singleplayerCustomizations: {
    mode: {
      type: "",
      path: {
        pathLength: 0,
        directed: false,
        intermediate_links: [],
      },
      countDown: {
        timer: 0
      },
    },
    start: {
      title: "",
      end:"",
    },
    track:[],
    restrictions:[]
  },
  playing: false,
  startTime: 0,
  tracking: 0,
  path: [],
  freePath: [],
  visitedPath: [],
  nodeHistory: [],
  edgeHistory: [],
  currentNode: 0,
};
function PathProgress() {
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
  const [gameData, setGameData] = useState({});
  const [path, setPath] = useState([]);
  const [freePath, setFreePath] = useState([]);


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
      <div className="flex items-center w-full p-2">
        {isDirected ? (path.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center justify-center w-12 h-12 border-2 rounded-full relative z-10 cursor-pointer p-2 ${
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
                className={`h-2 flex-1 ${
                  visited.includes(path[index].link) &&
                  visited.includes(path[index + 1].link)
                    ? "bg-green-500"
                    : "bg-gray-300"
                } ${activeLink === index ? "border-2 border-green-400" : ""}`}
                style={{ margin: "0 0.5rem" }}
                onMouseEnter={() => handleMouseEnterLink(index)}
                onMouseLeave={handleMouseLeaveLink}
                onClick={() => handleClickLink(index)}
              ></div>
            )}
          </React.Fragment>
        ))) : null}
        {!isDirected ? (freePath.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center justify-center w-12 h-12 border-2 rounded-full relative z-10 cursor-pointer p-2 ${
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
            {index < path.length - 1 && (
              <div
                className={`h-2 flex-1 ${
                  visited.includes(path[index].link) &&
                  visited.includes(path[index + 1].link)
                    ? "bg-green-500"
                    : "bg-gray-300"
                } ${activeLink === index ? "border-2 border-green-400" : ""}`}
                style={{ margin: "0 0.5rem" }}
                onMouseEnter={() => handleMouseEnterLink(index)}
                onMouseLeave={handleMouseLeaveLink}
                onClick={() => handleClickLink(index)}
              ></div>
            )}
          </React.Fragment>
        ))) : null}
      </div>

      {(hoveredNode !== null ||
        activeNode !== null ||
        hoveredLink !== null ||
        activeLink !== null) && (
        <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
          {(activeNode !== null || hoveredNode !== null) && (
            <div className={`mt-4 p-2 border bg-white rounded shadow-lg m-2 ${activeNode !== null ? "bg-yellow-400" : "bg-red-400"}`}>
              <h3 className="font-bold">
                Node History for {path[activeNode ?? hoveredNode]?.title}
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
                Edge History for Link between {path[hoveredLink]?.title} and{" "}
                {path[hoveredLink + 1]?.title}
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