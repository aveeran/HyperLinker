import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClientGameInterface,
  defaultClientGame,
  defaultCustomizations,
  GAME,
  GAME_MODE,
  GameInterface,
  ClientStatusInterface,
  MODE_COUNT_DOWN,
  MULTI_PLAYER,
  PLAYER,
  SINGLE_PLAYER,
  UPDATED_GAME_CLIENT,
  UPDATED_VIEWING_PLAYER,
  VIEWING_PLAYER,
  GameStatusInterface,
  defaultGameStatus,
  CustomizationInterface,
  MODE_NORMAL,
  Article,
  MODE_PATH,
  UNPAUSE,
  PAUSE,
  UPDATED_GAME_STATUS,
  FINISH_SINGLEPLAYER_GAME,
  QUIT_SINGLEPLAYER,
  END_CAUSE,
  PLAYER_SELECTOR,
  TRACKING_INFORMATION,
  PATH_PROGRESS,
  defaultGame,
  GAME_WIDGET_MAXIMIZED
} from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import GameTracker from "../../components/GameTracker";
import PathProgress from "../../components/PathProgress";



function Game() {
  const tempMode = MULTI_PLAYER;
  const navigate = useNavigate();

  const [maximizedWidget, setMaximizedWidget] = useState<string[]>([TRACKING_INFORMATION, PATH_PROGRESS]);
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
  const [currentPlayer, setCurrentPlayer] = useState<string>("Frank");
  const [gameStatus, setGameStatus] = useState<GameStatusInterface>(defaultGameStatus);
  const [gameClientsInformation, setGameClientsInformation] = useState<ClientGameInterface>(defaultClientGame);
  const [path, setPath] = useState<Article[]>([]);
  const [tracking, setTracking] = useState<string>(defaultCustomizations.track[0]);
  const [countDown, setCountDown] = useState<number>(-1);
  const [pausable, setPausable] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [pathCustomizations, setPathCustomizations] = useState<{
    type: string;
    directed: boolean;
  }>({ type: MODE_NORMAL, directed: true });

  const currentPlayerRef = useRef<string>(currentPlayer);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(typeof chrome !== "undefined" && chrome.storage && chrome.storage.local);
  }, []);

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([GAME, VIEWING_PLAYER, GAME_MODE, END_CAUSE, GAME_WIDGET_MAXIMIZED], (result) => {

        if (result[END_CAUSE] != null) {
          chrome.storage.local.set({[GAME_WIDGET_MAXIMIZED] : []}, () => {
            navigate("/gameEnd");
          });
        }

        const gameRes: GameInterface = result[GAME];
        setGameStatus(gameRes.gameStatus);
        setPlayerIDs(gameRes.participants);
        const viewingPlayer: string = result[VIEWING_PLAYER];
        const gameInformation: ClientGameInterface = gameRes.gameClients[viewingPlayer];
        const gameTracking: string = gameRes.customizations.track[0];
        const mode = gameRes.customizations.mode.type;
        if (mode === MODE_COUNT_DOWN) {
          setCountDown(gameRes.customizations.mode.count_down?.timer ?? 0);
        }
        setPausable(gameRes.gameStatus.paused != null);
        setPaused(gameRes.gameStatus.paused ?? false);
        setPath(gameRes.path);
        let pathInfo = { type: gameRes.customizations.mode.type, directed: true };
        if (gameRes.customizations.mode.type === MODE_PATH) {
          if (!gameRes.customizations.mode.path?.directed) {
            pathInfo.directed = false;
          }
        }
        setPathCustomizations(pathInfo);
        setCurrentPlayer(viewingPlayer);
        setGameClientsInformation(gameInformation);
        setTracking(gameTracking);

        const storedMaximizedWidgets : string[] = result[GAME_WIDGET_MAXIMIZED] || [];
        setMaximizedWidget(storedMaximizedWidgets);
      });

      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === UPDATED_GAME_CLIENT) {
          if (message.clientID === currentPlayerRef.current) {
            const updatedGameInformation = message.gameClient;
            setGameClientsInformation(updatedGameInformation);
          }
        } else if (message.type === UPDATED_GAME_STATUS) {
          setGameStatus(message.gameStatus);
        }
      });

      const handleDataChanged = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        const storedEndCause = changes[END_CAUSE];
        if (storedEndCause && storedEndCause.newValue != null) {
          chrome.storage.local.set({[GAME_WIDGET_MAXIMIZED] : []}, () => {
            navigate("/gameEnd");
          });
        }
      };

      chrome.storage.local.onChanged.addListener(handleDataChanged);
      return () => {
        chrome.storage.local.onChanged.removeListener(handleDataChanged);
      };
    } else {
        const gameRes: GameInterface = defaultGame;
        setGameStatus(gameRes.gameStatus);
        setPlayerIDs(gameRes.participants);
        const viewingPlayer: string = SINGLE_PLAYER;
        const gameInformation: ClientGameInterface = gameRes.gameClients[viewingPlayer];
        const gameTracking: string = gameRes.customizations.track[0];
        const mode = gameRes.customizations.mode.type;
        if (mode === MODE_COUNT_DOWN) {
          setCountDown(gameRes.customizations.mode.count_down?.timer ?? 0);
        }
        setPausable(gameRes.gameStatus.paused != null);
        setPaused(gameRes.gameStatus.paused ?? false);
        setPath(gameRes.path);
        let pathInfo = { type: gameRes.customizations.mode.type, directed: true };
        if (gameRes.customizations.mode.type === MODE_PATH) {
          if (!gameRes.customizations.mode.path?.directed) {
            pathInfo.directed = false;
          }
        }
        setPathCustomizations(pathInfo);
        setCurrentPlayer(viewingPlayer);
        setGameClientsInformation(gameInformation);
        setTracking(gameTracking);
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
  };

  const handleQuit = () => {
    chrome.runtime.sendMessage({
      type: FINISH_SINGLEPLAYER_GAME,
      cause: QUIT_SINGLEPLAYER,
    });
  };

  const handleTogglePause = () => {
    if (isChromeExtension) {
      if (paused) {
        chrome.runtime.sendMessage({ type: UNPAUSE }, () => {
          setPaused(false);
        });
      } else {
        chrome.runtime.sendMessage({ type: PAUSE }, () => {
          setPaused(true);
        });
      }
    }
  };

  const handleMaximize = (widget: string) => {
    // Compute the new value for maximizedWidget outside of setState
    let newMaximizedWidget;
  
    if (maximizedWidget.includes(widget)) {
      newMaximizedWidget = maximizedWidget.filter((item) => item !== widget);
    } else if (maximizedWidget.length < 2) {
      newMaximizedWidget = [...maximizedWidget, widget];
    } else {
      newMaximizedWidget = [...maximizedWidget.slice(1), widget];
    }

    chrome.storage.local.set({ [GAME_WIDGET_MAXIMIZED] : newMaximizedWidget}, () => {
      setMaximizedWidget(newMaximizedWidget);
    });
  };

  // TODO: remove when just singleplayer
  function renderPlayerSelector() {
    return (
      <div className="mb-1">
        <div className={`flex items-center justify-between ${maximizedWidget.includes(PLAYER_SELECTOR) ?
          "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200"}`}>

          <p className="text-base font-medium text-center flex-grow p-1 mb-1">PLAYER SELECTOR</p>

          <button
           className="pb-1 h-5 relative right-2 flex items-center justify-center"
            onClick={() => handleMaximize(PLAYER_SELECTOR)}>
            {maximizedWidget.includes(PLAYER_SELECTOR) ? "▲" : "▼"}
          </button>
        </div>

        {
          maximizedWidget.includes(PLAYER_SELECTOR) ? (
            <PlayerSelector onDataChange={updateCurrentPlayer} playerIDs={playerIDs} currentPlayer={currentPlayer} />
          ) : null
        }
      </div>
    )
  }

  function renderTrackingInformation() {
    return (
      <div className="mb-1">
        <div className={`flex items-center justify-between ${maximizedWidget.includes(TRACKING_INFORMATION) ?
          "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200"} mb-1`}>
          <p className="text-base font-medium text-center flex-grow p-1">TRACKING INFORMATION</p>
          <button 
          className="pb-1 h-5 relative right-2 flex items-center justify-center" 
          onClick={() => handleMaximize(TRACKING_INFORMATION)}>
            {maximizedWidget.includes(TRACKING_INFORMATION) ? "▲" : "▼"}
          </button>
        </div>
        {maximizedWidget.includes(TRACKING_INFORMATION) ? (
          <GameTracker
            gameClientInformation={gameClientsInformation}
            gameStatus={gameStatus}
            tracking={tracking}
            countDown={countDown}
          />
        ) : null}
      </div>
    )
  }

  function renderPathProgress() {
    return (
      <div className="">
        <div className={`flex items-center justify-between ${maximizedWidget.includes(PATH_PROGRESS) ?
          "bg-blue-500 border-green-400 border-2 border-solid text-white" : "bg-slate-200"} mb-1`}>
          <p className="text-base font-medium text-center flex-grow p-1">PATH PROGRESS</p>
          <button 
          className="pb-1 h-5 relative right-2 flex items-center justify-center align-middle" 
          onClick={() => handleMaximize(PATH_PROGRESS)}>
            {maximizedWidget.includes(PATH_PROGRESS) ? "▲" : "▼"}
          </button>
        </div>
        {
          maximizedWidget.includes(PATH_PROGRESS) ?
            (<PathProgress
              gameClientInformation={gameClientsInformation}
              pathCustomizations={pathCustomizations}
              gameStatus={gameStatus}
              path={path}
            />) : null
        }
      </div>
    )
  }

  function renderUtilityButtons() {
    return (
      <div className="flex items-center justify-center">
        {pausable && (
          <button
            className={`w-[25%] p-2 border-2 border-gray-200 rounded-md text-white font-custom ${paused ? "bg-green-500" : "bg-gray-500"
              }`}
            onClick={handleTogglePause}
          >
            {paused ? "Unpause" : "Pause"}
          </button>
        )}
        <button
          className="w-[25%] bg-red-800 p-2 border-2 border-gray-200 rounded-md text-white mr-2 font-custom"
          onClick={handleQuit}
        >
          Quit
        </button>
        <button onClick={() => navigate("/")}>Return</button>
      </div>

    )
  }


  return (
    <div className="">
      <p className="text-xl text-center mb-1 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-1 bg-slate-100">
        {tempMode === MULTI_PLAYER && renderPlayerSelector()}
        {renderTrackingInformation()}
        {renderPathProgress()}
      </div>
      {renderUtilityButtons()}
    </div>
  );
}

export default Game;
