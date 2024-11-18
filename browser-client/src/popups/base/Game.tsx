import { useNavigate } from "react-router-dom";
import { GAME, MULTI_PLAYER } from "../../utils/utils";
import PlayerSelector from "../../components/PlayerSelector";
import { useState } from "react";
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

  const updateCurrentPlayer = (playerID: string) => {
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
