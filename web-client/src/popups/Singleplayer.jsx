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
        utils.SINGLEPLAYER_GAME_WIN, utils.SINGLEPLAYER_GAME_INFORMATION, utils.EXTERNAL_WIKI_VISIT], (results) => {
        const storedCustomizations = results[utils.SINGLEPLAYER_CUSTOMIZATIONS];
        const storedWin = results[utils.SINGLEPLAYER_GAME_WIN];
        const storedGameInformation = results[utils.SINGLEPLAYER_GAME_INFORMATION];
        const storedExternalWikiVisit = results[utils.EXTERNAL_WIKI_VISIT];

        if(storedExternalWikiVisit !== null && storedExternalWikiVisit !== undefined) {
          if(storedExternalWikiVisit === true) {
            navigate('/singleplayer-end');
          }
        }

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
      const handleGameEndFlagChanges = (changes, areaName) => {
        if(areaName === "local") {
          const externalWikiVisit = changes[utils.EXTERNAL_WIKI_VISIT]?.newValue || false;
          const singleplayerTimeFinished = changes[utils.SINGLEPLAYER_TIME_FINISHED]?.newValue || false;
          const singleplayerGameWin = changes[utils.SINGLEPLAYER_GAME_WIN]?.newValue || false;

          if(externalWikiVisit || singleplayerTimeFinished || singleplayerGameWin) {
            console.log(`${externalWikiVisit} ${singleplayerTimeFinished} ${singleplayerGameWin}`)
            navigate('/singleplayer-end');
          }
        }
      }

      chrome.storage.onChanged.addListener(handleGameEndFlagChanges);

      return () => {
        chrome.storage.onChanged.removeListener(handleGameEndFlagChanges);
      }
    }
  }, [isChromeExtension, navigate])

  const handleQuit = () => {
    if(isChromeExtension) {
      console.log('sending quit');
      chrome.runtime.sendMessage({ action: utils.QUIT_SINGLEPLAYER})
      navigate('/singleplayer-end')
    }
  }

  const handleTogglePause = () => {
    if(paused) {
      chrome.runtime.sendMessage({ action : utils.UNPAUSE_SINGLEPLAYER});
    } else {
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