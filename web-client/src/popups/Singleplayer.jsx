import PathProgress from "../components/PathProgress";
import GameTracker from "../components/GameTracker"
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Singleplayer() {
  // const isChromeExtension = useMemo(
  //   () =>
  //     typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
  //   []
  // );
  const navigate = useNavigate();
  // const [customizations, setCustomizations] = useState({});
  // const [mode, setMode] = useState("");
  // const [startArticle, setStartArticle] = useState({});
  // const [endArticle, setEndArticle] = useState({});
  // const [pathLength, setPathLength] = useState(0);
  // const [isPathDirected, setIsPathDirected] = useState(true);
  // const [pathArticles, setPathArticles] = useState([]);
  // const [timer, setTimer] = useState(0);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (isChromeExtension) {
  //     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //       if (message.action === "customizations") {
  //         const sentCustomizations = message.data;
  //         console.log("Received customizations:", sentCustomizations);
  //         setCustomizations(sentCustomizations);
  //         setMode(sentCustomizations.mode.type);
  //         setStartArticle(sentCustomizations.start);
  //         setEndArticle(sentCustomizations.end);
  //         setPathLength(sentCustomizations.mode.path.pathLength);
  //         setIsPathDirected(sentCustomizations.mode.path.directed);
  //         setPathArticles(sentCustomizations.mode.path.intermediate_links);
  //         setTimer(sentCustomizations.mode.countDown.timer);
  //         setLoading(false); // Data is ready
  //       }
  //     });
  //   } else {
  //     const sentCustomizations = JSON.parse(
  //       localStorage.getItem("singleplayer-customizations")
  //     );
  //     console.log("Loaded customizations from localStorage:", sentCustomizations);
  //     setCustomizations(sentCustomizations);
  //     setMode(sentCustomizations.mode.type);
  //     setStartArticle(sentCustomizations.start);
  //     setEndArticle(sentCustomizations.end);
  //     setPathLength(sentCustomizations.mode.path.pathLength);
  //     setIsPathDirected(sentCustomizations.mode.path.directed);
  //     setPathArticles(sentCustomizations.mode.path.intermediate_links);
  //     setTimer(sentCustomizations.mode.countDown.timer);
  //     setLoading(false); // Data is ready
  //   }
  // }, [isChromeExtension]);


  return (
    <div>
      <button onClick={() => navigate(-1)}>quit</button>
      <GameTracker track={"clicks"}/>
      <PathProgress />
    </div>
  );
}

export default Singleplayer;
