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
        // if (storedCustomizations) {
        //   setCustomizations(storedCustomizations);
        //   setAvailableRestrictions(
        //     defaultRestrictions.filter(
        //       (element) => !storedCustomizations.restrictions.includes(element)
        //     )
        //   );
        //   setChosenRestrictions(storedCustomizations.restrictions);
        // }
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
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">
        Singleplayer - Customization
      </h2>
      <hr className="m-5" />
      <div className="flex flex-col items-center">
        <p className="text-center mb-3">Restrictions</p>

        <div className="flex gap-8 m-3">
          <div
            className="w-44 p-4 border border-gray-500"
            onDrop={(e) => handleDrop(e, "available")}
            onDragOver={handleDragOver}
          >
            <h2 className="text-center mb-4">Available</h2>
            <div className="flex flex-col gap-2">
              {availableRestrictions.map((tile) => (
                <div
                  key={tile}
                  className="bg-gray-200 p-2 text-center rounded shadow-md cursor-pointer"
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
            <h2 className="text-center mb-4">Chosen</h2>
            <div className="flex flex-col gap-2">
              {chosenRestrictions.map((tile) => (
                <div
                  key={tile}
                  className="bg-blue-200 p-2 text-center rounded shadow-md cursor-pointer"
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
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded mr-3"
            onClick={handleBack}
          >
            Return
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleRestrictions;
