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

        //TODO: problem (not here, since we get end game info); but problem with receiving status coded
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
    }
  }, [isChromeExtension])

  useEffect(() => {
    if(isChromeExtension) {
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
    }
  }, [isChromeExtension])

  const reset = () => {
    chrome.runtime.sendMessage({action: utils.QUIT_SINGLEPLAYER})
    navigate('/')
  }

  const winElement = gameWin ? <div>Game Win</div> : null;
  const quitElement = gameQuit ? <div>Game Quit</div> : null;
  const wikiVisitElement = externalWikiVisit ? <div>External Wiki Visit</div> : null;
  const timeFinishedElement = timeFinished ? <div>Time Finished</div> : null;

  return (
    <div>
      <div className="border-black border-2 border-solid p-1.5 m-3 text-center"> 
        <p>
          {winElement}
          {quitElement}
          {wikiVisitElement}
          {timeFinishedElement}
        </p>
      </div>

      <div className="border-black border-2 border-solid p-1.5 m-3">
        <div>
          <h1 className="text-3xl text-center mb-3">Customizations</h1>
          <p className="mb-3"><b>Mode</b>: {endInfo.singleplayerCustomizations.mode.type}</p>
          <p className="mb-3"><b>Start</b>: {endInfo.singleplayerCustomizations.start.title}</p>
          <p className="mb-3"><b>End</b>: {endInfo.singleplayerCustomizations.end.title}</p>
          <p className="mb-3"><b>Restrictions</b>: {endInfo.singleplayerCustomizations.restrictions.join(', ')}</p>
          <p className="mb-3"><b>Tracking</b>: {endInfo.singleplayerCustomizations.track}</p>
        </div>
        <div>
          <PathProgress/>

        </div>
      </div>
      <div className="flex justify-center mb-3">
        <button onClick={reset} className="flex bg-red-400 text-white px-4 py-2 rounded mr-2">
          Home
        </button>
      </div>
    </div>
  )
}

export default SingleplayerGameStat
