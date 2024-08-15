import React, { useState } from "react";

// we need to get constant values and mappings

function SingleRestrictions() {
  const [availableRestrictions, setAvaiableRestrictions] = useState([
    "no opening paragraph",
    "no-find",
    "no-back",
    "no-category",
    "no-dates",
    "no-countries",
  ]);
  const [chosenRestrictions, setChosenRestrictions] = useState([]);

  const handleDragStart = (e, restriction, sourceWidget) => {
    e.dataTransfer.setData("tile", restriction);
    e.dataTransfer.setData("sourceBox", sourceWidget);
  };

  const handleDrop = (e, destinationWidget) => {
    const tile = e.dataTransfer.getData("tile");
    const sourceBox = e.dataTransfer.getData("sourceBox");

    e.preventDefault();

    if (sourceBox === "available" && destinationWidget === "chosen") {
      setAvaiableRestrictions(availableRestrictions.filter((t) => t !== tile));
      setChosenRestrictions([...chosenRestrictions, tile]);
    } else if (sourceBox === "chosen" && destinationWidget === "available") {
      setChosenRestrictions(chosenRestrictions.filter((t) => t !== tile));
      setAvaiableRestrictions([...availableRestrictions, tile]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center">
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
      <button className="flex bg-green-400 text-white px-4 py-2 rounded mb-3">submit</button>
    </div>
  );
}

export default SingleRestrictions;
