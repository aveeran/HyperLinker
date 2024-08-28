import GameTracker from "../components/GameTracker.jsx";
import PathProgress from "../components/PathProgress.jsx";

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils.js";

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
      chrome.storage.local.get([utils.SINGLEPLAYER_CUSTOMIZATIONS, 
        utils.SINGLEPLAYER_GAME_WIN, utils.SINGLEPLAYER_GAME_INFORMATION], (results) => {
        const storedCustomizations = results[utils.SINGLEPLAYER_CUSTOMIZATIONS];
        const storedWin = results[utils.SINGLEPLAYER_GAME_WIN];
        const storedGameInformation = results[utils.SINGLEPLAYER_GAME_INFORMATION];

        if(storedCustomizations) {
          setTrack(storedCustomizations.track[0])
          if(storedCustomizations.mode.type === "count-down") {
            setCountDown(storedCustomizations.mode["count-down"].timer)
          }
        }

        if(storedGameInformation) {
          setPaused(storedGameInformation.status.paused);
        }

        if(storedWin) {
          navigate('/singleplayer-end')
        }

      });
    }
  }, [isChromeExtension, navigate]);

  useEffect(() => {
    if(isChromeExtension) {
      const handleWinChanges = (changes, areaName) => {
        if(areaName === "local" && changes[utils.SINGLEPLAYER_GAME_WIN]) {
          const win = changes[utils.SINGLEPLAYER_GAME_WIN].newValue;
          if(win) {
            console.log("win received");
            navigate('/singleplayer-end')
          }
        }
      }

      chrome.storage.onChanged.addListener(handleWinChanges);

      return () => {
        chrome.storage.onChanged.removeListener(handleWinChanges);
      }
    }
  }, [isChromeExtension, navigate])

  const handleQuit = () => {
    if(isChromeExtension) {
      chrome.runtime.sendMessage({ action: utils.QUIT_SINGLEPLAYER})
    }
    navigate(-1);
  }

  const handleTogglePause = () => {
    if(paused) {
      console.log("sending unpaused");
      chrome.runtime.sendMessage({ action : utils.UNPAUSE_SINGLEPLAYER});
    } else {
      console.log("sending paused");
      chrome.runtime.sendMessage({ action: utils.PAUSE_SINGLEPLAYER});
    }
    setPaused(!paused);
  }


  return (
    <div className="p-2">
      <GameTracker track={track} countDown={countDown} />
      <PathProgress />
      <div className="flex items-center justify-center border-2 rounded-md p-2">
        <button
          className="w-[25%] bg-red-800 p-2 border-2 border-gray-200 rounded-md text-white mr-2"
          onClick={handleQuit}

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