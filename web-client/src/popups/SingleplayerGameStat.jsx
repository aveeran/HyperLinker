import React, { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import * as utils from "@utils/utils"

function SingleplayerGameStat() {
  const [externalWikiVisit, setExternalWikiVisit] = useState(false);
  const navigate = useNavigate();
  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  if(isChromeExtension) {
    chrome.storage.local.get([utils.EXTERNAL_WIKI_VISIT], (result) => {
      const storedExternalWikiVisit = result[utils.EXTERNAL_WIKI_VISIT];
      if(storedExternalWikiVisit !== null && storedExternalWikiVisit !== undefined) {
        setExternalWikiVisit(storedExternalWikiVisit);
      }
    })
  }

  const reset = () => {
    chrome.storage.local.set({ [utils.EXTERNAL_WIKI_VISIT] : false});
    chrome.storage.local.set({ [utils.SINGLEPLAYER_GAME_PROPERTEIS] : utils.defaultSingleplayerGameProperties});
    chrome.storage.local.set({ [utils.SINGLEPLAYER_GAME_INFORMATION] : utils.defaultSingleplayerGameInformation });
    chrome.storage.local.set({ [utils.SINGLEPLAYER_GAME_WIN] : false});

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
