import GameTracker from "../components/GameTracker.jsx";
import PathProgress from "../components/PathProgress.jsx";

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils.js";

function Singleplayer() {
  const [track, setTrack] = useState("time");
  const [countDown, setCountDown] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [pause, setPause] = useState(true); // TODO: this is also a restriction/customization that must be incorporated into the customizations
  const [gameEnded, setGameEnded] = useState(false);
  const navigate = useNavigate();

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(
        [
          utils.SINGLEPLAYER_CUSTOMIZATIONS,
          utils.SINGLEPLAYER_GAME_WIN,
          utils.SINGLEPLAYER_GAME_INFORMATION,
          utils.EXTERNAL_WIKI_VISIT,
          utils.END_GAME_INFO,
          utils.SINGLEPLAYER_TIME_FINISHED,
        ],
        (results) => {
          const storedCustomizations =
            results[utils.SINGLEPLAYER_CUSTOMIZATIONS];
          const storedWin = results[utils.SINGLEPLAYER_GAME_WIN] || false;
          const storedGameInformation =
            results[utils.SINGLEPLAYER_GAME_INFORMATION];
          const storedExternalWikiVisit =
            results[utils.EXTERNAL_WIKI_VISIT] || false;
          const storedSingleplayerGameQuit =
            results[utils.SINGLEPLAYER_GAME_QUIT] || false;
          const storedSingleplayerTimeFinished =
            results[utils.SINGLEPLAYER_TIME_FINISHED] || false;
          const endGameInfo = results[utils.END_GAME_INFO]?.ended || false;

          if (endGameInfo) {
            setGameEnded(true);
          }

          if (endGameInfo.ended || gameEnded) {
            if (
              storedExternalWikiVisit ||
              storedWin ||
              storedSingleplayerGameQuit ||
              storedSingleplayerTimeFinished
            ) {
              navigate("/singleplayer-end");
            }
          }

          if (storedCustomizations) {
            setTrack(storedCustomizations.track[0]);
            if (storedCustomizations.mode.type === "count-down") {
              setCountDown(storedCustomizations.mode["count-down"].timer);
            }
          }

          if (storedGameInformation) {
            setPaused(storedGameInformation.status.paused);
          }
        }
      );

      const handleGameEndFlagChanges = (changes, areaName) => {
        if (areaName === "local") {
          const externalWikiVisit =
            changes[utils.EXTERNAL_WIKI_VISIT]?.newValue || false;
          const singleplayerTimeFinished =
            changes[utils.SINGLEPLAYER_TIME_FINISHED]?.newValue || false;
          const singleplayerGameWin =
            changes[utils.SINGLEPLAYER_GAME_WIN]?.newValue || false;
          const endGameInfo =
            changes[utils.END_GAME_INFO]?.newValue?.ended || false;
          const singleplayerQuit =
            changes[utils.SINGLEPLAYER_GAME_QUIT]?.newValue || false;

          if (endGameInfo) {
            setGameEnded(true);
          }

          if (
            (gameEnded || endGameInfo) &&
            (externalWikiVisit ||
              singleplayerTimeFinished ||
              singleplayerGameWin ||
              singleplayerQuit)
          ) {
            navigate("/singleplayer-end");
          }
        }
      };

      chrome.storage.onChanged.addListener(handleGameEndFlagChanges);

      return () => {
        chrome.storage.onChanged.removeListener(handleGameEndFlagChanges);
      };
    }
  }, [isChromeExtension, navigate, gameEnded]);

  const handleQuit = () => {
    if (isChromeExtension) {
      chrome.runtime.sendMessage({ action: utils.QUIT_SINGLEPLAYER });
    }
  };

  const handleTogglePause = () => {
    if (isChromeExtension) {
      if (paused) {
        chrome.runtime.sendMessage({ action: utils.UNPAUSE_SINGLEPLAYER });
      } else {
        chrome.runtime.sendMessage({ action: utils.PAUSE_SINGLEPLAYER });
      }
      setPaused(!paused);
    }
  };

  const kill = () => {
    navigate("/singleplayer-end");
  };

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-xl font-medium text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>
        <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
          Tracking
        </p>
        <GameTracker track={track} countDown={countDown} />
        <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
          Progress
        </p>
        <PathProgress />
      </div>
      <div className="flex items-center justify-center ">
        <button
          className="w-[25%] bg-red-800 p-2 border-2 border-gray-200 rounded-md text-white mr-2 font-custom"
          onClick={handleQuit}
        >
          Quit
        </button>

        {pause ? (
          <button
            className={`w-[25%] p-2 border-2 border-gray-200 rounded-md text-white font-custom ${
              paused ? "bg-green-500" : "bg-gray-500"
            }`}
            onClick={handleTogglePause}
          >
            {paused ? "Unpause" : "Pause"}
          </button>
        ) : null}

        <button onClick={kill}>kill</button>
      </div>
    </div>
  );
}

export default Singleplayer;
