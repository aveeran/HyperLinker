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
  Mode,
  GamePlayMode,
  Suggestion,
  InformationUpdated,
  UpdateInformation,
  MyKeys,
  parseEnum,
} from "../../../utils/utils";
import { useChromeStorage } from "../../../hooks/useChromeStorage";
import NormalModeSelector from "./NormalModeSelector";
import CountDownModeSelector from "./CountDownModeSelector";
import PathModeSelector from "./PathModeSelector";

function ModeChoice() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState<CustomizationInterface>(
    defaultCustomizations
  );
  const [mode, setMode] = useState<Mode>(Mode.Normal);
  const [startArticle, setStartArticle] = useState<Article>(defaultArticle);
  const [endArticle, setEndArticle] = useState<Article>(defaultArticle);
  const [pathLength, setPathLength] = useState<number>(0);
  const [isPathDirected, setIsPathDirected] = useState<boolean>(false);
  const [pathArticles, setPathArticles] = useState<(Article)[]>([]);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const updateStartArticle = (value: Suggestion) => setStartArticle(value.article);

  const updateEndArticle = (value: Suggestion) => setEndArticle(value.article);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setMode(parseEnum(Mode, event.target.value));

  const handleBack = () => navigate('/dashboard');

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);

  const keys: MyKeys[] = useMemo(() => [CUSTOMIZATIONS, GAME_MODE], []);
  const defaultValues = useMemo(() => ({
    [CUSTOMIZATIONS]: defaultCustomizations,
    [GAME_MODE]: GamePlayMode.SinglePlayer
  }), []) 

  const storageData = useChromeStorage(isChromeExtension, keys, defaultValues);

  useEffect(() => {
    const storedCustomizations = storageData[CUSTOMIZATIONS];
    if(storedCustomizations) {
      setCustomizationStates(storedCustomizations);
    }

    if(storageData[GAME_MODE] === GamePlayMode.MultiPlayer) {
      const handleMessage = (
        message: { type: string; customizations: CustomizationInterface },
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
      ) => {
        if(message.type === InformationUpdated.Customization && message.customizations) {
          setCustomizationStates(message.customizations);
        }
      };

      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [storageData, isChromeExtension])

  const setCustomizationStates = (updatedCustomizations: CustomizationInterface) => {
    if (updatedCustomizations) {
      setCustomizations(updatedCustomizations);

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
        ...(mode === Mode.Path && {
          path: {
            pathLength: pathLength,
            directed: isPathDirected,
            connections: pathArticles,
          },
        }),
        ...(mode === Mode.CountDown && {
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
            type: UpdateInformation.Customization,
            customizations: updatedCustomizations,
          });
        }
      );
    }
    setCustomizationStates(updatedCustomizations);
    handleBack();
  };

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
              <option value={Mode.Normal}>Normal</option>
              <option value={Mode.CountDown}>Count-Down</option>
              <option value={Mode.Path}>Path</option>
              <option value={Mode.Random}>Random</option>
            </select>
          </div>

          {mode === Mode.Normal && (
            <NormalModeSelector
            path={[startArticle, endArticle]}
            rowLength={3}
            updateStartArticle={updateStartArticle}
            updateEndArticle={updateEndArticle}
            startArticle={startArticle}
            endArticle={endArticle}
            />
          )}
          {mode === Mode.CountDown && (
            <CountDownModeSelector
            path={[startArticle, endArticle]}
            rowLength={3}
            updateStartArticle={updateStartArticle}
            updateEndArticle={updateEndArticle}
            startArticle={startArticle}
            endArticle={endArticle}
            minutes={minutes}
            seconds={seconds}
            handleMinutes={handleMinutes}
            handleSeconds={handleSeconds}
            />
          )}
          {mode === Mode.Path && (
            <PathModeSelector
            path={[startArticle, ...pathArticles, endArticle]}
            rowLength={3}
            updateStartArticle={updateStartArticle}
            updateEndArticle={updateEndArticle}
            updatePathArticles={updatePathArticles}
            startArticle={startArticle}
            endArticle={endArticle}
            pathArticles={pathArticles}
            pathLength={pathLength}
            isPathDirected={isPathDirected}
            handlePathLength={handlePathLength}
            handlePathDirected={handleOptionChange}
            />
          )}

          {mode === Mode.Random ? <div></div> : null}
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
