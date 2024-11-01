import React, { useState, useEffect, useMemo } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils";

function SingleMode() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState(
    utils.defaultSingleplayerCustomizations
  );
  const [mode, setMode] = useState("");
  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({});
  const [pathLength, setPathLength] = useState(2);
  const [isPathDirected, setIsPathDirected] = useState(true);
  const [pathArticles, setPathArticles] = useState([]);
  const [timer, setTimer] = useState(0);

  const updateFirstArticle = (value) => setStartArticle(value);
  const updateEndArticle = (value) => setEndArticle(value);
  const handleModeChange = (event) => setMode(event.target.value);
  const handleBack = () => navigate(-1);

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(
        [utils.SINGLEPLAYER_CUSTOMIZATIONS],
        (result) => {
          const storedCustomizations =
            result[utils.SINGLEPLAYER_CUSTOMIZATIONS] ||
            utils.defaultSingleplayerCustomizations;
          // if(storedCustomizations) {
          //   setCustomizations(storedCustomizations);
          //   setMode(storedCustomizations.mode.type);
          //   setStartArticle(storedCustomizations.start);
          //   setEndArticle(storedCustomizations.end);
          //   setPathLength(storedCustomizations.mode.path.pathLength);
          //   setIsPathDirected(storedCustomizations.mode.path.directed);
          //   setPathArticles(storedCustomizations.mode.path.intermediate_links);
          //   setTimer(storedCustomizations.mode["count-down"].timer);
          // }
          setStates(storedCustomizations);
        }
      );
    } else {
      const storedCustomizations = utils.defaultSingleplayerCustomizations;
      setStates(storedCustomizations);
    }
  }, [isChromeExtension]);

  const setStates = (storedCustomizations) => {
    if (storedCustomizations) {
      setCustomizations(storedCustomizations);
      setMode(storedCustomizations.mode.type);
      setStartArticle(storedCustomizations.start);
      setEndArticle(storedCustomizations.end);
      setPathLength(storedCustomizations.mode.path.pathLength);
      setIsPathDirected(storedCustomizations.mode.path.directed);
      setPathArticles(storedCustomizations.mode.path.intermediate_links);
      setTimer(storedCustomizations.mode["count-down"].timer);
    }
  };

  const updatePathArticles = (value) => {
    if (value) {
      const idx = value.index;
      let temp = [...pathArticles];
      temp[idx] = value;
      setPathArticles(temp);
    }
  };

  const handlePathLength = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 8) {
      setPathLength(8);
    } else {
      setPathLength(value);
    }
    while (pathArticles.length > value - 2) {
      pathArticles.pop();
    }
    setPathArticles([...pathArticles]);
  };

  const handleTimer = (event) => {
    const value = parseInt(event.target.value, 10);
    setTimer(value);
  };

  const handleOptionChange = (event) => {
    setIsPathDirected(event.target.checked);
  };

  const handleSubmit = () => {
    const updatedCustomizations = {
      ...customizations,
      mode: {
        ...customizations.mode,
        type: mode,
        ...(mode === "path" && {
          path: {
            pathLength: pathLength,
            directed: isPathDirected,
            intermediate_links: pathArticles.map((item) =>
              item && item.suggestion ? item.suggestion : item
            ),
          },
        }),
        ...(mode === "count-down" && {
          "count-down": {
            timer: timer,
          },
        }),
      },
      start:
        startArticle && startArticle.suggestion
          ? startArticle.suggestion
          : startArticle,
      end:
        endArticle && endArticle.suggestion
          ? endArticle.suggestion
          : endArticle,
    };

    if (isChromeExtension) {
      chrome.storage.local.set({
        [utils.SINGLEPLAYER_CUSTOMIZATIONS]: updatedCustomizations,
      });
    }

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
                        onDataChange={updateFirstArticle}
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
            <div className="items-center justify-center m-2">
              <div className="flex items-center justify-center mr-2 mb-2 w-auto bg-purple-200 p-1">
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
                          onDataChange={updateFirstArticle}
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
              <div className="flex items-center justify-center bg-purple-200 p-1">
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
                <p className="text-center mb-2 bg-purple-200 p-1 text-blue-700 font-semibold">
                  Path
                </p>

                <ul className="flex flex-col list-disc ml-16">
                  <li className="mb-2 items-center justify-center list-item">
                    <div className="flex items-center">
                      <p className="w-[15%] font-medium">Start</p>
                      <div className="">
                        <SearchableDropdown
                          onDataChange={updateFirstArticle}
                          temp={startArticle}
                          className=""
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
                        <div className="ml-5">
                          <SearchableDropdown
                            key={index}
                            onDataChange={updatePathArticles}
                            index={index}
                            temp={
                              pathArticles[index] &&
                              pathArticles[index].suggestion
                                ? pathArticles[index].suggestion
                                : pathArticles[index]
                            }
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
      </div>
    </div>
  );
}

export default SingleMode;
