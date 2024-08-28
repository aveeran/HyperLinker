import GameTracker from "../components/GameTracker.jsx";
import PathProgress from "../components/PathProgress.jsx";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Singleplayer() {
  const [track, setTrack] = useState("time");
  const [countDown, setCountDown] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [pause, setPause] = useState(true);
  const navigate = useNavigate();

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if(isChromeExtension) {
      chrome.storage.local.get("singleplayer-customizations", (results) => {
        const storedCustomizations = results["singleplayer-customizations"];
        if(storedCustomizations) {
          setTrack(storedCustomizations.track[0])

          if(storedCustomizations.mode.type === "count-down") {
            setCountDown(storedCustomizations.mode["count-down"].timer)
          }
        }
      })
    }
  }, [isChromeExtension])



  return (
    <div className="p-2">
      <GameTracker track={track} countDown={countDown} />
      <PathProgress />
      {/* <div className="flex items-center justify-center border-2 rounded-md p-2">
        <button
          className="w-[25%] bg-red-800 p-2 border-2 border-gray-200 rounded-md text-white mr-2"
          onClick={handleQuit()}
        >
          Quit
        </button>

        {pause ? (
          <button
            className={`w-[25%] p-2 border-2 border-gray-200 rounded-md text-white ${
              paused ? "bg-green-500" : "bg-gray-500"
            }`}
            onClick={handleTogglePause}
          >
            {paused ? "Unpause" : "Pause"}
          </button>
        ) : null}
      </div> */}
    </div>
  );
}

export default Singleplayer;