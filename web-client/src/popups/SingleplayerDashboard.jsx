import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils";

const keyCategory = {
  "/singleplayer_dashboard/singleplayer_customization/mode": [
    "mode",
    "start",
    "end",
    "path",
    "count down",
  ],
  "/singleplayer_dashboard/singleplayer_customization/track": ["track"],
  "/singleplayer_dashboard/singleplayer_customization/restrictions": [
    "restrictions",
  ],
};

const getCategory = (value) => {
  for (const [key, values] of Object.entries(keyCategory)) {
    if (values.includes(value)) {
      return key;
    }
  }
  return null;
};

function SingleplayerDashboard() {
  const [customizations, setCustomizations] = useState(
    utils.defaultSingleplayerCustomizations
  );
  const navigate = useNavigate();

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(
        [utils.SINGLEPLAYER_CUSTOMIZATIONS],
        (result) => {
          const storedCustomizations =
            result[utils.SINGLEPLAYER_CUSTOMIZATIONS];
          if (storedCustomizations) {
            setCustomizations(storedCustomizations);
          }
        }
      );
    } else {
      setCustomizations(utils.defaultSingleplayerCustomizations);
    }
  }, [isChromeExtension]);

  const reset = () => {
    setCustomizations(utils.defaultSingleplayerCustomizations);
    if (isChromeExtension) {
      chrome.storage.local.set({
        [utils.SINGLEPLAYER_CUSTOMIZATIONS]: customizations,
      });
    }
  };

  const sortedEntries = Object.entries(customizations).sort(
    ([keyA], [keyB]) => {
      const order = [
        "mode",
        "start",
        "end",
        "path",
        "count down",
        "track",
        "restrictions",
      ];
      return order.indexOf(keyA) - order.indexOf(keyB);
    }
  );

  const handleEdit = (value) => {
    const categoryKey = getCategory(value);
    if (categoryKey) {
      navigate(categoryKey);
    } else {
      console.error("Error: Category not found for value:", value);
    }
  };

  const handleSubmit = () => {
    if (isChromeExtension) {
      chrome.runtime.sendMessage({ action: utils.START_SINGLEPLAYER });
    }
    navigate("/singleplayer");
  };

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="font-medium text-xl text-center bg-sky-200 p-1 mb-1">
          Singleplayer
        </p>
        <p className="text-center font-medium text-base bg-slate-200">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-5" />

        <div>
          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Start Article</strong>
            <p className="col-span-2">{customizations.start.title}</p>
            <button
              data-key="start"
              className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
            >
              Edit
            </button>
          </div>

          <div key="end" className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">End Article</strong>
            <p className="col-span-2">{customizations.end.title}</p>
            <button
              data-key="end"
              className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
            >
              Edit
            </button>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Tracking</strong>
            <p className="col-span-2">{customizations.track[0]}</p>
            <button
              data-key="track"
              className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
            >
              Edit
            </button>
          </div>

          <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Restrictions</strong>
            <p className="col-span-2">
              {customizations.restrictions.join(" · ")}
            </p>
            <button
              data-key="restrictions"
              className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="">
          <p className="text-center font-bold text-base bg-sky-200">Mode</p>
          <div className="group relative">
          <div className="grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Type</strong>
            <p className="col-span-2">{customizations.mode.type}</p>
          </div>

          {customizations.mode.type === "path" ? (
            <>
              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">
                  Path Length
                </strong>
                <p className="col-span-2">
                  {customizations.mode.path.pathLength}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1 text-center">
                  Intermediate Articles
                </strong>

                <p className="col-span-2">
                  {customizations.mode.path.intermediate_links.join(", ")}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Directed</strong>
                <p className="col-span-2">
                  {customizations.mode.path.directed ? "true" : "false"}
                </p>
              </div>
            </>
          ) : null}

          {customizations.mode.type === "count-down" ? (
            <div className="grid grid-cols-3 gap-4 p-1">
              <strong className="text-base mr-1 col-span-1">Timer</strong>
              <p className="col-span-2">
                {customizations.mode["count-down"].timer}
              </p>
            </div>
          ) : null}
          <button
              data-key="mode"
              className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
            >
              Edit
            </button>
          </div>
          
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <button
          className="flex bg-gray-400 text-white px-4 py-2 rounded mr-2 font-custom"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="flex bg-green-400 text-white px-4 py-2 rounded font-custom"
          onClick={handleSubmit}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default SingleplayerDashboard;
