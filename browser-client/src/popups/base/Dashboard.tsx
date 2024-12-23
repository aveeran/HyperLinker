import { useNavigate } from "react-router-dom";
import { CustomizationInterface, CUSTOMIZATIONS, dashboardKey, defaultCustomizations, GAME_MODE, GAME_STARTED, MODE_COUNT_DOWN, MODE_NORMAL, MODE_PATH, MULTI_PLAYER, START_GAME, UPDATED_CUSTOMIZATION } from "../../utils/utils";
import { useMemo, useState, useEffect } from "react";

const getCategory = (value: string | null) => {
  for (const [key, values] of Object.entries(dashboardKey)) {
    if (values.includes(value)) {
      return key;
    }
  }
  return null;
}


function Dashboard() {
  // TODO: add listener for game started, possibly add 'ready' feature in the future
  const [customizations, setCustomizations] = useState<CustomizationInterface>(defaultCustomizations);
  const [pathError, setPathError] = useState<string | null>(null);

  const navigate = useNavigate();
  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);


  // Initializing customizations
  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([CUSTOMIZATIONS, GAME_MODE], (result) => {
        const storedCustomizations = result[CUSTOMIZATIONS];
        if (storedCustomizations) {
          setCustomizations(storedCustomizations);
        }
        // If multiplayer, then update when customizations updated

        if (result[GAME_MODE] === MULTI_PLAYER) {
          const handleMessage = (message: { type: string; customizations: CustomizationInterface },
            sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void
          ) => {
            if (message.type === UPDATED_CUSTOMIZATION && message.customizations) {
              setCustomizations(message.customizations);
            }
          }
          chrome.runtime.onMessage.addListener(handleMessage);

          return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
          }
        }
      });
    } else {
      setCustomizations(defaultCustomizations);
    }
  }, [isChromeExtension]);

  const handleEdit = (value: string | null) => {
    const categoryKey = getCategory(value);
    if (categoryKey) {
      navigate(categoryKey);
    } else {
      console.error("Error: category not found for value: ", value);
    }
  }

  // TODO: figure out how to transit path error message later
  const validatePath = () => {
    if (isChromeExtension) {


      const mode = customizations.mode.type;
      if (mode === MODE_NORMAL || mode == MODE_PATH) {
        // ensuring that the articles themselves are valid
        const pathLength = customizations.mode.path?.pathLength;

        // validating start article
        const startArticle = customizations.start;
        if (!startArticle.link) {
          return 1;
        }

        // validating connecting articles
        const connectionPath = customizations.mode.path?.connections;
        const connectionPathLength = (connectionPath?.length ?? 0) + 2;
        // what even is this one
        if (pathLength != connectionPathLength) {
          return 2;
        }

        for (let i = 0; i < (connectionPath?.length ?? 0); i++) {
          if (connectionPath?.[i]?.link === "") {
            return 3;
          }
        }

        // validating end article
        const endArticle = { title: customizations.end.title, link: customizations.end.link };

        if (!endArticle.link) {
          return 4;
        }

        // validating no duplicates
        const path = [startArticle, ...(connectionPath || []), endArticle];
        const objectStrings = path.map(item => JSON.stringify(item));
        const hasDuplicates = new Set(objectStrings).size !== objectStrings.length;
        if (hasDuplicates) {
          return 5;
        }
      }
    }
    return 0;
  }

  const handleSubmit = () => {
    if (isChromeExtension) {
      const validation = validatePath();
      switch (validation) {
        case 0:
          chrome.runtime.sendMessage({ type: START_GAME, customizations: customizations },
            () => { console.log("sent from dashboard: ", customizations.track[0]) }
          );
          // TODO: add listener for GAME_STARTED messge (if multiplayer)
          navigate("/game");
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
    } else {
      navigate("/game");
    }
  }

  // 3 second cool-down on path
  useEffect(() => {
    if (pathError) {
      const timer = setTimeout(() => setPathError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [pathError]);

  return (<div className="relative pt-3 p-1">
    <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
    {
      pathError && (
        <div
          className="absolute bottom-2 left-0 right-0 bg-red-500 text-white text-center py-2 opacity-90"
          onClick={() => { setPathError(null) }}
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

      <hr className="border-t-1 border-black m-3" />

      <div>
        <div className="group relative grid grid-cols-3 gap-4 p-1">
          <strong className="text-base mr-1 col-span-1">Start Article</strong>
          <p className="col-span-2">{customizations.start.title}</p>
          <button
            data-key="start"
            className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              handleEdit(target.getAttribute("data-key"))
            }}
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
            onClick={(e) => {
              const target = e.target as HTMLElement;
              handleEdit(target.getAttribute("data-key"))
            }}
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
            onClick={(e) => {
              const target = e.target as HTMLElement;
              handleEdit(target.getAttribute("data-key"))
            }}
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
            onClick={(e) => {
              const target = e.target as HTMLElement;
              handleEdit(target.getAttribute("data-key"))
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="">
        <p className="text-center font-bold text-base bg-sky-200">Mode</p>
        <div className="group relative">
          <button
            data-key="mode"
            className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white px-2 py-1 text-sm rounded"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              handleEdit(target.getAttribute("data-key"))
            }}
          >
            Edit
          </button>
          <div className="grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">Type</strong>
            <p className="col-span-2">{customizations.mode.type}</p>
          </div>

          {customizations.mode.type === MODE_PATH ? (
            <>
              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">
                  Path Length
                </strong>
                <p className="col-span-2">
                  {customizations.mode.path?.pathLength}
                </p>
              </div>

              {
                (customizations.mode.path?.pathLength ?? 0) > 2 && (
                  <div className="grid grid-cols-3 gap-4 p-1">
                    <strong className="text-base mr-1 col-span-1">Connections</strong>

                    <p className="col-span-2">
                      {customizations.mode.path?.connections.map(link => link.title).join(", ")}
                    </p>
                  </div>
                )
              }

              <div className="grid grid-cols-3 gap-4 p-1">
                <strong className="text-base mr-1 col-span-1">Directed</strong>
                <p className="col-span-2">
                  {customizations.mode.path?.directed ? "true" : "false"}
                </p>
              </div>
            </>
          ) : null}

          {customizations.mode.type === MODE_COUNT_DOWN ? (
            <div className="grid grid-cols-3 gap-4 p-1">
              <strong className="text-base mr-1 col-span-1">Timer</strong>
              <p className="col-span-2">
                {customizations.mode.count_down?.timer}
              </p>
            </div>
          ) : null}
        </div>



      </div>
    </div>

    <div className="flex justify-center mb-3">
      <button
        className="flex bg-gray-400 text-white px-4 py-2 rounded mr-2 font-custom"
        onClick={() => navigate('/')}
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

export default Dashboard;