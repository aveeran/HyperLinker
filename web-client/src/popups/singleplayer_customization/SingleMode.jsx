import React, { useState, useEffect, useRef } from "react";

function SingleMode() {
  const [mode, setMode] = useState("normal");
  // const [start, setStart] = useState('');
  // const [end, setEnd] = useState('');

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);
  const [test, setTest] = useState(true);

  useEffect(() => {
    if (query.length > 2) {
      // Fetch suggestions if query length is greater than 2
      if(test) {
          fetchSuggestions(query);
          setTest(false);
      }
      setTest(true);
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
      );
      const data = await response.json();
      const articles = data.query.search.map((article) => article.title);
      setSuggestions(articles);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setTest(false);
    setQuery(suggestion);
    setIsDropdownVisible(false);
  };



  const handleModeChange = (event) => {};
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
        </select>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            placeholder="Search Wikipedia..."
            ref={inputRef}
          />
          {isDropdownVisible && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <button className="flex bg-green-400 text-white px-4 py-2 rounded">
          Start
        </button>
      </div>

      
    </div>
  );
}

export default SingleMode;
