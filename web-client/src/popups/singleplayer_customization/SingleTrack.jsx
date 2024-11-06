import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils";

function SingleTrack() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState(
    utils.defaultSingleplayerCustomizations
  );
  const [track, setTrack] = useState("clicks");

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if(isChromeExtension) {
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
      setTrack(storedCustomizations.track[0]);
    }
  }

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
      [utils.SINGLEPLAYER_CUSTOMIZATIONS]: updatedCustomiztions,
    });
    handleBack();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pt-3 p-1">
      <h1 className="text-4xl text-center mb-3 font-custom">HyperLinker</h1>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-xl font-medium text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>
        <p className="text-center font-medium text-base bg-slate-200">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-3" />

        <p className="text-center bg-purple-200 font-medium p-1 mb-1">Tracking</p>
        <form onSubmit={handleSubmit} id="tracking" className="flex flex-col items-center">
          <div className="flex flex-col mb-1">
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
          
        </form>
      </div>

      <div className="flex justify-center mb-3">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded mr-3 font-custom"
              onClick={handleBack}
              form={"tracking"}
            >
              Return
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded font-custom"
              form="tracking"
            >
              Submit
            </button>
          </div>

    </div>
  );
}

export default SingleTrack;
