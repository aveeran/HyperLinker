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
  PATH_PROGRESS
} from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import GameTracker from "../../components/GameTracker";
import PathProgress from "../../components/PathProgress";



function Game() {
  const tempMode = MULTI_PLAYER;
  const navigate = useNavigate();

  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
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
  const [gameStatus, setGameStatus] = useState<GameStatusInterface>(
    defaultGameStatus
  );
  const [gameClientsInformation, setGameClientsInformation] = useState<ClientGameInterface>(
    defaultClientGame
  );
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
      chrome.storage.local.get([GAME, VIEWING_PLAYER, GAME_MODE, END_CAUSE], (result) => {
        if (result[END_CAUSE] != null) {
          navigate("/gameEnd");
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
          navigate("/gameEnd");
        }
      };

      chrome.storage.local.onChanged.addListener(handleDataChanged);
      return () => {
        chrome.storage.local.onChanged.removeListener(handleDataChanged);
      };
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
    setMaximizedWidget((prev) => (prev === widget ? null : widget));
  };

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-xl font-medium text-center bg-sky-200 p-1 mb-1">{tempMode}</p>

        <div>

          <div className={`flex items-center justify-between ${maximizedWidget === PLAYER_SELECTOR ?
            "bg-yellow-200" : "bg-slate-200"}`}>

            <p className="text-xl font-medium text-center flex-grow">PLAYER SELECTOR</p>

            <button className="pb-1 h-5 relative right-2 border-2 border-slate-300 rounded flex items-center justify-center" onClick={() => handleMaximize(PLAYER_SELECTOR)}>
              {maximizedWidget === PLAYER_SELECTOR ? "-" : "+"}
            </button>
          </div>

          {
            maximizedWidget === PLAYER_SELECTOR ? (
              <PlayerSelector onDataChange={updateCurrentPlayer} playerIDs={playerIDs} currentPlayer={currentPlayer} />
            ) : null
          }
        </div>

        <div>
          <div className={`flex items-center justify-between ${maximizedWidget === TRACKING_INFORMATION ?
            "bg-yellow-200" : "bg-slate-200"}`}>
            <p className="text-xl font-medium text-center flex-grow">TRACKING INFORMATION</p>
            <button className="pb-1 h-5 relative right-2 border-2 border-slate-300 rounded flex items-center justify-center" onClick={() => handleMaximize(TRACKING_INFORMATION)}>
              {maximizedWidget === TRACKING_INFORMATION ? "-" : "+"}
            </button>
          </div>
          {maximizedWidget === TRACKING_INFORMATION ? (
            <GameTracker
              gameClientInformation={gameClientsInformation}
              gameStatus={gameStatus}
              tracking={tracking}
              countDown={countDown}
            />
          ) : null}
        </div>

        <div>
          <div className={`flex items-center justify-between ${maximizedWidget === PATH_PROGRESS ?
            "bg-yellow-200" : "bg-slate-200"}`}>
            <p className="text-xl font-medium text-center flex-grow">PATH PROGRESS</p>
            <button className="pb-1 h-5 relative right-2 border-2 border-slate-300 rounded flex items-center justify-center align-middle" onClick={() => handleMaximize(PATH_PROGRESS)}>
              {maximizedWidget === PATH_PROGRESS ? "-" : "+"}
            </button>
          </div>
          {
            maximizedWidget === PATH_PROGRESS ?
              (<PathProgress
                gameClientInformation={gameClientsInformation}
                pathCustomizations={pathCustomizations}
                gameStatus={gameStatus}
                path={path}
              />) : null
          }
        </div>
      </div>

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
    </div>
  );
}

export default Game;
