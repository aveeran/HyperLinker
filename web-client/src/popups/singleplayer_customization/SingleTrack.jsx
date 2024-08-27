import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { defaultSingleplayerCustomizations } from "@utils/utils";

function SingleTrack() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState(
    defaultSingleplayerCustomizations
  );
  const [track, setTrack] = useState("clicks");

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    chrome.storage.local.get("singleplayer-customizations", (result) => {
      const storedCustomizations = result["singleplayer-customizations"];
      if (storedCustomizations) {
        setCustomizations(storedCustomizations);
        setTrack(storedCustomizations.track[0]);
      }
    });
  }, [isChromeExtension]);

  const handleOptionChange = (event) => {
    setTrack(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedCustomiztions = {
      ...customizations,
      track: [track],
    };

    chrome.storage.local.set({
      "singleplayer-customizations": updatedCustomiztions,
    });
    handleBack();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">
        Singleplayer - Customization
      </h2>
      <div className="flex flex-col items-center justify-center border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center mb-3">Tracking</p>
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col mb-4">
            <label htmlFor="clicks" className="mr-4">
              <input
                type="radio"
                id="clicks"
                name="tracking"
                value="clicks"
                checked={track === "clicks"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <span>Clicks</span>
            </label>
            <label htmlFor="time" className="mr-4">
              <input
                type="radio"
                id="time"
                name="tracking"
                value="time"
                checked={track === "time"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <span>Time</span>
            </label>
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
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SingleTrack;
