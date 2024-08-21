import React, { useState, useEffect } from "react";

//when and where should we render edge_history/node_history?
function PathProgress() {
  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({}); // DESIGN CHANGE: WE REMOVE START, END AND JUST USE PATH?
  const [pathArticles, setPathArticles] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [visited, setVisited] = useState([]);
  const [edgeHistory, setEdgeHistory] = useState([]);
  const [nodeHistory, setNodeHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);
  const [gameData, setGameData] = useState({});

  const isChromeExtension =
    typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(["singleplayer-customizations"], (result) => {
        const customizations = result["singleplayer-customizations"];
        setStartArticle(customizations.start || {});
        setEndArticle(customizations.end || {});
        setPathArticles(customizations.mode.path.intermediate_links || []);
      });

      chrome.storage.local.get(["gameData"], (result) => {
        const storedGameData = result["gameData"];
        setGameData(storedGameData);
        setEdgeHistory(storedGameData.edgeHistory);
        setNodeHistory(storedGameData.nodeHistory);
        setCurrentNode(storedGameData.currentNode);
      });
    
    
      function handleStorageChanges(changes, areaName) {
        if (areaName === "local" && changes["pageVisited"]) {
          console.log("page visit updated: ", changes["pageVisited"].newValue);
          let tempArr = [...nodeHistory];
          if(currentNode >=0) {
            let temp = tempArr[currentNode] || [];
            temp.push(changes["pageVisited"].newValue);
            tempArr[currentNode] = temp;
            setNodeHistory(tempArr);
            
            const updatedGameData = {
              ...gameData,
              nodeHistory: tempArr
            }
            setGameData(updatedGameData);
            console.log("updated: ", updatedGameData);
            chrome.storage.local.set({"gameData": updatedGameData}, () => {
              console.log("updated game data");
            })
          } 

        }

        if(areaName==="local" && changes["gameData"]) {
          const storedGameData = changes["gameData"].newValue;
          setGameData(storedGameData);
          setEdgeHistory(storedGameData.edgeHistory);
          setNodeHistory(storedGameData.nodeHistory);
          setCurrentNode(storedGameData.currentNode);
        }
      }

      chrome.storage.onChanged.addListener(handleStorageChanges);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChanges);
      };
    } else {
      const storedCustomizations = localStorage.getItem(
        "singleplayer-customizations"
      );
      const customizations = JSON.parse(storedCustomizations);
      console.log(customizations);
      setStartArticle(customizations.start || {});
      setEndArticle(customizations.end || {});
      setPathArticles(customizations.mode.path.intermediate_links || []);
    }
  }, [isChromeExtension]);



  // visited.push(startArticle); // MAINTAIN VISITED ELSEWHERE (PERSISTENT)
  const steps = [startArticle, ...pathArticles, endArticle];

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
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center justify-center w-12 h-12 border-2 rounded-full relative z-10 cursor-pointer p-2 ${
                visited.includes(step)
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
            {index < steps.length - 1 && (
              <div
                className={`h-2 flex-1 ${
                  visited.includes(steps[index]) &&
                  visited.includes(steps[index + 1])
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                style={{ margin: "0 0.5rem" }}
                onMouseEnter={() => handleMouseEnterLink(index)}
                onMouseLeave={handleMouseLeaveLink}
                onClick={() => handleClickLink(index)}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {(hoveredNode !== null ||
        activeNode !== null ||
        hoveredLink !== null ||
        activeLink !== null) && (
        <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
          {(activeNode !== null || hoveredNode !== null) && (
            <div className="mt-4 p-2 border border-red-300 bg-white rounded shadow-lg m-2">
              <h3 className="font-bold">
                Node History for {steps[activeNode ?? hoveredNode]?.title}
              </h3>
              <ul>
                {nodeHistory[activeNode ?? hoveredNode]?.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {
                    
                    entry
                    
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* {(activeLink !== null || hoveredLink !== null) && (
            <div className="mt-4 p-2 border border-green-300 bg-white rounded shadow-lg m-2">
              <h3 className="font-bold">
                Edge History for Link between {steps[hoveredLink]?.title} and{" "}
                {steps[hoveredLink + 1]?.title}
              </h3>
              <ul>
                {edgeHistory[activeLink ?? hoveredLink]?.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {entry.join(" → ")}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default PathProgress;
