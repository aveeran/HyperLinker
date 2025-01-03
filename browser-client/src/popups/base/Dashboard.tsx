import { useNavigate } from "react-router-dom";
import { 
  CustomizationInterface, 
  CUSTOMIZATIONS, 
  dashboardKey, 
  defaultCustomizations, 
  GAME_MODE, 
  Mode, 
  GamePlayMode, 
  MyKeys, 
  InformationUpdated,
  SingleplayerEvents} from "../../utils/utils";
import { useMemo, useState, useEffect } from "react";
import { useChromeStorage } from "../../hooks/useChromeStorage";
import { CustomizationPanel } from "../../components/CustomizationPanel";
import { CustomizationValidationResult, validateCustomizations } from "../../validation/validateCustomizations";

const getCategory = (value: string | null) => {
  for (const [key, values] of Object.entries(dashboardKey)) {
    if (values.includes(value)) {
      return key;
    }
  }
  return null;
}

function Dashboard() {
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


  // STEP 1: Define keys to retrieve & default values
  const keys: MyKeys[] = useMemo(() => [CUSTOMIZATIONS, GAME_MODE], []);
  const defaultValues = useMemo(() => ({
    [CUSTOMIZATIONS]: defaultCustomizations,
    [GAME_MODE]: GamePlayMode.SinglePlayer,
  }), []);

  // STEP 2: Use the custom hook to retrieve data from Chrome storage
  const storageData = useChromeStorage<MyKeys>(isChromeExtension, keys, defaultValues);

  // STEP 3: Whenever storageData changes, sync local state
  useEffect(() => {
    if(!isChromeExtension) {
      setCustomizations(defaultCustomizations);
      return;
    }

    const storedCustomizations = storageData[CUSTOMIZATIONS] as CustomizationInterface;
    setCustomizations(storedCustomizations);
  }, [isChromeExtension, storageData]);

   // 4) Use the gameMode from storage to decide if we should listen for updates
   const storedGameMode = storageData[GAME_MODE] as string;
   // TODO: determine if singleplayer, multiplayer guest, or multiplayer host and create new var for that?

  //  const shouldListen = isChromeExtension && storedGameMode === GamePlayMode.MultiPlayer;
 
  //  useCustomizationListener(
  //    (updated: CustomizationInterface) => {
  //      setCustomizations(updated);
  //    },
  //    shouldListen
  //  );
 

  const handleEdit = (value: string | null) => {
    const categoryKey = getCategory(value);
    if (categoryKey) {
      navigate(categoryKey);
    } else {
      console.error("Error: category not found for value: ", value);
    }
  }

  const handleSubmit = () => {
    // TODO: handle the singleplayer vs multiplayer here!!

    if (isChromeExtension) {
      const validation: CustomizationValidationResult = validateCustomizations(customizations);
      if(validation.isValid) {
        chrome.runtime.sendMessage({type: SingleplayerEvents.Start, customizations: customizations})
        navigate('/game');
      } else {
        setPathError(validation?.errorMessage ?? "Error");
      }
    } else {
      navigate('/game');
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

      <CustomizationPanel
      customizations={customizations}
      handleEdit={handleEdit}
      />
      {
        // TODO: only if singleplayer or multiplayer host, can edit
      }

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
      >{
        // TODO: only if singleplayer or multiplayer host, can edit
      }
        Start
      </button>
    </div>
  </div>
  );
}

export default Dashboard;