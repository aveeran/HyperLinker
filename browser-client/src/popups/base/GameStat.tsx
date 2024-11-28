import { useEffect, useState } from "react";
import { END_CAUSE } from "../../utils/utils";

function GameStat() {
    const [cause, setCause] = useState<string>();

    useEffect(() => {
        chrome.storage.local.get([END_CAUSE], (result) => {
            setCause(result[END_CAUSE]);
        });
    }, [])

    return (
        <>
        <p>
            {cause}
        </p>
        </>
    )
}

export default GameStat;