import { useEffect, useMemo, useRef, useState } from "react";
import {
  Article,
  CLICK_COUNT,
  CustomizationInterface,
  defaultCustomizations,
  defaultGame,
  defaultGameStatus,
  END_CAUSE,
  GAME,
  GameInterface,
  GameStatusInterface,
  Mode,
  GamePlayMode,
  TAB_ID,
  InformationUpdated,
  VIEWING_PLAYER,
  Widget,
  GAME_END_PLAYER_SELECTOR_MAXIMIZED,
  GAME_END_WIDGET_MAXIMIZED,
  SingleplayerEvents,
  MyKeys
} from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useChromeStorage } from "../../../hooks/useChromeStorage";
import { useMaximizedWidgets } from "../../../hooks/useMaximizeWidgetsResult";
import CustomizationWidget from "../../../components/CustomizationWidget";
import PathProgressWidget from "../../../components/PathProgressWidget";
import PlayerSelectorWidget from "../../../components/PlayerSelectorWidget";
import GameStatUtilityButtons from "./GameStatUtilityButtons";
import EndCause from "./EndCause";

function GameStat() {
  const tempMode = GamePlayMode.MultiPlayer;
  

  const [cause, setCause] = useState<string>();
  const [currentPlayer, setCurrentPlayer] = useState<string>("Frank");
  const [pathCustomizations, setPathCustomizations] = useState<{ type: string, directed: boolean }>({ type: Mode.Normal, directed: true });
  const [gameStatus, setGameStatus] = useState<GameStatusInterface>(defaultGameStatus);
  const [path, setPath] = useState<Article[]>([]);

  const navigate = useNavigate();
  const currentPlayerRef = useRef<string>(currentPlayer);

  const [playerIDs, setPlayerIDs] = useState<string[]>([
    "Bob",
    "Frank",
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

  function handlePlayerSelectorMaximize(widget: string) {
    const updated = togglePlayerSelectorWidget(widget);
    if(isChromeExtension) {
      chrome.storage.local.set({[GAME_END_PLAYER_SELECTOR_MAXIMIZED] : updated})
    }
  }

  const { 
    maximizedWidgets: playerSelectorWidget, 
    toggleWidget: togglePlayerSelectorWidget, 
    setMaximizedWidgets: setPlayerSelectorWidget 
  } = useMaximizedWidgets([Widget.PlayerSelector], 1);

  function handleMaximize(widget: string) {
    const updated = toggleWidget(widget);
    if(isChromeExtension) {
      chrome.storage.local.set({[GAME_END_WIDGET_MAXIMIZED] : updated});
    }
  }

  const { maximizedWidgets, toggleWidget, setMaximizedWidgets } = useMaximizedWidgets([Widget.PathProgress], 1);

  const keys = useMemo(() => [
    GAME,
    VIEWING_PLAYER,
    END_CAUSE,
    GAME_END_PLAYER_SELECTOR_MAXIMIZED,
    GAME_END_WIDGET_MAXIMIZED,
  ], []);

  const defaultValues = useMemo(() => ({
    [GAME]: defaultGame,
    [VIEWING_PLAYER]: GamePlayMode.SinglePlayer,
    [END_CAUSE]: SingleplayerEvents.Quit,
    [GAME_END_PLAYER_SELECTOR_MAXIMIZED]: [] as string[],
    [GAME_END_WIDGET_MAXIMIZED]: [] as string[],
  }), [defaultGame]);


  const storageData = useChromeStorage<MyKeys>(isChromeExtension, keys, defaultValues);

  useEffect(() => {
    if (!isChromeExtension) {
      setGameInformation(defaultGame);
      setGameCustomizations(defaultCustomizations);
      setPath(defaultGame.path);
      return;
    }

    const endCause = storageData[END_CAUSE];
    setCause(endCause);

    const gameRes: GameInterface = storageData[GAME];
    setGameInformation(gameRes);

    const storedCustomizations: CustomizationInterface = gameRes.customizations;
    setGameCustomizations(storedCustomizations);

    const storedPlayerIDs = gameRes.participants;
    setPlayerIDs(storedPlayerIDs);

    const storedGameStatus = gameRes.gameStatus;
    setGameStatus(storedGameStatus);

    const viewingPlayer: string = storageData[VIEWING_PLAYER];
    setCurrentPlayer(viewingPlayer);
    currentPlayerRef.current = viewingPlayer;
    setPath(gameRes.path);

    let pathInfo = { type: gameRes.customizations.mode.type, directed: true };
    if (gameRes.customizations.mode.type === Mode.Path) {
      if (!gameRes.customizations.mode.path?.directed) {
        pathInfo.directed = false;
      }
    }
    setPathCustomizations(pathInfo);



    const playerSelectorMaximized: string[] = storageData[GAME_END_PLAYER_SELECTOR_MAXIMIZED];
    
    setPlayerSelectorWidget(playerSelectorMaximized);

    const storedMaximizedWidget: string[] = storageData[GAME_END_WIDGET_MAXIMIZED];
    setMaximizedWidgets(storedMaximizedWidget);

    
  }, [isChromeExtension, storageData])


  const updateCurrentPlayer = (playerID: string) => {
    chrome.storage.local.set({ [VIEWING_PLAYER]: playerID }, () => {
      chrome.runtime.sendMessage({
        type: InformationUpdated.ViewingPlayer,
        clientID: playerID,
      });
    });
    setCurrentPlayer(playerID);
    currentPlayerRef.current = playerID;
  };

  const done = () => {
    // resetting the fields
    chrome.storage.local.set({
      [GAME]: defaultGame,
      [END_CAUSE]: null,
      [TAB_ID]: null,
      [CLICK_COUNT]: 0,
      [GAME_END_PLAYER_SELECTOR_MAXIMIZED]: [],
      [GAME_END_WIDGET_MAXIMIZED]: []
    }, () => {
      navigate('/dashboard');
    })
  }

  return (
    <div className="">
      <p className="text-xl text-center mb-1 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-1 bg-slate-100">
        <EndCause
        cause={cause}
        />

        {tempMode === GamePlayMode.MultiPlayer && (
          <PlayerSelectorWidget
          widgetKey={Widget.PlayerSelector}
          isExpanded={playerSelectorWidget.includes(Widget.PlayerSelector)}
          onToggle={handlePlayerSelectorMaximize}
          currentPlayer={currentPlayer}
          playerIDs={playerIDs}
          onDataChange={updateCurrentPlayer}
          />
        )}

        <CustomizationWidget
        widgetKey={Widget.CustomizationInfo}
        isExpanded={maximizedWidgets.includes(Widget.CustomizationInfo)}
        onToggle={handleMaximize}
        customizations={gameCustomizations}
        />

        <PathProgressWidget
        widgetKey={Widget.PathProgress}
        isExpanded={maximizedWidgets.includes(Widget.PathProgress)}
        onToggle={handleMaximize}
        gameClientInformation={gameInformation.gameClients[currentPlayerRef.current]}
        pathCustomizations={pathCustomizations}
        gameStatus={gameStatus}
        path={path}
        />
      </div>

      <GameStatUtilityButtons
      done={done}
      />
    </div>
  );
}

export default GameStat;
