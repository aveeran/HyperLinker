import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClientGameInterface,
  defaultClientGame,
  defaultCustomizations,
  GAME,
  GAME_MODE,
  GameInterface,
  Mode,
  GamePlayMode,
  InformationUpdated,
  VIEWING_PLAYER,
  GameStatusInterface,
  defaultGameStatus,
  Article,
  END_CAUSE,
  Widget,
  defaultGame,
  GAME_WIDGET_MAXIMIZED,
  SingleplayerEvents,
  MyKeys
} from "../../../utils/utils";

import { useChromeStorage } from "../../../hooks/useChromeStorage";
import { useMaximizedWidgets } from "../../../hooks/useMaximizeWidgetsResult";
import PlayerSelectorWidget from "../../../components/PlayerSelectorWidget";
import TrackingWidgetProps from "../../../components/TrackingWidget";
import PathProgressWidget from "../../../components/PathProgressWidget";
import GameUtilityButtons from "./GameUtilityButtons";

function Game() {
  const tempMode = GamePlayMode.MultiPlayer;
  const navigate = useNavigate();

  const [playerIDs, setPlayerIDs] = useState<string[]>([
    "Bob",
    "Frank",

  ]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("Frank");
  const [gameStatus, setGameStatus] = useState<GameStatusInterface>(defaultGameStatus);
  const [gameClientsInformation, setGameClientsInformation] = useState<ClientGameInterface>(defaultClientGame);
  const [path, setPath] = useState<Article[]>([]);
  const [tracking, setTracking] = useState<string>(defaultCustomizations.track[0]);
  const [countDown, setCountDown] = useState<number>(-1);
  const [pausable, setPausable] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(Mode.Normal);

  const [pathCustomizations, setPathCustomizations] = useState<{
    type: string;
    directed: boolean;
  }>({ type: GamePlayMode.SinglePlayer, directed: true });

  const currentPlayerRef = useRef<string>(currentPlayer);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(typeof chrome !== "undefined" && chrome.storage && chrome.storage.local);
  }, []);

  const { maximizedWidgets, toggleWidget, setMaximizedWidgets } 
  = useMaximizedWidgets([Widget.TrackingInformation, Widget.PathProgress], 2);

  function handleMaximize(widget: string) {
    const updated = toggleWidget(widget);
    if (isChromeExtension) {
      chrome.storage.local.set({ [GAME_WIDGET_MAXIMIZED]: updated });
    }
  }

  const keys = useMemo(() => [
    GAME,
    VIEWING_PLAYER,
    GAME_MODE,
    END_CAUSE,
    GAME_WIDGET_MAXIMIZED,
  ], []);

  const defaultValues = useMemo(() => ({
    [GAME]: defaultGame,
    [VIEWING_PLAYER]: GamePlayMode.SinglePlayer,
    [GAME_MODE]: GamePlayMode.SinglePlayer,
    [END_CAUSE]: null,
    [GAME_WIDGET_MAXIMIZED]: [] as string[],
  }), [defaultGame]);


  const storageData = useChromeStorage<MyKeys>(isChromeExtension, keys, defaultValues);

  useEffect(() => {
    if (!isChromeExtension) {
      const gameRes: GameInterface = defaultGame;
      const viewingPlayer: string = GamePlayMode.SinglePlayer;
      const storedMaximizedWidgets: string[] = [];
      setCustomizations(gameRes, viewingPlayer, storedMaximizedWidgets);
      return;
    }

    const endCause = storageData[END_CAUSE];
    if (endCause != null) {
      chrome.storage.local.set({ [GAME_WIDGET_MAXIMIZED]: [] }, () => {
        navigate("/gameEnd");
      });
    }

    const gameRes: GameInterface = storageData[GAME] as GameInterface;
    if (!gameRes) return;

    const viewingPlayer: string = storageData[VIEWING_PLAYER] as string;
    if (!viewingPlayer) return;

    const storedMaximizedWidgets = storageData[GAME_WIDGET_MAXIMIZED] as string[] || [];

    setCustomizations(gameRes, viewingPlayer, storedMaximizedWidgets);
  }, [isChromeExtension, storageData, navigate]);

  function setCustomizations(gameRes: GameInterface, viewingPlayer: string, storedMaximizedWidgets: string[]) {
    setGameStatus(gameRes.gameStatus);
    setPlayerIDs(gameRes.participants);

    setMode(gameRes.customizations.mode.type);

    const gameInformation: ClientGameInterface = gameRes.gameClients[viewingPlayer];
    const gameTracking: string = gameRes.customizations.track[0];
    const mode = gameRes.customizations.mode.type;
    if (mode === Mode.CountDown) {
      setCountDown(gameRes.customizations.mode.count_down?.timer ?? 0);
    }
    setPausable(gameRes.gameStatus.paused != null);
    setPaused(gameRes.gameStatus.paused ?? false);
    setPath(gameRes.path);
    let pathInfo = { type: gameRes.customizations.mode.type, directed: true };
    if (gameRes.customizations.mode.type === Mode.Path) {
      if (!gameRes.customizations.mode.path?.directed) {
        pathInfo.directed = false;
      }
    }
    setPathCustomizations(pathInfo);
    setCurrentPlayer(viewingPlayer);
    setGameClientsInformation(gameInformation);
    setTracking(gameTracking);

    setMaximizedWidgets(storedMaximizedWidgets);
  }

  useEffect(() => {
    if (!isChromeExtension) return;

    const handleMessage = (message: any) => {
      if (message.type === InformationUpdated.GameClient) {
        if (message.clientID === currentPlayerRef.current) {
          const updatedGameInformation = message.gameClient;
          setGameClientsInformation(updatedGameInformation);
        }
      } else if (message.type === InformationUpdated.GameStatus) {
        setGameStatus(message.gameStatus);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    const handleDataChanged = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      const storedEndCause = changes[END_CAUSE];
      if (storedEndCause && storedEndCause.newValue != null) {
        chrome.storage.local.set({ [GAME_WIDGET_MAXIMIZED]: [] }, () => {
          navigate("/gameEnd");
        });
      }
    }

    chrome.storage.local.onChanged.addListener(handleDataChanged);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      chrome.storage.local.onChanged.removeListener(handleDataChanged);
    }
  }, [isChromeExtension]);

  const updateCurrentPlayer = (playerID: string) => {
    chrome.storage.local.set({ [VIEWING_PLAYER]: playerID }, () => {
      chrome.runtime.sendMessage({
        type: InformationUpdated.ViewingPlayer,
        clientID: playerID,
      });
    });
    setCurrentPlayer(playerID);
  };

  const handleQuit = () => {
    chrome.runtime.sendMessage({
      type: SingleplayerEvents.Finish,
      cause: SingleplayerEvents.Quit,
    });
  };

  const handleTogglePause = () => {
    if (isChromeExtension) {
      if (paused) {
        chrome.runtime.sendMessage({ type: SingleplayerEvents.Unpause }, () => {
          setPaused(false);
        });
      } else {
        chrome.runtime.sendMessage({ type: SingleplayerEvents.Pause }, () => {
          setPaused(true);
        });
      }
    }
  };

  return (
    <div className="">
      <p className="text-xl text-center mb-1 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-1 bg-slate-100">
        {tempMode === GamePlayMode.MultiPlayer && (
          <PlayerSelectorWidget
            widgetKey={Widget.PlayerSelector}
            isExpanded={maximizedWidgets.includes(Widget.PlayerSelector)}
            onToggle={handleMaximize}
            currentPlayer={currentPlayer}
            playerIDs={playerIDs}
            onDataChange={updateCurrentPlayer}
          />
        )}

        <TrackingWidgetProps
          widgetKey={Widget.TrackingInformation}
          isExpanded={maximizedWidgets.includes(Widget.TrackingInformation)}
          onToggle={handleMaximize}
          gameClientInformation={gameClientsInformation}
          gameStatus={gameStatus}
          tracking={tracking}
          countDown={countDown}
          mode={mode}
        />

        <PathProgressWidget
          widgetKey={Widget.PathProgress}
          isExpanded={maximizedWidgets.includes(Widget.PathProgress)}
          onToggle={handleMaximize}
          gameClientInformation={gameClientsInformation}
          pathCustomizations={pathCustomizations}
          gameStatus={gameStatus}
          path={path}
        />
      </div>
      <GameUtilityButtons
        pausable={pausable}
        paused={paused}
        onTogglePause={handleTogglePause}
        onQuit={handleQuit}
      />
    </div>
  );
}

export default Game;
