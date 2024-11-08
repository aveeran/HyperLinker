import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "@utils/utils";
import { defaultSingleplayerCustomizations } from "@utils/utils";

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
  const [pathError, setPathError] = useState(null);
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

  const validatePath = () => {
    if(isChromeExtension) {

      
      const mode = customizations.mode.type;
      if(mode === "normal" || mode == "path") {
        // ensuring that the articles themselves are valid
        const pathLength = customizations.mode.path.pathLength;

        // validating start article
        const startArticle = customizations.start;
        if(!startArticle.link) {
          return 1;
        }

        // validating connecting articles
        const intermediatePath = customizations.mode.path.intermediate_links;
        const intermediatePathLength = customizations.mode.path.intermediate_links.length+2;
        // what even is this one
        if(pathLength != intermediatePathLength) {
          return 2;
        }

        for(let i = 0; i < intermediatePath.length; i++) {
          if (intermediatePath[i].link === "") {
            return 3;
          }
        }

        // validating end article
        const endArticle = {title: customizations.end.title, link:customizations.end.link};

        if(!endArticle.link) {
          return 4;
        }

        // validating no duplicates
        const path = [startArticle, ...intermediatePath, endArticle];
        const objectStrings = path.map(item => JSON.stringify(item));
        const hasDuplicates = new Set(objectStrings).size !== objectStrings.length;
        if(hasDuplicates) {
          return 5;
        }
      }
    }
    return 0;
  }

  const handleSubmit = () => {
    if (isChromeExtension) {
      const validation = validatePath();
      switch(validation) {
        case 0: 
          chrome.runtime.sendMessage({ action: utils.START_SINGLEPLAYER });
          navigate("/singleplayer");
          break;
        case 1:
          setPathError("Invalid path. The start article has not been set with a valid article from the suggestions.")
          break;
        case 2: // Same behavior as case 3
        case 3:
          setPathError("Invalid path. At least one intermediate article has not been set with a valid article from the suggestions.")
          break;
        case 4:
          setPathError("Invalid path. The end article has not been set with a valid article from the suggestions.");
          break;
        case 5:
          setPathError("Invalid path. Currently, repeated articles are not supported.")
          break;
        default:
          setPathError("There was an unidentified error");
      }
    }
  };

 // 3 second cool-down on path
  useEffect(() => {
    if (pathError) {
      const timer = setTimeout(() => setPathError(null), 3000); 
      return () => clearTimeout(timer); 
    }
  }, [pathError]);

  return (
    <div className="relative pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
      {
        pathError && (
          <div 
          className="absolute bottom-2 left-0 right-0 bg-red-500 text-white text-center py-2 opacity-90"
          onClick={() => {setPathError(null)}}
          >{pathError}</div>
        )
      }
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

              {
                customizations.mode.path.pathLength > 2 && (
                  <div className="grid grid-cols-3 gap-4 p-1">
                    <strong className="text-base mr-1 col-span-1 text-center">
                      Intermediate Articles
                    </strong>

                    <p className="col-span-2">
                      {customizations.mode.path.intermediate_links.map(link=>link.title).join(", ")}
                    </p>
                  </div>
                )
              }

              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Directed</strong>
                <p className="col-span-2">
                  {customizations.mode.path.directed ? "true" : "false"}
                </p>
                <button
                data-key="mode"
                className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
                onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
              >
                Edit
              </button>
              </div>
            </>
          ) : null}

          {customizations.mode.type === "count-down" ? (
            <div className="grid grid-cols-3 gap-4 p-1">
              <strong className="text-base mr-1 col-span-1">Timer</strong>
              <p className="col-span-2">
                {customizations.mode["count-down"].timer}
              </p>
            <button
                data-key="mode"
                className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
                onClick={(e) => handleEdit(e.target.getAttribute("data-key"))}
              >
                Edit
              </button>
            </div>
          ) : null}
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
