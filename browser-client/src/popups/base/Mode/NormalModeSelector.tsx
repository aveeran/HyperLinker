import { useState } from "react";
import { Article, Suggestion } from "../../../utils/utils";
import PathSelector from "./PathSelector";
import SearchableDropdown from "../../../components/SearchableDropdown";

interface NormalModeSelectorPropos {
    path: Article[],
    rowLength: number,
    updateStartArticle: (value: Suggestion) => void;
    updateEndArticle: (value: Suggestion) => void;
    startArticle: Article,
    endArticle: Article
}

function NormalModeSelector({
    path, 
    rowLength,
    updateStartArticle,
    updateEndArticle,
    startArticle,
    endArticle
} : NormalModeSelectorPropos) {
    const [currIdx, setCurrIdx] = useState<number>(0);

    return (
    <div>
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
                currIdx === 0 ? updateStartArticle : updateEndArticle
            }
            index={currIdx}
            temp={currIdx === 0 ? startArticle : endArticle}
            />
        </div>
    </div>
    );
}

export default NormalModeSelector;