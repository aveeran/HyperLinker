import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  Article,
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultArticle,
  defaultCustomizations,
  GAME_MODE,
  MODE_COUNT_DOWN,
  MODE_NORMAL,
  MODE_PATH,
  MULTI_PLAYER,
  Suggestion,
  UPDATE_CUSTOMIZATION,
  UPDATED_CUSTOMIZATION,
} from "../../utils/utils";
import SearchableDropdown from "../../components/SearchableDropdown";

function ModeChoice() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState<CustomizationInterface>(
    defaultCustomizations
  );
  const [mode, setMode] = useState<string>("");
  const [startArticle, setStartArticle] = useState<Article>(defaultArticle);
  const [endArticle, setEndArticle] = useState<Article>(defaultArticle);
  const [pathLength, setPathLength] = useState<number>(0);
  const [isPathDirected, setIsPathDirected] = useState<boolean>(false);
  const [pathArticles, setPathArticles] = useState<(Article)[]>([]);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [currIdx, setCurrIdx] = useState<number>(0);

  const updateStartArticle = (value: Suggestion) => setStartArticle(value.article);

  const updateEndArticle = (value: Suggestion) => setEndArticle(value.article);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setMode(event.target.value);

  const handleBack = () => navigate('/dashboard');

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([CUSTOMIZATIONS, GAME_MODE], (result) => {
        const storedCustomizations = result[CUSTOMIZATIONS];
        if (storedCustomizations) {
          setCustomizationStates(storedCustomizations);
        }

        // If multiplayer, then update when customizations updated

        if (result[GAME_MODE] === MULTI_PLAYER) {
          const handleMessage = (message: { type: string; customizations: CustomizationInterface },
            sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void
          ) => {
            if (message.type === UPDATED_CUSTOMIZATION && message.customizations) {
              setCustomizationStates(message.customizations);
            }
          }
          chrome.runtime.onMessage.addListener(handleMessage);

          return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
          }
        }
      });
    } else {
      setCustomizationStates(defaultCustomizations);
    }
  }, [isChromeExtension]);

  const setCustomizationStates = (updatedCustomizations: CustomizationInterface) => {
    if (updatedCustomizations) {
      setCustomizations(updatedCustomizations);

      let tempMode = updatedCustomizations.mode.type;

      setMode(updatedCustomizations.mode.type);
      setStartArticle(updatedCustomizations.start);
      setEndArticle(updatedCustomizations.end);

      setPathLength(updatedCustomizations.mode.path?.pathLength ?? 0);
      setIsPathDirected(updatedCustomizations.mode.path?.directed ?? false);
      setPathArticles(updatedCustomizations.mode.path?.connections ?? []);

      let fullTime: number = updatedCustomizations.mode.count_down?.timer ?? 0;
      setMinutes(Math.floor(fullTime / 60));
      setSeconds(fullTime % 60);
    }
  };

  const updatePathArticles = (value: Suggestion) => {
    if (value) {
      const idx = value.index;
      let temp = [...pathArticles];
      temp[idx] = value.article;
      setPathArticles(temp);
    }
  };

  const handlePathLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (value > 8) {
      value = 8;
    }

    if (value > pathLength) {
      let extendedPathArticles: (Article)[] = pathArticles.concat(new Array(value - pathLength).fill({ title: "", link: "" }));
      setPathArticles(extendedPathArticles);
    } else {
      let shortenedPathArticles: (Article)[] = pathArticles.slice(0, value - 2);
      setPathArticles(shortenedPathArticles);
    }
    setPathLength(value);
  };

  const handleMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMinutes(value);
  }

  const handleSeconds = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setSeconds(value);
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPathDirected(event.target.checked);
  };

  const handleSubmit = () => {
    const updatedCustomizations = {
      ...customizations,
      mode: {
        ...customizations.mode,
        type: mode,
        ...(mode === MODE_PATH && {
          path: {
            pathLength: pathLength,
            directed: isPathDirected,
            connections: pathArticles,
          },
        }),
        ...(mode === MODE_COUNT_DOWN && {
          count_down: {
            timer: 60 * minutes + seconds,
          },
        }),
      },
      start: startArticle,
      end: endArticle,
    };

    if (isChromeExtension) {
      chrome.storage.local.set(
        { [CUSTOMIZATIONS]: updatedCustomizations },
        () => {
          chrome.runtime.sendMessage({
            type: UPDATE_CUSTOMIZATION,
            customizations: updatedCustomizations,
          });
        }
      );
    }
    setCustomizationStates(updatedCustomizations);
    handleBack();
  };

  const handleClickNode = (nodeIndex: number) => {
    setCurrIdx(nodeIndex);
  }

  function generateNode(rowIndex: number, step: Article, index: number, rowLength: number) {
    const nodeIndex = rowIndex % 2 === 0 ?
      index + rowIndex * rowLength : rowIndex * rowLength + (rowLength - index - 1);

    const isSelected = nodeIndex === currIdx;

    return (
      <div
        key={nodeIndex}
        className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer p-2 ${isSelected
          ? "bg-blue-500 text-white border-green-400 shadow-gray-400 drop-shadow-2xl"
          : "bg-white border-gray-300"
          }`}
        onClick={() => handleClickNode(nodeIndex)}
        title={step.title}
      >
        <p className="truncate text-sm" aria-label={step.title}>
          {step.title}
        </p>
      </div>
    );
  }

  function generateRow(row: Article[], rowIndex: number, rowLength: number) {
    return (
      <div
        className={`flex items-center gap-4 ${rowIndex % 2 === 0 ? "justify-left" : "justify-end"}`}
        key={`row-${rowIndex}`}
      >
        {row.map((step, index) => (
          <React.Fragment key={`node-${rowIndex}-${index}`}>
            {generateNode(rowIndex, step, index, rowLength)}
            {index < row.length - 1 && generateLink(rowIndex, index, rowLength)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  function generateVerticalConnector(rowIndex: number) {
    return (
      <div
        key={`connector-${rowIndex}`}
        className={`flex ${rowIndex % 2 === 0 ? "justify-end mr-5" : "justify-start ml-5"
          } my-2`}
      >
        <div className="w-2 h-8 bg-gray-200"></div>
      </div>
    );
  }

  function generateLink(rowIndex: number, index: number, rowLength: number) {
    const linkIndex =
      rowIndex % 2 === 0
        ? index + rowIndex * rowLength
        : rowIndex * rowLength + (rowLength - index - 1) - 1;
    return (
      <div
        key={`link-${linkIndex}`}
        className="h-2 w-8 bg-gray-300 mx-1"
      ></div>
    );
  }

  function renderPath() {
    const rowLength = 3;

    // modify later...?
    let path: Article[] = [];

    if (mode === MODE_PATH) {
      path = [startArticle, ...pathArticles, endArticle];
    } else {
      path = [startArticle, endArticle];
    }

    const rows = path.reduce<Array<Array<Article>>>((acc, step, index) => {
      const rowIndex = Math.floor(index / rowLength);
      if (!acc[rowIndex]) acc[rowIndex] = [];
      acc[rowIndex].push(step);
      return acc;
    }, []);

    rows.forEach((row, index) => {
      if (index % 2 === 1) row.reverse();
    });

    return (
      <div className="p-1 inline-block">
        {rows.map((row, rowIndex) => (
          <React.Fragment key={`row-fragment-${rowIndex}`}>
            {generateRow(row, rowIndex, rowLength)}
            {rowIndex < rows.length - 1 && generateVerticalConnector(rowIndex)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  function renderNormal() {
    return (mode === MODE_NORMAL && (
      <div>
        <div className="flex flex-col items-center mb-1">
          {renderPath()}
        </div>
        <div className="w-full flex justify-center items-center">

          <SearchableDropdown
            onDataChange={
              currIdx == 0 ? updateStartArticle : updateEndArticle}
            index={
              currIdx
            }
            temp={
              currIdx === 0 ? startArticle : endArticle
            }
          />

        </div>
      </div>
    )
    )
  }

  function renderCountDown() {
    return (mode === MODE_COUNT_DOWN && (
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
          />
          <span className="text-blue-700 font-medium">minutes
            
          </span>
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
          {renderPath()}
        </div>
        <div className="w-full flex justify-center items-center">

          <SearchableDropdown
            onDataChange={
              currIdx == 0 ? updateStartArticle : updateEndArticle}
            index={
              currIdx
            }
            temp={
              currIdx === 0 ? startArticle : endArticle
            }
          />

        </div>
      </div>
    )
    )
  }

  function renderPathMode() {
    return (mode === MODE_PATH && (
      <div>
        <div className="group relative grid grid-cols-3 gap-4 p-1">
          <strong className="text-base mr-1 col-span-1">Path Length</strong>
          <input className="text-center border rounded p-2 h-8"
            type="number"
            value={pathLength}
            onChange={handlePathLength}
            min="2"
            step="1"
            max="8"
            placeholder="2"
            aria-label="Positive integer input" />
        </div>

        <div className="group relative grid grid-cols-3 gap-4 p-1">
          <strong className="text-base mr-1 col-span-1">Directed</strong>
          <input className="mr-2"
            type="checkbox"
            id="directed"
            value="directed"
            checked={isPathDirected}
            onChange={handleOptionChange} />
        </div>

        <p className="text-center font-medium text-base bg-purple-200 mt-2 mb-2">
          Path
        </p>
        <div>


          <div className="flex flex-col items-center mb-1">
            {renderPath()}
          </div>

          <div className="w-full flex justify-center items-center">

            <SearchableDropdown
              onDataChange={
                currIdx == 0 ? updateStartArticle :
                  (currIdx === pathLength - 1 ? updateEndArticle : updatePathArticles)}
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

      </div>

    )
    )
  }


  return (
    <div className="p-1">
      <div className="border-gray-400 border-2 border-solid p-1.5 m-1 bg-slate-100">
        <p className="text-center font-medium text-base bg-slate-200">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-1" />

        <p className="text-center font-medium text-base bg-purple-200 mt-1 mb-1">
          Mode
        </p>

        <div className="">
          <div className="p-1 mb-1">
            <select
              value={mode}
              onChange={handleModeChange}
              className="block mx-auto p-1 border rounded"
            >
              <option value="" disabled>
                Select a mode
              </option>
              <option value={MODE_NORMAL}>Normal</option>
              <option value={MODE_COUNT_DOWN}>Count-Down</option>
              <option value={MODE_PATH}>Path</option>
              <option value="random">Random</option>
            </select>
          </div>

          {renderNormal()}
          {renderCountDown()}
          {renderPathMode()}

          {mode === "random" ? <div></div> : null}
        </div>
      </div>
      <div className="flex justify-center mb-3">
        <button
          className="flex bg-gray-400 text-white px-4 py-2 rounded mr-3 font-custom"
          onClick={handleBack}
        >
          Return
        </button>
        <button
          className="flex bg-blue-400 text-white px-4 py-2 rounded font-custom"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ModeChoice;
