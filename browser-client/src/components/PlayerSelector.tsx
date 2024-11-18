function PlayerSelector({onDataChange, playerIDs, currentPlayer} : {onDataChange : (playerID: string) => void, playerIDs: string[],
    currentPlayer: string
}) {
    return (
        <div className="flex flex-wrap justify-center gap-2 p-2">
            {
                playerIDs.map((id) => (
                    <div
                    key = {id}
                    onClick={() => (id!==currentPlayer) && onDataChange(id)}
                    className={`rounded-md ${id===currentPlayer ? "font-bold text-black" : "text-blue-700 font-medium cursor-pointer "}`}>
                        {id}
                    </div>
                ))
            }

        </div>
    )
}

export default PlayerSelector;