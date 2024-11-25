import { useNavigate } from "react-router-dom";
import { ClientGameInterface, defaultClientGame, defaultCustomizations, GAME, GAME_MODE, GameInterface, ClientStatusInterface, MODE_COUNT_DOWN, MULTI_PLAYER, PLAYER, SINGLE_PLAYER, UPDATED_GAME_CLIENT, UPDATED_VIEWING_PLAYER, VIEWING_PLAYER, GameStatusInterface, defaultGameStatus, CustomizationInterface, MODE_NORMAL, Article, MODE_PATH } from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import { useEffect, useMemo, useRef, useState } from "react";
import GameTracker from "../../components/GameTracker";
import PathProgress from "../../components/PathProgress";

function Game() {
  const tempMode = MULTI_PLAYER;
  const navigate = useNavigate();
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

  const currentPlayerRef = useRef<string>(currentPlayer);
  const [tracking, setTracking] = useState<string>(defaultCustomizations.track[0])
  const [countDown, setCountDown] = useState<number>(-1);

  const [pathCustomizations, setPathCustomizations] = useState<{type: string, directed:boolean}>({type: MODE_NORMAL, directed:true});

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);

  useEffect(() => {
    if(isChromeExtension) {
      // First log
      chrome.storage.local.get([GAME, VIEWING_PLAYER, GAME_MODE], (result) => {
        const gameRes: GameInterface = result[GAME];

        // Stroing game status
        const storedGameStatus = gameRes.gameStatus;
        setGameStatus(storedGameStatus);

        // Storing player IDs
        const storedPlayerIDs = gameRes.participants;
        setPlayerIDs(storedPlayerIDs);

        // Retrieving game client information for player being viewed
        const viewingPlayer: string = result[VIEWING_PLAYER];
        const gameInformation: ClientGameInterface = gameRes.gameClients[viewingPlayer];

        // Retrieving tracking mode
        const gameTracking: string = gameRes.customizations.track[0];

        // Retrieving count-down (if possible)
        const mode = gameRes.customizations.mode.type;
        if(mode===MODE_COUNT_DOWN) {
          setCountDown(gameRes.customizations.mode.count_down?.timer ?? 0);
        }

        // Retrieving path stuff
        setPath(gameRes.path);
        let pathInfo = {type: gameRes.customizations.mode.type, directed: true}
        if(gameRes.customizations.mode.type === MODE_PATH) {
          if(!gameRes.customizations.mode.path?.directed) { // TODO: make sure that when path is null, is true
            pathInfo.directed = false;
          }
        }
        setPathCustomizations(pathInfo);

        // Setting states
        setCurrentPlayer(viewingPlayer);
        setGameClientsInformation(gameInformation);
        setTracking(gameTracking);
      });

      chrome.runtime.onMessage.addListener((message, sender, response) => {
        if(message.type === UPDATED_GAME_CLIENT) {
          if(message.clientID === currentPlayerRef.current) { // TODO: separate user name from ID
            const updatedGameInformation = message.gameClient;
            console.log("Updated game information: ", updatedGameInformation);
            setGameClientsInformation(updatedGameInformation);
          }
        } else if (message.type === UPDATED_GAME_CLIENT) {
          //TODO: do ???
        }
        // TODO: add listener check for if game ends, etc.
      });
    }
  }, [isChromeExtension]);

  const updateCurrentPlayer = (playerID: string) => {
    chrome.storage.local.set({[VIEWING_PLAYER]: playerID}, () => {
      chrome.runtime.sendMessage({
        type: UPDATED_VIEWING_PLAYER,
        clientID: playerID
      });
    });
    setCurrentPlayer(playerID);
  };

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 mo-3 bg-slate-100">
        <p className="text-xl font-medium text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>
        {tempMode === MULTI_PLAYER ? (
          <div>
            <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
              Player Selection
            </p>
            <div className="flex justify-center items-center">
              <PlayerSelector
                onDataChange={updateCurrentPlayer}
                playerIDs={playerIDs}
                currentPlayer={currentPlayer}
              />
            </div>
          </div>
        ) : null}
        <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
          Tracking
        </p>
        <GameTracker gameClientInformation={gameClientsInformation} gameStatus={gameStatus}
        tracking={tracking} countDown={countDown}/>
        <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
          Progress
        </p>
        <PathProgress gameClientInformation={gameClientsInformation} pathCustomizations={pathCustomizations} 
        gameStatus={gameStatus} path={path}/>

      </div>

      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Return
      </button>
    </div>
  );
}

export default Game;
