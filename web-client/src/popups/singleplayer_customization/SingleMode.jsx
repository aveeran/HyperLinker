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
  let storedCustomizations = localStorage.getItem("singleplayer-customizations");
  let customizations = {};
  if(storedCustomizations) {
    customizations = JSON.parse(storedCustomizations);
  } else {
    customizations = defaultCustomizations;
  }

  const [mode, setMode] = useState(customizations.mode.type);
  
  const [startArticle, setStartArticle] = useState(customizations.start);
  const [endArticle, setEndArticle] = useState(customizations.end);

  const [pathLength, setPathLength] = useState(customizations.mode.path.pathLength);
  const [isPathDirected, setIsPathDirected] = useState(customizations.mode.path.directed);
  const [pathArticles, setPathArticles] = useState(customizations.mode.path.intermediate_links);
  const [timer, setTimer] = useState(customizations.mode.countDown.timer);

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
  }

  const updatePathArticles = (value) => {
    if (value) {
      const idx = mode === "path" ? value.index : value.index;
      let temp = pathArticles;
      temp[idx] = value;
      setPathArticles(temp);
    }

  };

  const handlePathLength = (event) => {
    const value = parseInt(event.target.value, 10);
    if(value > 8) {
      setPathLength(8);
    } else {
      setPathLength(value);
    }

    while(pathArticles.length> value - 2) {
      pathArticles.pop();
    }

  };

  const handleTimer = (event) => {
    const value = parseInt(event.target.value, 10);
    setTimer(value);
  }

  const handleSubmit = () => {
    const storedCustomizations = localStorage.getItem('singleplayer-customizations');
    let customizations = JSON.parse(storedCustomizations);
    customizations.mode.type = mode;
    customizations.start = startArticle && startArticle.suggestion ? startArticle.suggestion : startArticle;
    customizations.end = endArticle && endArticle.suggestion ? endArticle.suggestion : endArticle;

    if(mode === "path") {
      customizations.mode.path.pathLength = pathLength;
      customizations.mode.path.directed = isPathDirected;
      customizations.mode.path.intermediate_links = pathArticles.map(item => item && item.suggestion ? item.suggestion : item);
    } 

    if(mode === "countDown") {
      customizations.mode.countDown.timer = timer;
    }

    const send = JSON.stringify(customizations);
    localStorage.setItem('singleplayer-customizations', send);
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
