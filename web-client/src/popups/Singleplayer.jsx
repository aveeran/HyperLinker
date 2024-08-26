import PathProgress from "../components/PathProgress";
import GameTracker from "../components/GameTracker";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Singleplayer() {
  const [track, setTrack] = useState("");
  const [countDown, setCountDown] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [pause, setPause] = useState(true);
  const navigate = useNavigate();

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  if (isChromeExtension) {
    chrome.storage.local.get(["singleplayer-game"], (result) => {
      const customizations =
        result["singleplayer-game"].singleplayerCustomizations;
      setTrack(customizations.track[0]);
      if (customizations.mode.type === "countDown") {
        setCountDown(customizations.mode.countDown.timer);
      }
    });
  }

  // maybe check if there is a pause butotn?

  const handleQuit = () => {
    if (isChromeExtension) {
      chrome.runtime.sendMessage({ action: "quit_singleplayer" });
    }

    // navigate(-1);
  };

  const handleTogglePause = () => {
    chrome.storage.local.get(["singleplayer-game"], (result) => {
      const storedGameData = result["singleplayer-game"];
      const updatedGameData = {
        ...storedGameData,
        playing: paused
      }
    })


    setPaused(!paused);
  };

  return (
    <div className="p-2">
      <GameTracker track={track} countDown={countDown} />
      <PathProgress />
      <div className="flex items-center justify-center border-2 rounded-md p-2">
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
      </div>
    </div>
  );
}

export default Singleplayer;
