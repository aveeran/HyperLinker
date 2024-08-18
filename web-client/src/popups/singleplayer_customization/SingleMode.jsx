import React, { useState, useEffect, useRef } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { useNavigate } from "react-router-dom";


// add validation to check if all required has been selected
const defaultCustomizations = {
  mode: "normal",
  path: {
    "path length": 0,
    links: [],
    "directed path": false,
  },
  "count down": 0,
  start: {
    title: "",
    link: ""
  },
  end: {
    title: "",
    link: ""
  },
  track: ["clicks", "time"],
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



  const [mode, setMode] = useState(customizations.mode);
  
  const [startArticle, setStartArticle] = useState(customizations.start);
  const [endArticle, setEndArticle] = useState(customizations.end);

  const [pathLength, setPathLength] = useState(customizations.path["path length"]);
  const [isPathDirected, setIsPathDirected] = useState(customizations.path["directed path"]);
  const [pathArticles, setPathArticles] = useState(customizations.path.links);
  const [timer, setTimer] = useState(0);

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
      const idx = mode === "path" ? value.index - 1 : value.index;
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
  };

  const handleSubmit = () => {
    const storedCustomizations = localStorage.getItem('singleplayer-customizations');
    let customizations = JSON.parse(storedCustomizations);
    customizations.mode = mode;

    if(mode === "path") {
      customizations.path["path length"] = pathLength;
      customizations.path["directed path"] = isPathDirected;
      customizations.path.links = pathArticles;
    }

    if(mode === "count down") {
      customizations["count down"] = timer;
    }

    const send = JSON.stringify(customizations);
    localStorage.setItem('singleplayer-customizations', send);
    console.log(customizations);
    navigate(-1);
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
          <option value="count-down">Count-Down</option>
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

        {mode === "count-down" ? (
          <div className="flex items-center justify-center">
            <input
              className="text-center"
              type="number"
              value={timer}
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
                index={index + 1}
                temp={pathArticles[index].suggestion}
              />
            ))}
            <SearchableDropdown onDataChange={updateEndArticle} />
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
