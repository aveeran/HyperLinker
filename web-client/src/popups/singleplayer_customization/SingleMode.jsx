import React, { useState, useEffect, useRef } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { useNavigate } from "react-router-dom";

// add validation to check if all required has been selected

const defaultCustomizations = {
  mode: {
    type: "path",
    path: {
      pathLength: 2,
      directed: true,
      intermediate_links: [],
    },
    countDown: {
      timer: 0,
    },
  },
  start: {
    title: "",
    link: "",
  },
  end: {
    title: "",
    end: "",
  },
  track: ["clicks"],
  restrictions: [
    "no-opening-para",
    "no-find",
    "no-back",
    "no-category",
    "no-dates",
  ],
};

function SingleMode() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState({});
  const [mode, setMode] = useState("");
  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({});
  const [pathLength, setPathLength] = useState(2);
  const [isPathDirected, setIsPathDirected] = useState(true);
  const [pathArticles, setPathArticles] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Retrieve customizations from chrome.storage.local
    chrome.storage.local.get('singleplayer-customizations', (result) => {
      if (result['singleplayer-customizations']) {
        const storedCustomizations = result['singleplayer-customizations'];
        setCustomizations(storedCustomizations);
        setMode(storedCustomizations.mode.type);
        setStartArticle(storedCustomizations.start);
        setEndArticle(storedCustomizations.end);
        setPathLength(storedCustomizations.mode.path.pathLength);
        setIsPathDirected(storedCustomizations.mode.path.directed);
        setPathArticles(storedCustomizations.mode.path.intermediate_links);
        setTimer(storedCustomizations.mode.countDown.timer);
      } else {
        setCustomizations(defaultCustomizations);
        setMode(defaultCustomizations.mode.type);
        setStartArticle(defaultCustomizations.start);
        setEndArticle(defaultCustomizations.end);
        setPathLength(defaultCustomizations.mode.path.pathLength);
        setIsPathDirected(defaultCustomizations.mode.path.directed);
        setPathArticles(defaultCustomizations.mode.path.intermediate_links);
        setTimer(defaultCustomizations.mode.countDown.timer);
        chrome.storage.local.set({ 'singleplayer-customizations': defaultCustomizations });
      }
    });
  }, []);

  const updateFirstArticle = (value) => {
    setStartArticle(value);
  };

  const updateEndArticle = (value) => {
    setEndArticle(value);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleBack = () => {
    navigate(-1);
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
    setPathArticles([...pathArticles]); // Update state with new array reference
  };

  const handleTimer = (event) => {
    const value = parseInt(event.target.value, 10);
    setTimer(value);
  };

  const handleOptionChange = (event) => {
    setIsPathDirected(event.target.value === 'directed');
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
            intermediate_links: pathArticles.map(item => item && item.suggestion ? item.suggestion : item),
          },
        }),
        ...(mode === "countDown" && {
          countDown: {
            timer: timer,
          },
        }),
      },
      start: startArticle && startArticle.suggestion ? startArticle.suggestion : startArticle,
      end: endArticle && endArticle.suggestion ? endArticle.suggestion : endArticle,
    };
    
    chrome.storage.local.set({ 'singleplayer-customizations': updatedCustomizations });
    handleBack();
  };
  
  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">
        Singleplayer - Customization
      </h2>
      <div className="border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center mb-3">Mode</p>
        <select
          value={mode}
          onChange={handleModeChange}
          className="block mx-auto p-2 border rounded mb-3"
        >
          <option value="" disabled>
            Select a mode
          </option>
          <option value="normal">Normal</option>
          <option value="countDown">Count-Down</option>
          <option value="path">Path</option>
          <option value="hitler">Hitler</option>
          <option value="jesus">Jesus</option>
          <option value="random">Random</option>
        </select>
        {mode === "normal" ? (
          <div>
            <SearchableDropdown onDataChange={updateFirstArticle} temp={startArticle} />
            <SearchableDropdown onDataChange={updateEndArticle} temp={endArticle}/>
          </div>
        ) : null}

        {mode === "countDown" ? (
          <div className="flex items-center justify-center">
            <input
              className="text-center"
              type="number"
              value={timer}
              onChange={handleTimer}
              min="1"
              step="1"
              placeholder="1"
              aria-label="Count-down timer"
            />
            <p>s</p>
          </div>
        ) : null}

        {mode === "path" ? (
          <div className="flex flex-col items-center justify-center">
            <input
              className="text-center"
              type="number"
              value={pathLength}
              onChange={handlePathLength}
              min="2"
              step="1"
              max="8"
              placeholder="2"
              aria-label="Positve integer input"
            />

            <div className="flex flex-col mb-4">
              <label htmlFor="directed" className="mr-4">
                <input 
                type="radio"
                id="directed"
                value="directed"
                checked={isPathDirected}
                onChange={handleOptionChange}
                className="mr-2"
                />
                <span>Directed</span>
              </label>

              <label htmlFor="undirected">
                <input 
                type="radio"
                id="undirected"
                value="undirected"
                checked={!isPathDirected}
                onChange={handleOptionChange}
                className="mr-2"
                />
                <span>Undirected</span>
              </label>
            </div>

            <SearchableDropdown onDataChange={updateFirstArticle} temp={startArticle}/>
            {Array.from({ length: pathLength - 2 }, (_, index) => (
              <SearchableDropdown
                key={index}
                onDataChange={updatePathArticles}
                index={index}
                temp={pathArticles[index] && pathArticles[index].suggestion ? pathArticles[index].suggestion : pathArticles[index]}
              />
            ))}
            <SearchableDropdown onDataChange={updateEndArticle} temp={endArticle} />
          </div>
        ) : null}
      </div>

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

      {mode === "random" ? (
        <div>

        </div>
      ) : null}

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
  );
}

export default SingleMode;
