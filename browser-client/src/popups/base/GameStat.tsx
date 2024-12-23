import { useEffect, useMemo, useRef, useState } from "react";
import {
    Article,
    CLICK_COUNT,
    CustomizationInterface,
    defaultCustomizations,
    defaultGame,
    defaultGameStatus,
  END_CAUSE,
  EXTERNAL_WIKI_VISIT,
  GAME,
  GameInterface,
  GameStatusInterface,
  MODE_COUNT_DOWN,
  MODE_NORMAL,
  MODE_PATH,
  MULTI_PLAYER,
  QUIT_SINGLEPLAYER,
  SINGLEPLAYER_TIME_FINISHED,
  SINGLEPLAYER_WIN,
  TAB_ID,
  UPDATED_VIEWING_PLAYER,
  VIEWING_PLAYER,
  PLAYER_SELECTOR,
  TRACKING_INFORMATION,
  PATH_PROGRESS,
  CUSTOMIZATION_INFO,
  GAME_END_PLAYER_SELECTOR_MAXIMIZED,
  GAME_END_WIDGET_MAXIMIZED
} from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import PathProgress from "../../components/PathProgress";
import { useNavigate } from "react-router-dom";

function GameStat() {
  const tempMode = MULTI_PLAYER;
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
  const [maximizedPlayerSelector, setMaximizedPlayerSelector] = useState<boolean>(true);

  const [cause, setCause] = useState<string>();
  const [currentPlayer, setCurrentPlayer] = useState<string>("Frank");
  const [pathCustomizations, setPathCustomizations] = useState<{type: string, directed:boolean}>({type: MODE_NORMAL, directed:true});
  const [gameStatus, setGameStatus] = useState<GameStatusInterface>(defaultGameStatus);
  const [path, setPath] = useState<Article[]>([]);

  const navigate = useNavigate();
  const currentPlayerRef = useRef<string>(currentPlayer);

  const [playerIDs, setPlayerIDs] = useState<string[]>([
    "Bob",
    "Frank",
    "Jim",
    "Grace",
    "Pam",
    "Christine",
    "Ellis",
    "Crazy",
    "I was once",
  ]);
  const [gameInformation, setGameInformation] = useState<GameInterface>(defaultGame);
  const [gameCustomizations, setGameCustomizations] = useState<CustomizationInterface>(defaultCustomizations);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);


  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([GAME, VIEWING_PLAYER, END_CAUSE, GAME_END_PLAYER_SELECTOR_MAXIMIZED, GAME_END_WIDGET_MAXIMIZED], (result) => {
        setCause(result[END_CAUSE]);

        const gameRes: GameInterface = result[GAME];
        setGameInformation(gameRes);

        const storedCustomizations: CustomizationInterface = gameRes.customizations;
        setGameCustomizations(storedCustomizations);

        const storedPlayerIDs = gameRes.participants;
        setPlayerIDs(storedPlayerIDs);

        const storedGameStatus = gameRes.gameStatus;
        setGameStatus(storedGameStatus);

        const viewingPlayer: string = result[VIEWING_PLAYER];
        setCurrentPlayer(viewingPlayer);
        currentPlayerRef.current = viewingPlayer;
        setPath(gameRes.path);

        let pathInfo = {type: gameRes.customizations.mode.type, directed: true}
        if(gameRes.customizations.mode.type === MODE_PATH) {
          if(!gameRes.customizations.mode.path?.directed) { // TODO: make sure that when path is null, is true
            pathInfo.directed = false;
          }
        }
        setPathCustomizations(pathInfo);

        const storedMaximizedPlayerSelector : boolean = result[GAME_END_PLAYER_SELECTOR_MAXIMIZED] || false;
        setMaximizedPlayerSelector(storedMaximizedPlayerSelector);

        const storedMaximizedWidget : string = result[GAME_END_WIDGET_MAXIMIZED] || null;
        setMaximizedWidget(storedMaximizedWidget);

      });
    } else {
      setGameInformation(defaultGame);
      setGameCustomizations(defaultCustomizations);
      setPath(defaultGame.path);
    }
  }, [isChromeExtension]);

  const updateCurrentPlayer = (playerID: string) => {
    chrome.storage.local.set({ [VIEWING_PLAYER]: playerID }, () => {
      chrome.runtime.sendMessage({
        type: UPDATED_VIEWING_PLAYER,
        clientID: playerID,
      });
    });
    setCurrentPlayer(playerID);
    currentPlayerRef.current = playerID;
  };

  const renderCause = () => {
    let msg = "err"
    let color = "";
    switch(cause) {
      case SINGLEPLAYER_WIN:
        msg = "Singleplayer Win";
        color = "bg-green-400";
        break;
      case QUIT_SINGLEPLAYER:
        msg = "Singleplayer Quit";
        color = "bg-red-400";
        break;
      case EXTERNAL_WIKI_VISIT:
        msg = "External Wikipedia Visit";
        color = "bg-red-400";
        break;
      case SINGLEPLAYER_TIME_FINISHED:
        msg = "Countdown Finished";
        color = "bg-red-400";
    }
    return (
      <p className={`text-center font-medium text-base p-1 mb-1 ${color} `}>
        {msg}
      </p>
    )
  }

  const done = () => {
    // resetting the fields
    chrome.storage.local.set({
      [GAME]: defaultGame,
      [END_CAUSE]: null,
      [TAB_ID]: null,
      [CLICK_COUNT]: 0,
      [GAME_END_PLAYER_SELECTOR_MAXIMIZED] : false,
      [GAME_END_WIDGET_MAXIMIZED] : null
    }, () => {
      navigate('/dashboard');
    })
  }

  const handleMaximize = (widget: string) => {

    setMaximizedWidget((prev) => (prev === widget ? null : widget));
    let newMaximizedWidget;

    if(maximizedWidget === widget) {
      newMaximizedWidget = null;
    } else {
      newMaximizedWidget = widget;
    }

    chrome.storage.local.set({[GAME_END_WIDGET_MAXIMIZED] : newMaximizedWidget}, () => {
      setMaximizedWidget(newMaximizedWidget);
    })
  }

  const renderCustomizations = () => {
    return (
      <div className="mx-h-36 overflow-y-auto">
          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Start Article</strong>
            <p className="col-span-2">{gameCustomizations.start.title}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">End Article</strong>
            <p className="col-span-2">{gameCustomizations.end.title}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Tracking</strong>
            <p className="col-span-2">{gameCustomizations.track[0]}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Restrictions</strong>
            <p className="col-span-2">{gameCustomizations.restrictions.join(" · ")}</p>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Mode</strong>
            <p className="col-span-2">{gameCustomizations.mode.type}</p>
          </div>

          {
            gameCustomizations.mode.type === MODE_PATH ? (
              <>
              <div className="grid grid-cols-3 gap-4 p-1">
                  <strong className="text-base mr-1 col-span-1">
                    Path Length
                  </strong>
                  <p className="col-span-2">
                    {gameCustomizations.mode.path?.pathLength}
                  </p>
                </div>  


                  {
                    gameCustomizations.mode.path?.connections.length ?? 0 > 0 ? (
                      <div className="grid grid-cols-3 gap-4 p-1">
                        <strong className="text-base mr-1 col-span-1 text-center">
                          Connections
                        </strong>
                        <p className="col-span-2">
                          {gameCustomizations.mode.path?.connections.map((article) => article.title).join(", ")}
                        </p>
                      </div> 
                    ) : null
                  }

                <div className="grid grid-cols-3 gap-4 p-1">
                  <strong className="text-base mr-1 col-span-1">Directed</strong>
                  <p className="col-span-2">
                    {gameCustomizations.mode.path?.directed ? "true" : "false"}
                  </p>
                </div>                      
              </>
            ) : null
          }

          {
            gameCustomizations.mode.type === MODE_COUNT_DOWN ? (
              <>
              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Timer</strong>
                <p className="col-span-2">
                  {gameCustomizations.mode.count_down?.timer}
                </p>
              </div>
              </>
            ) : null
          }
        </div>
    )
  }

  function renderCustomizationWidget() {
    return (
      <div>
          <div className={`flex items-center justify-between ${maximizedWidget === CUSTOMIZATION_INFO ?
            "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200" 
          } mb-1`}>

            <p className="text-base font-medium text-center flex-grow p-1">GAME CUSTOMIZATIONS</p>
            <button className="pb-1 h-5 relative right-2 flex items-center justify-center" onClick={() => handleMaximize(CUSTOMIZATION_INFO)}>
              {maximizedWidget === CUSTOMIZATION_INFO ? "▲" : "▼"}
            </button>
          </div>
            {maximizedWidget === CUSTOMIZATION_INFO && renderCustomizations()}
        </div>
    )
  }

  function renderPlayerSelector() {
    return (
      <div>
          <div className={`flex items-center justify-between ${maximizedPlayerSelector ?
            "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200"} mb-1`}>

            <p className="text-base font-medium text-center flex-grow p-1">PLAYER SELECTOR</p>

            <button className="pb-1 h-5 relative right-2 flex items-center justify-center" onClick={() => {
              let newMaximizedPlayerSelector = !maximizedPlayerSelector;
              if(isChromeExtension) {
                chrome.storage.local.set({[GAME_END_PLAYER_SELECTOR_MAXIMIZED] : newMaximizedPlayerSelector})
                setMaximizedPlayerSelector(newMaximizedPlayerSelector);
              }
              }}>
              {maximizedPlayerSelector ? "▲" : "▼"}
            </button>
          </div>
          {
            maximizedPlayerSelector && (
              <PlayerSelector onDataChange={updateCurrentPlayer} playerIDs={playerIDs} currentPlayer={currentPlayer} />
            ) 
          }
        </div>
    )
  }

  function renderPathProgress() {
    return (
      <div>
      <div className={`flex items-center justify-between ${maximizedWidget === PATH_PROGRESS ?
        "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200"} mb-1`}>
        <p className="text-base font-medium text-center flex-grow p-1">PATH PROGRESS</p>
        <button className="pb-1 h-5 relative right-2 flex items-center justify-center align-middle" onClick={() => handleMaximize(PATH_PROGRESS)}>
          {maximizedWidget === PATH_PROGRESS ? "▲" : "▼"}
        </button>
      </div>
      {
        maximizedWidget === PATH_PROGRESS &&
          (<PathProgress
            gameClientInformation={gameInformation.gameClients[currentPlayerRef.current]}
            pathCustomizations={pathCustomizations}
            gameStatus={gameStatus}
            path={path}
          />) 
      }
    </div>
    )
  }

  function renderUtilityButtons() {
    return (
      <div className="flex justify-center">
        <button 
        className="bg-gray-500 p-2 border-2 border-gray-200 rounded-md text-white font-custom"
        onClick={done}
        >Continue</button>
      </div>
    )
  }

  return (
    <div className="">
      <p className="text-xl text-center mb-1 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-1 bg-slate-100">
        {renderCause()}

        {tempMode === MULTI_PLAYER && renderPlayerSelector()}

        {renderCustomizationWidget()}

        {renderPathProgress()}
        
      </div>

      {renderUtilityButtons()}
    </div>
  );
}

export default GameStat;
