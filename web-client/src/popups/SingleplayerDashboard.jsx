import React from "react";
import { useNavigate } from "react-router-dom";

const keyCategory = {
  "/singleplayer_dashboard/singleplayer_customization/mode": [
    "mode",
    "start",
    "end",
    "path",
    "count down"
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
};

const defaultCustomizations = {
  mode: "normal",
  path: {
    "path length": 0,
    links : [],
    "directed path": false,
  },
  "count down": 0,
  start: "random",
  end: "random",
  track: ["clicks", "time"],
  restrictions: [
    "no-opening-para",
    "no-find",
    "no-back",
    "no-category",
    "no-dates",
  ],
};

function SingleplayerDashboard() {
  //!!! we need to check if they are on the wikipedia page, if not, then setting will not be normal

  const navigate = useNavigate();

  let storedCustomizations = localStorage.getItem(
    "singleplayer-customizations"
  );

  let customizations = {};
  if (storedCustomizations) {
    customizations = JSON.parse(storedCustomizations);  
  } else {
    customizations = defaultCustomizations;
    storedCustomizations = JSON.stringify(customizations);
    localStorage.setItem("singleplayer-customizations", storedCustomizations);
  }

  console.log('here', customizations);

  const handleEdit = (value) => {
    const categoryKey = getCategory(value);
    if (categoryKey) {
      navigate(categoryKey);
    } else {
      console.log("Error");
    }
  };
  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">Singleplayer</h2>
      <div className="border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center">Customizations</p>
        {Object.entries(customizations).map(([key, value], index) => {
          if ((key !== "path" && key !== "count down") || (key === "path" && customizations.path["path length"] >=2) 
          || (key === "count down" && customizations["count down"] > 0)) {
            return (
              <div key={index} className="relative group flex items-center mb-2">
                <p className="w-[90%] whitespace-normal">
                  <strong>{key}: </strong>
                  {Array.isArray(value) ? (
                    value.map((item, i) => (
                      <React.Fragment key={i}>
                        {item.includes("-") ? (
                          <span className="whitespace-nowrap">{item}</span>
                        ) : (
                          item
                        )}
                        {i < value.length - 1 && ", "}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>{
                      typeof value === 'object' ? 'bruh' : value
                      }</span>
                  )}
                </p>
                <button
              className="absolute right-0 top-0 mt-0.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
              onClick={() => handleEdit(key)}
            >
              Edit
            </button>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="flex justify-center mb-3">
        <button className="flex bg-green-400 text-white px-4 py-2 rounded">
          Start
        </button>
      </div>
    </div>
  );
}

export default SingleplayerDashboard;
