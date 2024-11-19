import { useNavigate } from "react-router-dom";
import { ClientGameInterface, defaultClientGame, GAME, GAME_MODE, GameInterface, GameStatus, MULTI_PLAYER, PLAYER, SINGLE_PLAYER, UPDATED_GAME_CLIENT, UPDATED_VIEWING_PLAYER, VIEWING_PLAYER } from "../../utils/utils";
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
  const [gameClientsInformation, setGameClientsInformation] = useState<ClientGameInterface>();
  const currentPlayerRef = useRef<string>(currentPlayer);
  // const [gameMode, setGameMode] = useState<string>(SINGLE_PLAYER);

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

        // Storing player IDs
        const storedPlayerIDs = gameRes.participants;
        setPlayerIDs(storedPlayerIDs);

        // Retrieving game client information for player being viewed
        const viewingPlayer: string = result[VIEWING_PLAYER];
        const gameInformation: ClientGameInterface = gameRes.gameClients[viewingPlayer];

        // Setting states
        setCurrentPlayer(viewingPlayer);
        setGameClientsInformation(gameInformation);
      });

      chrome.runtime.onMessage.addListener((message, sender, response) => {
        console.log("Message received: ", message.type);
        if(message.type === UPDATED_GAME_CLIENT) {
          console.log("Message client ID vs currentID: ", message.clientID, " vs ", currentPlayerRef.current);
          if(message.clientID === currentPlayerRef.current) { // TODO: separate user name from ID
            const updatedGameInformation = message.gameClient;
            setGameClientsInformation(updatedGameInformation);
            console.log("Updated!");
          }
        }
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
        <GameTracker playerID = {currentPlayer}/>
        <p className="text-xl font-medium text-center bg-slate-200 p-1 mb-1">
          Progress
        </p>
        <PathProgress playerID = {currentPlayer} />
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
