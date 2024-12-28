import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultCustomizations,
  GAME_MODE,
  GamePlayMode,
  TRACKING_CLICKS,
  TRACKING_TIME,
  UPDATE_CUSTOMIZATION,
  UPDATED_CUSTOMIZATION,
} from "../../utils/utils";

function TrackerChoice() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState<CustomizationInterface>(
    defaultCustomizations
  );
  const [track, setTrack] = useState<string>(TRACKING_CLICKS);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get([CUSTOMIZATIONS], (result) => {
        const storedCustomizations = result[CUSTOMIZATIONS];
        if(storedCustomizations) {
            setCustomizationStates(storedCustomizations);
        }

        // If multiplayer, then update when customizations updated

        if(result[GAME_MODE] === GamePlayMode.MultiPlayer) {
            const handleMessage = (message: {type: string; customizations: CustomizationInterface},
              sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void
            ) => {
              if(message.type === UPDATED_CUSTOMIZATION && message.customizations) {
                setCustomizationStates(message.customizations);
              }
            }
            chrome.runtime.onMessage.addListener(handleMessage);
  
            return () => {
              chrome.runtime.onMessage.removeListener(handleMessage);
            }
          }
  

      });
    } else {
      setCustomizationStates(defaultCustomizations);
    }
  }, [isChromeExtension]);

  const setCustomizationStates = (
    updatedCustomizations: CustomizationInterface
  ) => {
    if (updatedCustomizations) {
      setCustomizations(updatedCustomizations);
      setTrack(updatedCustomizations.track[0]);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrack(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedCustomizations = {
      ...customizations,
      track: [track],
    };

    chrome.storage.local.set(
      { [CUSTOMIZATIONS]: updatedCustomizations },
      () => {
        chrome.runtime.sendMessage({
          type: UPDATE_CUSTOMIZATION,
          customizations: updatedCustomizations,
        });
      }
    );
    handleBack();
  };

  const handleBack = () => {
    navigate('/dashboard');
  };
  return (
    <div className="pt-3 p-1">
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
  
        <p className="text-center font-medium text-base bg-slate-200">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-3" />

        <p className="text-center bg-purple-200 font-medium p-1 mb-1">
          Tracking
        </p>
        <form
          onSubmit={handleSubmit}
          id="tracking"
          className="flex flex-col items-center"
        >
          <div className="flex flex-col mb-1">
            <label htmlFor={TRACKING_CLICKS} className="mr-4">
              <input
                type="radio"
                id={TRACKING_CLICKS}
                name="tracking"
                value={TRACKING_CLICKS}
                checked={track === TRACKING_CLICKS}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <span>Clicks</span>
            </label>
            <label htmlFor={TRACKING_TIME} className="mr-4">
              <input
                type="radio"
                id={TRACKING_TIME}
                name="tracking"
                value={TRACKING_TIME}
                checked={track === TRACKING_TIME}
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

export default TrackerChoice;
