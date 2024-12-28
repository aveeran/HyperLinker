interface GameStatUtilityButtonProps {
    done: () => void;
}

function GameStatUtilityButtons( {done} : GameStatUtilityButtonProps) {
    return (
        <div className="flex justify-center">
          <button
            className="bg-gray-500 p-2 border-2 border-gray-200 rounded-md text-white font-custom"
            onClick={done}
          >Continue</button>
        </div>
      )
}

export default GameStatUtilityButtons;