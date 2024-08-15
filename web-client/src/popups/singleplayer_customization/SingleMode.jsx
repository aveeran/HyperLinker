import React, { useState, useEffect, useRef } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { useNavigate } from "react-router-dom";

function SingleMode() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("normal");

  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({});

  const [pathLength, setPathLength] = useState(2);
  const [isPathDirected, setIsPathDirected] = useState(false);
  const [pathArticles, setPathArticles] = useState([]);
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

  const test = () => {
    console.log(startArticle);
    console.log(endArticle);

    console.log("here");
    for (let i = 0; i < pathArticles.length; i++) {
      console.log(pathArticles[i]);
    }
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
            <SearchableDropdown onDataChange={updateFirstArticle} />
            <SearchableDropdown onDataChange={updateEndArticle} />
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
            <SearchableDropdown onDataChange={updateFirstArticle} />
            {Array.from({ length: pathLength - 2 }, (_, index) => (
              <SearchableDropdown
                key={index}
                onDataChange={updatePathArticles}
                index={index + 1}
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
          onClick={test}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SingleMode;
