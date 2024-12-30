import { useState } from "react";
import { Article, Suggestion } from "../../../utils/utils";
import PathSelector from "./PathSelector";
import SearchableDropdown from "../../../components/SearchableDropdown";

interface CountDownModeSelectorProps {
    path: Article[],
    rowLength: number,
    updateStartArticle: (value: Suggestion) => void;
    updateEndArticle: (value: Suggestion) => void;
    startArticle: Article,
    endArticle: Article,
    minutes: number,
    seconds: number,
    handleMinutes: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSeconds: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CountDownModeSelector({
    path,
    rowLength,
    updateStartArticle,
    updateEndArticle,
    startArticle,
    endArticle,
    minutes,
    seconds,
    handleMinutes,
    handleSeconds
} : CountDownModeSelectorProps) {
    const [currIdx, setCurrIdx] = useState<number>(0);

    return (

    <div className="items-center justify-center">
        <div className="flex items-center justify-center mb-2 w-auto bg-slate-200 p-1 space-x-2">
            <input 
            className="text-center border rounded p-2 max-w-[50px]"
            type="number"
            value={minutes}
            onChange={handleMinutes}
            min="0"
            step="1"
            placeholder="0"
            aria-label="Minutes"
            max="59"
            />
            <span className="text-blue-700 font-medium">minutes</span>
            <input 
            className="text-center border rounded p-2 max-w-[50px]"
            type="number"
            value={seconds}
            onChange={handleSeconds}
            min="0"
            max="59"
            step="1"
            placeholder="0"
            aria-label="Seconds"
            />
            <span className="text-blue-700 font-medium">seconds</span>
        </div>

        <div className="flex flex-col items-center mb-1">
            <PathSelector
            currIdx={currIdx}
            path={path}
            handleClickNode={setCurrIdx}
            rowLength={rowLength}
            />
        </div>

        <div className="w-full flex justify-center items-center">
            <SearchableDropdown
            onDataChange={
                currIdx == 0 ? updateStartArticle : updateEndArticle
            }
            index = {currIdx}
            temp = {
                currIdx === 0 ? startArticle : endArticle
            }
            />
        </div>
    </div>
    );
}

export default CountDownModeSelector;