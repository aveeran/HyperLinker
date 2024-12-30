import { useState } from "react";
import { Article, Suggestion } from "../../../utils/utils";
import PathSelector from "./PathSelector";
import SearchableDropdown from "../../../components/SearchableDropdown";

interface PathModeSelectorProps {
    path: Article[],
    rowLength: number;
    updateStartArticle: (value: Suggestion) => void;
    updateEndArticle: (value: Suggestion) => void;
    updatePathArticles: (value: Suggestion) => void;
    startArticle: Article,
    endArticle: Article,
    pathArticles: Article[],
    pathLength: number,
    isPathDirected: boolean,
    handlePathLength: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handlePathDirected: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PathModeSelector({
    path,
    rowLength,
    updateStartArticle,
    updateEndArticle,
    updatePathArticles,
    startArticle,
    endArticle,
    pathArticles,
    pathLength,
    isPathDirected,
    handlePathLength,
    handlePathDirected
}: PathModeSelectorProps) {
    const [currIdx, setCurrIdx] = useState<number>(0);

    return (
        <div>
            <div className="group relative grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Path Length</strong>
                <input className="text-center border rounded p-2 h-2"
                    type="number"
                    value={pathLength}
                    onChange={handlePathLength}
                    min="2"
                    step="1"
                    max="9"
                    placeholder="2"
                    aria-label="Path Length"
                />
            </div>

            <div className="group relative grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Directed</strong>
                <input className="mr-2"
                    type="checkbox"
                    id="directed"
                    value="directed"
                    checked={isPathDirected}
                    onChange={handlePathDirected}
                />
            </div>

            <p className="text-center font-medium text-base bg-purple-200 mt-2 mb-2">Path</p>

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
                        currIdx === 0 ? updateStartArticle :
                            (currIdx === pathLength - 1 ? updateEndArticle : updatePathArticles)
                    }
                    index={
                        currIdx === 0 ? 0 :
                            (currIdx === pathLength - 1 ? pathLength - 1 : currIdx - 1)
                    }
                    temp={
                        currIdx === 0 ? startArticle :
                            (currIdx === pathLength - 1 ? endArticle : pathArticles[currIdx - 1])
                    }
                />
            </div>
        </div>
    );

}

export default PathModeSelector;