import { useEffect, useMemo, useRef, useState } from "react";
import {
    Article,
    defaultGame,
    defaultGameStatus,
  END_CAUSE,
  GAME,
  GameInterface,
  GameStatusInterface,
  MODE_NORMAL,
  MODE_PATH,
  MULTI_PLAYER,
  UPDATED_VIEWING_PLAYER,
  VIEWING_PLAYER,
} from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import PathProgress from "../../components/PathProgress";
import { useNavigate } from "react-router-dom";

function GameStat() {
  const tempMode = MULTI_PLAYER;
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

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);


  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([GAME, VIEWING_PLAYER, END_CAUSE], (result) => {
        setCause(result[END_CAUSE]);

        const gameRes: GameInterface = result[GAME];
        setGameInformation(gameRes);

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
      });
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

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-xl font-medium text-center bg-sky-200 p-1 mb-1">
          Singleplayer 
        </p>
        <p className="text-center font-medium text-base p-1 mb-1">
            {cause}
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
          Progress
        </p>
        
        <PathProgress gameClientInformation={gameInformation.gameClients[currentPlayerRef.current]} pathCustomizations={pathCustomizations} 
        gameStatus={gameStatus} path={path}/>
      </div>
      <button onClick={() => navigate(-1)}>Bruh</button>
    </div>
  );
}

export default GameStat;
