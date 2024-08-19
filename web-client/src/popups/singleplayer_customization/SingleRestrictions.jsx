import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// we need to get constant values and mappings

const defaultRestrictions = [
  "no-opening-para",
  "no-find",
  "no-back",
  "no-category",
  "no-dates",
  "no-countries",

]

function SingleRestrictions() {
  const navigate = useNavigate();
  const [availableRestrictions, setAvailableRestrictions] = useState([]);
  const [chosenRestrictions, setChosenRestrictions] = useState([]);

  useEffect(() => {
    // Retrieve customizations from chrome.storage.local
    chrome.storage.local.get('singleplayer-customizations', (result) => {
      let customizations = {};
      if (result['singleplayer-customizations']) {
        customizations = result['singleplayer-customizations'];
      }

      setAvailableRestrictions(defaultRestrictions.filter(element => !customizations.restrictions.includes(element)));
      setChosenRestrictions(customizations.restrictions || []);
    });
  }, []);

  const handleDragStart = (e, restriction, sourceWidget) => {
    e.dataTransfer.setData("tile", restriction);
    e.dataTransfer.setData("sourceBox", sourceWidget);
  };

  const handleDrop = (e, destinationWidget) => {
    const tile = e.dataTransfer.getData("tile");
    const sourceBox = e.dataTransfer.getData("sourceBox");

    e.preventDefault();

    if (sourceBox === "available" && destinationWidget === "chosen") {
      setAvailableRestrictions(availableRestrictions.filter((t) => t !== tile));
      setChosenRestrictions([...chosenRestrictions, tile]);
    } else if (sourceBox === "chosen" && destinationWidget === "available") {
      setChosenRestrictions(chosenRestrictions.filter((t) => t !== tile));
      setAvailableRestrictions([...availableRestrictions, tile]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    chrome.storage.local.get('singleplayer-customizations', (result) => {
      let customizations = result['singleplayer-customizations'] || {};
      customizations.restrictions = chosenRestrictions;
      chrome.storage.local.set({ 'singleplayer-customizations': customizations });
      handleBack();
    });
  };

  return (
    <div>
       <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">
        Singleplayer - Customization
      </h2>
      <div className="flex flex-col items-center">
      <p className="text-center mb-3">Restrictions</p>

        <div className="flex gap-8 m-3">
          <div
            className="w-44 p-4 border border-gray-500"
            onDrop={(e) => handleDrop(e, "available")}
            onDragOver={handleDragOver}
          >
            <h2 className="text-center mb-4">Box A</h2>
            <div className="flex flex-col gap-2">
              {availableRestrictions.map((tile) => (
                <div
                  key={tile}
                  className="bg-blue-200 p-2 text-center rounded shadow-md cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile, "available")}
                >
                  {tile}
                </div>
              ))}
            </div>
          </div>

          <div
            className="w-44 p-4 border border-gray-500"
            onDrop={(e) => handleDrop(e, "chosen")}
            onDragOver={handleDragOver}
          >
            <h2 className="text-center mb-4">Box B</h2>
            <div className="flex flex-col gap-2">
              {chosenRestrictions.map((tile) => (
                <div
                  key={tile}
                  className="bg-green-200 p-2 text-center rounded shadow-md cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile, "chosen")}
                >
                  {tile}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <button className="bg-gray-500 text-white py-2 px-4 rounded mr-3" onClick={handleBack}>
            Return
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleRestrictions;
