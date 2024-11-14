import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Article,
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultArticle,
  defaultCustomizations,
  GAME_MODE,
  MODE_COUNT_DOWN,
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
  const [pathArticles, setPathArticles] = useState<Article[]>([]);
  const [timer, setTimer] = useState<number>(0);

  const updateStartArticle = (value: Suggestion) =>
    setStartArticle(value.article);
  const updateEndArticle = (value: Suggestion) => setEndArticle(value.article);
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setMode(event.target.value);
  const handleBack = () => navigate(-1);

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

        if(result[GAME_MODE] === MULTI_PLAYER) {
          const handleMessage = (message: {type: string; customizations: CustomizationInterface},
            sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void
          ) => {
            if(message.type === UPDATED_CUSTOMIZATION && message.customizations) {
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

  const setCustomizationStates = (
    updatedCustomizations: CustomizationInterface
  ) => {
    if (updatedCustomizations) {
      setCustomizations(updatedCustomizations);
      setMode(updatedCustomizations.mode.type);
      setStartArticle(updatedCustomizations.start);
      setEndArticle(updatedCustomizations.end);
      setPathLength(updatedCustomizations.mode.path?.pathLength ?? 0);
      setIsPathDirected(updatedCustomizations.mode.path?.directed ?? false);
      setPathArticles(updatedCustomizations.mode.path?.connections ?? []);
      setTimer(updatedCustomizations.mode.count_down?.timer ?? 0);
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
    const value = parseInt(event.target.value, 10);
    if (value > 8) {
      setPathLength(8);
    } else {
      setPathLength(value);
    }

    while (pathArticles.length > value - 2) {
      pathArticles.pop(); // TODO: ???
    }
    setPathArticles([...pathArticles]);
  };

  const handleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setTimer(value);
  };

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
            timer: timer,
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
    setCustomizationStates(updatedCustomizations); // TODO: necessary?
    handleBack();
  };

  return (
    <div className="pt-3 p-1">
      <h1 className="text-4xl text-center font-custom mb-3">HyperLinker</h1>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="font-medium text-xl text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>
        <p className="text-center font-medium text-base bg-slate-200">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-3" />
        <p className="text-center font-medium text-base bg-slate-200 mt-2 mb-2">
          Mode
        </p>

        <div className="">
          <div className="bg-yellow-200 p-1 mb-2">
            <select
              value={mode}
              onChange={handleModeChange}
              className="block mx-auto p-2 border rounded"
            >
              <option value="" disabled>
                Select a mode
              </option>
              <option value="normal">Normal</option>
              <option value="count-down">Count-Down</option>
              <option value="path">Path</option>
              <option value="random">Random</option>
            </select>
          </div>

          {mode === "normal" ? (
            <div className="flex flex-col mb-2">
              <ul className="flex flex-col list-disc ml-12">
                <li className="list-item">
                  <div className="flex mb-2 items-center">
                    <p className="font-medium w-[15%]">Start</p>
                    <div className="">
                      <SearchableDropdown
                        onDataChange={updateStartArticle}
                        temp={startArticle}
                      />
                    </div>
                  </div>
                </li>

                <li className="list item">
                  <div className="flex mb-2 items-center">
                    <p className="font-medium w-[15%]">End</p>
                    <div className="">
                      <SearchableDropdown
                        onDataChange={updateEndArticle}
                        temp={endArticle}
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          ) : null}

          {mode === "count-down" ? (
            <div className="items-center justify-center">
              <div className="flex items-center justify-center mb-2 w-auto bg-slate-200 p-1">
                <input
                  className="flex text-center border rounded p-2 mr-2 max-w-[50%]"
                  type="number"
                  value={timer}
                  onChange={handleTimer}
                  min="1"
                  step="1"
                  placeholder="1"
                  aria-label="Count-down timer"
                />
                <span className="text-blue-700 font-medium">seconds</span>
              </div>

              <div className="flex flex-col mb-2">
                <ul className="flex flex-col list-disc ml-12">
                  <li className="list-item">
                    <div className="flex mb-2 items-center">
                      <p className="font-medium w-[15%]">Start</p>
                      <div className="">
                        <SearchableDropdown
                          onDataChange={updateStartArticle}
                          temp={startArticle}
                        />
                      </div>
                    </div>
                  </li>

                  <li className="list item">
                    <div className="flex mb-2 items-center">
                      <p className="font-medium w-[15%]">End</p>
                      <div className="">
                        <SearchableDropdown
                          onDataChange={updateEndArticle}
                          temp={endArticle}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}

          {mode === "path" ? (
            <div className="">
              <div className="flex items-center justify-center bg-green-200 p-1">
                <span className="mr-2 text-blue-700 font-semibold">
                  Path Length
                </span>
                <input
                  className="text-center border rounded p-2"
                  type="number"
                  value={pathLength}
                  onChange={handlePathLength}
                  min="2"
                  step="1"
                  max="8"
                  placeholder="2"
                  aria-label="Positive integer input"
                />
              </div>

              <div className="bg-green-200 flex mt-2 mb-2 justify-center">
                <label htmlFor="directed" className="">
                  <input
                    type="checkbox"
                    id="directed"
                    value="directed"
                    checked={isPathDirected}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  <span className="font-semibold">Directed Path</span>
                </label>
              </div>

              <div className="items-center justify-center mb-2">
                <p className="text-center mb-2 bg-green-200 p-1 text-blue-700 font-semibold">
                  Path
                </p>

                <ul className="flex flex-col list-disc ml-12 max-h-36 overflow-y-auto">
                  <li className="mb-2 items-center justify-center list-item">
                    <div className="flex items-center">
                      <p className="w-[15%] font-medium">Start</p>
                      <div className="">
                        <SearchableDropdown
                          onDataChange={updateStartArticle}
                          temp={startArticle}
                        />
                      </div>
                    </div>
                  </li>

                  {Array.from({ length: pathLength - 2 }, (_, index) => (
                    <li
                      key={index}
                      className="mb-2 items-center justify-center list-item"
                    >
                      <div className="flex items-center">
                        <p className="w-[15%] font-medium">{index + 2}</p>
                        <div className="">
                          <SearchableDropdown
                            key={index}
                            onDataChange={updatePathArticles}
                            index={index}
                            temp={pathArticles[index]}
                          />
                        </div>
                      </div>
                    </li>
                  ))}

                  <li className="mb-2 items-center justify-center list-item">
                    <div className="flex items-center">
                      <p className="w-[15%] font-medium">End</p>
                      <div className="">
                        <SearchableDropdown
                          onDataChange={updateEndArticle}
                          temp={endArticle}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}

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
