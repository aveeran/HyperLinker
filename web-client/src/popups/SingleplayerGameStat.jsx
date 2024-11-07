import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import * as utils from "@utils/utils"
import PathProgress from '../components/PathProgress.jsx';

function SingleplayerGameStat() {
  const [externalWikiVisit, setExternalWikiVisit] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  const [timeFinished, setTimeFinished] = useState(false);
  const [gameQuit, setGameQuit] = useState(false);
  const [endInfo, setEndInfo] = useState(utils.defaultEndGameInfo);

  //TODO: idea, if win then maybe we can import the confetti here

  const navigate = useNavigate();
  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if(isChromeExtension) {
      chrome.storage.local.get([utils.EXTERNAL_WIKI_VISIT, utils.SINGLEPLAYER_TIME_FINISHED,
        utils.SINGLEPLAYER_GAME_WIN, utils.SINGLEPLAYER_GAME_QUIT, utils.END_GAME_INFO
      ], (result) => {

        const storedExternalWikiVisit = result[utils.EXTERNAL_WIKI_VISIT];
        const storedGameWin = result[utils.SINGLEPLAYER_GAME_WIN];
        const storedTimeFinished = result[utils.SINGLEPLAYER_TIME_FINISHED];
        const storedGameQuit = result[utils.SINGLEPLAYER_GAME_QUIT];
        const storedEndGameInfo = result[utils.END_GAME_INFO];

        console.log(storedExternalWikiVisit, storedGameWin, storedTimeFinished, storedGameQuit, storedEndGameInfo);  

        if(storedExternalWikiVisit !== null && storedExternalWikiVisit !== undefined) {
          setExternalWikiVisit(storedExternalWikiVisit);
        }
  
        if(storedGameWin !== null && storedGameWin !== undefined) {
          setGameWin(storedGameWin);
        }
  
        if (storedTimeFinished !== null && storedTimeFinished !== undefined) {
          setTimeFinished(storedTimeFinished);
        }
  
        if (storedGameQuit !== null && storedGameQuit !== undefined) {
          setGameQuit(storedGameQuit);
        }
  
        if(storedEndGameInfo !== null && storedEndGameInfo !== undefined) {
          setEndInfo(storedEndGameInfo);
        }
      });

      const handleEndGameChanges = (changes, areaName) => {
        if(areaName === "local") {
          const storedExternalWikiVisit = changes[utils.EXTERNAL_WIKI_VISIT]?.newValue || undefined;
          const storedGameWin = changes[utils.SINGLEPLAYER_GAME_WIN]?.newValue || undefined;
          const storedTimeFinished = changes[utils.SINGLEPLAYER_TIME_FINISHED]?.newValue || undefined;
          const storedGameQuit = changes[utils.SINGLEPLAYER_GAME_QUIT]?.newValue || undefined;
          const storedEndGameInfo = changes[utils.END_GAME_INFO]?.newValue || undefined;

          console.log(storedExternalWikiVisit, storedGameWin, storedTimeFinished, storedGameQuit);
          console.log(storedEndGameInfo);

          if(storedExternalWikiVisit !== undefined) setExternalWikiVisit(storedExternalWikiVisit);
          if(storedGameWin !== undefined) setGameWin(storedGameWin);
          if(storedTimeFinished !== undefined) setTimeFinished(storedTimeFinished);
          if(storedGameQuit !== undefined) setGameQuit(storedGameQuit);
          if(storedEndGameInfo !== undefined) {
            setEndInfo(storedEndGameInfo);
            console.log('setting!: ', storedEndGameInfo);
          }
        }
      }

      chrome.storage.onChanged.addListener(handleEndGameChanges);
      
      return () => {
        chrome.storage.onChanged.removeListener(handleEndGameChanges);
      }
    } else {
      setExternalWikiVisit(false);
      setGameWin(true);
      setTimeFinished(false);
      setGameQuit(false);
      setEndInfo(utils.defaultEndGameInfo);

    }
  }, [isChromeExtension])

  const reset = () => {
    if(isChromeExtension) {
      chrome.runtime.sendMessage({action: utils.SINGLEPLAYER_CLEAR_END})
    }
    navigate('/')
  }

  const winElement = gameWin ? <div className="bg-purple-200">Game Win</div> : null;
  const quitElement = gameQuit ? <div className="bg-red-400">Game Quit</div> : null;
  const wikiVisitElement = externalWikiVisit ? <div className="bg-red-400">External Wiki Visit</div> : null;
  const timeFinishedElement = timeFinished ? <div className="bg-red-400">Time Finished</div> : null;

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="font-medium text-xl text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>

        <p className="text-center font-medium text-base p-1 mb-1 bg-slate-200">
          Game End
        </p>

        <p className="text-center font-medium text-base p-1 mb-1">
          {winElement}
          {quitElement}
          {wikiVisitElement}
          {timeFinishedElement}
        </p>

        <p className="text-center font-medium text-base p-1 mb-1 bg-slate-200">
          Game Customizations
        </p>

        <div className="max-h-36 overflow-y-auto">
          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Start Article</strong>
            <p className="col-span-2">{endInfo.singleplayerCustomizations.start.title}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">End Article</strong>
            <p className="col-span-2">{endInfo.singleplayerCustomizations.end.title}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Tracking</strong>
            <p className="col-span-2">{endInfo.singleplayerCustomizations.track[0]}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Restrictions</strong>
            <p className="col-span-2">{endInfo.singleplayerCustomizations.restrictions.join(" · ")}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Mode</strong>
            <p className="col-span-2">{endInfo.singleplayerCustomizations.mode.type}</p>
          </div>

          {
            endInfo.singleplayerCustomizations.mode.type === "path" ? (
              <>
                <div className="grid grid-cols-3 gap-4 p-1">
                  <strong className="text-base mr-1 col-span-1">
                    Path Length
                  </strong>
                  <p className="col-span-2">
                    {endInfo.singleplayerCustomizations.mode.path.pathLength}
                  </p>
                </div>  

                              <div className="grid grid-cols-3 gap-4 p-1">
                  <strong className="text-base mr-1 col-span-1 text-center">
                    Intermediate Articles
                  </strong>

                  <p className="col-span-2">
                    {endInfo.singleplayerCustomizations.mode.path.intermediate_links.join(", ")}
                  </p>
                </div> 

                <div className="grid grid-cols-3 gap-4 p-1">
                  <strong className="text-base mr-1 col-span-1">Directed</strong>
                  <p className="col-span-2">
                    {endInfo.singleplayerCustomizations.mode.path.directed ? "true" : "false"}
                  </p>
                </div>                      
              </>
            ) : null
          }

          {
            endInfo.singleplayerCustomizations.mode.type === "count-down" ? (
              <>
              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Timer</strong>
                <p className="col-span-2">
                  {endInfo.singleplayerCustomizations.mode["count-down"].timer}
                </p>
              
              </div>
              </>
            ) : null
          }
        </div>


        <p className="font-medium text-base text-center bg-slate-200 p-1 mb-1">
          Path Progress
        </p>
        <PathProgress/>
      </div>

      <div className="flex justify-center mb-3">
        <button onClick={reset} className="flex bg-red-400 text-white px-4 py-2 rounded mr-2 font-custom">
          Home
        </button>
      </div>

    </div>
  )
}

export default SingleplayerGameStat
