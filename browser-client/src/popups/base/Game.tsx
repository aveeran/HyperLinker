import { useNavigate } from "react-router-dom";
import { GAME } from "../../utils/utils";

function Game() {
    const navigate = useNavigate();

    const test = () => {
        chrome.storage.local.get([GAME], (result) => {
            if(result[GAME]) {
                console.log(result[GAME]);
            }
        })
    }
    return (
        <>
        <button onClick={test}>Test</button>
        <button onClick={() => {navigate(-1)}}>Return</button>
        </>
    )
}

export default Game;