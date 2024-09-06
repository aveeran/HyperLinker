import React, { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import * as utils from "@utils/utils"

function SingleplayerGameStat() {
  const [externalWikiVisit, setExternalWikiVisit] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  const [timeFinished, setTimeFinished] = useState(false);
  const [gameQuit, setGameQuit] = useState(false);

  const navigate = useNavigate();
  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  if(isChromeExtension) {
    chrome.storage.local.get([utils.EXTERNAL_WIKI_VISIT, utils, utils.SINGEPLAYER_TIME_FINISHED,
      utils.SINGLEPLAYER_GAME_WIN, utils.SINGLEPLAYER_GAME_QUIT, utils.END_GAME_INFO
    ], (result) => {
      const storedExternalWikiVisit = result[utils.EXTERNAL_WIKI_VISIT];
      const storedGameWin = result[utils.SINGLEPLAYER_GAME_WIN];
      const storedTimeFinished = result[utils.SINGLEPLAYER_TIME_FINISHED];
      const storedGameQuit = result[utils.SINGLEPLAYER_GAME_QUIT];

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

      // TODO: add stuff with end-game info here


    });
  }

  const reset = () => {
    chrome.runtime.sendMessage({action: utils.QUIT_SINGLEPLAYER})
    navigate('/')
  }

  return (
    <div>
      {externalWikiVisit ? 
      (<p>Lol</p>) : (<p>congrats</p>)}
      <button onClick={reset}>
        Home
      </button>
    </div>
  )
}

export default SingleplayerGameStat
