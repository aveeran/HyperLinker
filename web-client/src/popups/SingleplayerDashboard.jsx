import React from "react";
import { useNavigate } from "react-router-dom";

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
};

const defaultCustomizations = {
  mode: {
    type: "path",
    path: {
      pathLength: 2,
      directed: true,
      intermediate_links: [],
    },
    countDown: {
      timer: 0,
    },
  },
  start: {
    title: "",
    link: "",
  },
  end: {
    title: "",
    end: "",
  },
  track: ["clicks"],
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
  
  const reset = () => {
    customizations = defaultCustomizations;
    localStorage.setItem("singleplayer-customizations", JSON.stringify(customizations));
  }

  // reset();

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
          return (
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
                  <p>{value[Object.keys(value)[0]]}</p>
                ) : null}

                {value !== null && typeof value === "object" && key == "mode"
                  ? Object.entries(value).map(
                      ([key_two, value_two], index_two) => {
                        return key_two === value.type ? (
                          <div>
                            {Object.entries(value_two).map(
                              ([key_three, value_three], index_three) => {
                                return (
                                  <div key={key_three}>
                                    <strong>{key_three} </strong>
                                    {Array.isArray(value_three) ? (
                                      <React.Fragment>
                                        {value_three.map(article => article.title).join(", ")}
                                      </React.Fragment>
                                    ) : (
                                      value_three.toString()
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : null;
                      }
                    )
                  : null}
              </div>

              <button
                className="absolute right-0 top-0 mt-0.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
                onClick={() => handleEdit(key)}
                key={key}
              >
                Edit
              </button>
            </div>
          );
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
