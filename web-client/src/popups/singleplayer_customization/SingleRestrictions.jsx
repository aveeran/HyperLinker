import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils";

const defaultRestrictions = [
  "no-opening-para",
  "no-find",
  "no-back",
  "no-dates",
  "same-page-link",
  "no-popups"
]

function SingleRestrictions() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState(
    utils.defaultSingleplayerCustomizations
  );
  const [availableRestrictions, setAvailableRestrictions] =
    useState(defaultRestrictions);
  const [chosenRestrictions, setChosenRestrictions] = useState([]);

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([utils.SINGLEPLAYER_CUSTOMIZATIONS], (result) => {
        const storedCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS];
        setStates(storedCustomizations);
      });
    } else {
      const storedCustomizations = utils.defaultSingleplayerCustomizations;
      setStates(storedCustomizations);
    }
  }, [isChromeExtension]);

  const setStates = (storedCustomizations) => {
    if (storedCustomizations) {
      setCustomizations(storedCustomizations);
      setAvailableRestrictions(
        defaultRestrictions.filter(
          (element) => !storedCustomizations.restrictions.includes(element)
        )
      );
      setChosenRestrictions(storedCustomizations.restrictions);
    }
  }



  const handleDragStart = (e, restriction, sourceWidget) => {
    console.log(`Dragging ${restriction} from ${sourceWidget}`); // Debugging log
    e.dataTransfer.setData("tile", restriction);
    e.dataTransfer.setData("sourceBox", sourceWidget);
  };

  const handleDrop = (e, destinationWidget) => {
    e.preventDefault();
    const tile = e.dataTransfer.getData("tile");
    const sourceBox = e.dataTransfer.getData("sourceBox");

    console.log(`Dropping ${tile} from ${sourceBox} to ${destinationWidget}`); // Debugging log



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
    const updatedCustomizations = {
      ...customizations,
      restrictions: chosenRestrictions,
    };

    chrome.storage.local.set({
      [utils.SINGLEPLAYER_CUSTOMIZATIONS]: updatedCustomizations,
    });
    handleBack();
  };

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>

      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-xl text-center font-medium bg-blue-200 p-1 mb-1">
          Singleplayer
        </p>
        <p className="text-center font-medium text-base bg-slate-200 ">Customizations</p>
        <hr className="border-t-1 border-black m-3" />
        <p className="text-center font-medium text-base bg-purple-200 mb-1">Restrictions</p>

        <div className="flex gap-0 justify-center p-1 m-1">
          <div className="flex-1 border-r-2 border-dotted border-gray-600">
            <div className="flex flex-col items-center">
              Available
            </div>

          </div>
          <div className="flex-1 flex-col items-center">
          <div className="flex flex-col items-center">
              Chosen
            </div>
          </div>
        </div>

        <p className="text-center font-medium text-base bg-purple-200">Options</p>

        
        <div className="flex gap-0 justify-center p-1 m-1"
        onDragOver={handleDragOver}>
          <div className="flex-1 border-r-2 border-dotted border-gray-600"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "available")}
        
          >
            <div className="p-2">
              <div className="flex flex-col gap-2">
                {availableRestrictions.map((tile) => (
                  <div 
                  key={tile}
                  className="bg-gray-200 p-2 text-center rounded shadow-md cursor-pointer"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, tile, "available")}
                  > {tile}
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div className="flex-1 flex-col items-center"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "chosen")}
          >
          <div className="p-2">
              <div className="flex flex-col gap-2">
                {chosenRestrictions.map((tile) => (
                  <div 
                  key={tile}
                  className="bg-gray-200 p-2 text-center rounded shadow-md cursor-pointer"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, tile, "chosen")}
                  > {tile}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      
      </div>


        <div className="flex justify-center mb-3">
          <button
            className="bg-gray-500 font-custom text-white py-2 px-4 rounded mr-3"
            onClick={handleBack}
          >
            Return
          </button>
          <button
            type="submit"
            className="bg-blue-500 font-custom text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
    </div>
  );
}

export default SingleRestrictions;
