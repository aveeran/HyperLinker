import React, { useState, useEffect, useRef } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";

function SingleMode() {
  const [mode, setMode] = useState("normal");

  const [startArticle, setStartArticle] = useState({});
  const [endArticle, setEndArticle] = useState({});

  const [pathLength, setPathLength] = useState(2);
  const [isPathDirected, setIsPathDirected] = useState(false);
  const [pathArticles, setPathArticles] = useState([]);



  const updateFirstArticle = (value) => {
    setStartArticle(value);
  };

  const updateEndArticle = (value) => {
    setEndArticle(value);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
    console.log(mode);
  };

  const updatePathArticles = (value) => {
    const newPathArticles = [
      ...pathArticles.slice(0, value.index),
      value,
      ...pathArticles.splice(value.index)
    ]

    setPathArticles(newPathArticles)
  }

  const handlePathLength = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      const updatedPathArticles = Array.from({ length: value }, (_, index) => ({
        title: '',
        link: '',
        index: index + 1
      }));
      
      setPathLength(value);
      setPathArticles(updatedPathArticles);
    }
  }

  const test = () => {
    console.log(startArticle);
    console.log(endArticle);

    for(let i = 0; i < pathLength -2 ; i++) {
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
        <p className="text-center">Mode</p>
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
          <option value="hitler">Hitler</option>
          <option value="jesus">Jesus</option>
          <option value="path">Path</option>
          <option value="random">Random</option>
        </select>
        {mode === "normal" ? (
          <div>
            <SearchableDropdown onDataChange={updateFirstArticle} />
            <SearchableDropdown onDataChange={updateEndArticle} />
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
            placeholder="2"
            aria-label="Positve integer input"/>

            <SearchableDropdown onDataChange={updateFirstArticle} />
            {
              Array.from({ length: pathLength - 2 }, (_, index) => (
                <SearchableDropdown
                  key={index}
                  onDataChange={updatePathArticles}
                  index={index}
                />
              ))
            }
            <SearchableDropdown onDataChange={updateEndArticle} />


          </div>
        ) : null}
       





      </div>

      <div className="flex justify-center mb-3">
        <button
          className="flex bg-green-400 text-white px-4 py-2 rounded"
          onClick={test}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default SingleMode;
