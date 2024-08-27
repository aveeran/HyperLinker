import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    defaultSingleplayerCustomizations
  );
  const navigate = useNavigate();

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
      }
    });
  });

  const reset = () => {
    setCustomizations(defaultSingleplayerCustomizations);
    chrome.storage.local.set({ "singleplayer-customizations": customizations });
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
    chrome.runtime.sendMessage({action:"start_singleplayer"})
    navigate("/singleplayer");
  };

  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">Singleplayer</h2>
      <div className="border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center">Customizations</p>
        <hr className="m-5" />
        {sortedEntries.map(([key, value]) => (
          <div key={key} className="relative group flex mb-2">
            <strong className="mr-2">{key}</strong>
            <p className="whitespace-normal">
              {Array.isArray(value) ? (
                <React.Fragment>{value.join(", ")}</React.Fragment>
              ) : null}
            </p>

            <div>
              {value !== null &&
              typeof value === "object" &&
              !Array.isArray(value) ? (
                <p>{value.title || value.type}</p>
              ) : null}

              {value !== null && typeof value === "object" && key === "mode"
                ? Object.entries(value).map(
                    ([innerKey, innerValue], innerIndex) =>
                      innerKey === value.type ? (
                        <div key={innerKey} className="mt-3">
                          {Object.entries(innerValue).map(
                            ([nestedKey, nestedValue], nestedIndex) => (
                              <div key={nestedKey}>
                                <strong>{nestedKey} </strong>
                                {Array.isArray(nestedValue) ? (
                                  <React.Fragment>
                                    {nestedValue.map((article, index) => (
                                      <React.Fragment key={index}>
                                        {article.title}
                                        {index < nestedValue.length - 1
                                          ? ", "
                                          : ""}
                                      </React.Fragment>
                                    ))}
                                  </React.Fragment>
                                ) : (
                                  nestedValue.toString()
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : null
                  )
                : null}
            </div>
            <button
              className="absolute right-0 top-0 mt-0.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={() => handleEdit(key)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-3">
        <button
          className="flex bg-gray-400 text-white px-4 py-2 rounded mr-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="flex bg-green-400 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default SingleplayerDashboard;
