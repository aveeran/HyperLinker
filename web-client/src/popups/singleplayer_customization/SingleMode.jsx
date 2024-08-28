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
      chrome.storage.local.get([utils.SINGLEPLAYER_CUSTOMIZATIONS], (result) => {
        const storedCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS] || utils.defaultSingleplayerCustomizations;
        if(storedCustomizations) {
          setCustomizations(storedCustomizations);
          setMode(storedCustomizations.mode.type);
          setStartArticle(storedCustomizations.start);
          setEndArticle(storedCustomizations.end);
          setPathLength(storedCustomizations.mode.path.pathLength);
          setIsPathDirected(storedCustomizations.mode.path.directed);
          setPathArticles(storedCustomizations.mode.path.intermediate_links);
          setTimer(storedCustomizations.mode["count-down"].timer);
        }
      });
    }
  }, [isChromeExtension]);

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

    chrome.storage.local.set({
      [utils.SINGLEPLAYER_CUSTOMIZATIONS]: updatedCustomizations,
    });

    handleBack();
  };

  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">
        Singleplayer - Customization
      </h2>
      <hr />
      <div className=" p-1.5 m-3">
        <p className="text-center mb-3">
          {" "}
          <strong>Mode</strong>
        </p>
        <select
          value={mode}
          onChange={handleModeChange}
          className="block mx-auto p-2 border rounded mb-3"
        >
          <option value="" disabled>
            Select a mode
          </option>
          <option value="normal">Normal</option>
          <option value="count-down">Count-Down</option>
          <option value="path">Path</option>
          <option value="hitler">Hitler</option>
          <option value="jesus">Jesus</option>
          <option value="random">Random</option>
        </select>
        {mode === "normal" ? (
          <div className="flex flex-col border-gray border-2 border-solid p-2 mb-2">
            <div className="flex mb-2 items-center">
              <p className="w-[15%]">Start</p>
              <div className="ml-5">
                <SearchableDropdown
                  onDataChange={updateFirstArticle}
                  temp={startArticle}
                />
              </div>
            </div>
            <div className="flex mb-2 items-center">
              <p className="w-[15%]">End</p>
              <div className="ml-5">
                <SearchableDropdown
                  onDataChange={updateEndArticle}
                  temp={endArticle}
                />
              </div>
            </div>
          </div>
        ) : null}

        {mode === "count-down" ? (
          <div className="items-center justify-center m-2">
            <div className="flex items-center justify-center mr-2 mb-2 w-auto">
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
              <span>seconds</span>
            </div>

            <div className="flex flex-col border-gray border-2 border-solid p-2 mb-2">
              <div className="flex mb-2 items-center">
                <p className="w-[15%]">Start</p>
                <div className="ml-5">
                  <SearchableDropdown
                    onDataChange={updateFirstArticle}
                    temp={startArticle}
                  />
                </div>
              </div>
              <div className="flex mb-2 items-center">
                <p className="w-[15%]">End</p>
                <div className="ml-5">
                  <SearchableDropdown
                    onDataChange={updateEndArticle}
                    temp={endArticle}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {mode === "path" ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <span className="mr-2">Path Length</span>
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

            <div className="flex items-center justify-center p-2">
              <label htmlFor="directed" className="">
                <input
                  type="checkbox"
                  id="directed"
                  value="directed"
                  checked={isPathDirected}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <span>Directed Path</span>
              </label>
            </div>

            <div className="items-center justify-center mb-2 border-gray border-2 border-solid p-2">
              <p className="text-center mb-2">Path Links</p>

              <div className="flex flex-col">
                <div className="flex mb-2 items-center">
                  <p className="w-[15%]">Start </p>
                  <div className="ml-5">
                    <SearchableDropdown
                      onDataChange={updateFirstArticle}
                      temp={startArticle}
                      className=""
                    />
                  </div>
                </div>

                {Array.from({ length: pathLength - 2 }, (_, index) => (
                  <div key={index} className="flex mb-2 items-center">
                    <p className="w-[15%]">{index + 2}</p>
                    <div className="ml-5">
                      <SearchableDropdown
                        key={index}
                        onDataChange={updatePathArticles}
                        index={index}
                        temp={
                          pathArticles[index] && pathArticles[index].suggestion
                            ? pathArticles[index].suggestion
                            : pathArticles[index]
                        }
                      />
                    </div>
                  </div>
                ))}
                <div className="flex mb-2 items-center">
                  <p className="w-[15%]">End</p>
                  <div className="ml-5">
                    <SearchableDropdown
                      onDataChange={updateEndArticle}
                      temp={endArticle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {mode === "hitler" ? (
          <div className="flex flex-col items-center justify-center">
            <SearchableDropdown onDataChange={updateFirstArticle} />
            <div className="relative">
              <input
                type="text"
                value={"Hitler"}
                readOnly
                className="p-2 border rounded w-full"
                placeholder="Search Wikipedia..."
              />
            </div>
          </div>
        ) : null}

        {mode === "jesus" ? (
          <div className="flex flex-col items-center justify-center">
            <SearchableDropdown onDataChange={updateFirstArticle} />
            <div className="relative">
              <input
                type="text"
                value={"Jesus"}
                readOnly
                className="p-2 border rounded w-full"
                placeholder="Search Wikipedia..."
              />
            </div>
          </div>
        ) : null}

        {mode === "random" ? <div></div> : null}

        <div className="flex justify-center mb-3">
          <button
            className="flex bg-gray-400 text-white px-4 py-2 rounded mr-3"
            onClick={handleBack}
          >
            Return
          </button>
          <button
            className="flex bg-blue-400 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleMode;
