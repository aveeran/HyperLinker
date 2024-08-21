import PathProgress from "../components/PathProgress";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Singleplayer() {
  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState({});
  const [mode, setMode] = useState("");
  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({});
  const [pathLength, setPathLength] = useState(0);
  const [isPathDirected, setIsPathDirected] = useState(true);
  const [pathArticles, setPathArticles] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (isChromeExtension) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "customizations") {
          const sentCustomizations = message.data;
          setCustomizations(sentCustomizations);
          setMode(sentCustomizations.mode.type);
          setStartArticle(sentCustomizations.start);
          setEndArticle(sentCustomizations.end);
          setPathLength(sentCustomizations.mode.path.pathLength);
          setIsPathDirected(sentCustomizations.mode.path.directed);
          setPathArticles(sentCustomizations.mode.path.intermediate_links);
          setTimer(sentCustomizations.mode.countDown.timer);
        }
      });
    } else {
      const sentCustomizations = JSON.parse(
        localStorage.getItem("singleplayer-customizations")
      );
      setCustomizations(sentCustomizations);
      setMode(sentCustomizations.mode.type);
      setStartArticle(sentCustomizations.start);
      setEndArticle(sentCustomizations.end);
      setPathLength(sentCustomizations.mode.path.pathLength);
      setIsPathDirected(sentCustomizations.mode.path.directed);
      setPathArticles(sentCustomizations.mode.path.intermediate_links);
      setTimer(sentCustomizations.mode.countDown.timer);
    }
  }, [isChromeExtension]);
  return (
    <div>
      <button onClick={() => navigate(-1)}>quit</button>
      <PathProgress start={startArticle} end={endArticle} path={pathArticles} />
    </div>
  );
}

export default Singleplayer;
