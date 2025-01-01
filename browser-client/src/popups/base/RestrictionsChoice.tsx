import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AVAILABLE,
  CHOSEN,
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultCustomizations,
  defaultRestrictions,
  GAME_MODE,
  GamePlayMode,
  SOURCE,
  TILE,
  UPDATE_CUSTOMIZATION,
  UPDATED_CUSTOMIZATION,
} from "../../utils/utils";
import { useChromeStorage } from "../../hooks/useChromeStorage";

// TODO: rename "Tile" to destination

function RestrictionsChoice() {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState<CustomizationInterface>(
    defaultCustomizations
  );
  const [availableRestrictions, setAvailableRestrictions] =
    useState<string[]>(defaultRestrictions);
  const [chosenRestrictions, setChosenRestrictions] = useState<string[]>([]);

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);
  // STEP 1: Memoize keys and default values
  const keys = useMemo(() => [CUSTOMIZATIONS, GAME_MODE], []);
  const defaultValues = useMemo(() => ({
    [CUSTOMIZATIONS]: defaultCustomizations,
    [GAME_MODE]: GamePlayMode.SinglePlayer,
  }), []);

  // STEP 2: Use the custom hook to retrieve data from Chrome storage
  const storageData = useChromeStorage(isChromeExtension, keys, defaultValues);

  // STEP 3: Sync local state with Chrome storage and handle multiplayer updates
  useEffect(() => {
    if (!isChromeExtension) {
      setCustomizationStates(defaultCustomizations);
      return;
    }

    // Sync customizations from storage
    const storedCustomizations = storageData[CUSTOMIZATIONS];
    if (storedCustomizations) {
      setCustomizationStates(storedCustomizations);
    }

    // Handle multiplayer updates
    if (storageData[GAME_MODE] === GamePlayMode.MultiPlayer) {
      const handleMessage = (
        message: { type: string; customizations: CustomizationInterface },
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
      ) => {
        if (message.type === UPDATED_CUSTOMIZATION && message.customizations) {
          setCustomizationStates(message.customizations);
        }
      };

      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [isChromeExtension, storageData]);

  const setCustomizationStates = (
    updatedCustomizations: CustomizationInterface
  ) => {
    if (updatedCustomizations) {
      setCustomizations(updatedCustomizations);
      // Filter out chosen restrictions
      setAvailableRestrictions(
        defaultRestrictions.filter(
          (element) => !updatedCustomizations.restrictions.includes(element)
        )
      );
      setChosenRestrictions(updatedCustomizations.restrictions);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, restriction: string, sourceWidget: typeof AVAILABLE | typeof CHOSEN) => {
    e.dataTransfer.setData(TILE, restriction);
    e.dataTransfer.setData(SOURCE, sourceWidget);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destinationWidget: typeof AVAILABLE | typeof CHOSEN) => {
    // TODO: potential issue: async duplicate
    e.preventDefault();
    const tile = e.dataTransfer.getData(TILE);
    const source = e.dataTransfer.getData(SOURCE);

    if (source === AVAILABLE && destinationWidget === CHOSEN) {
      setAvailableRestrictions(availableRestrictions.filter((t) => t !== tile));
      setChosenRestrictions([...chosenRestrictions, tile]);
    } else if (source === CHOSEN && destinationWidget === AVAILABLE) {
      setChosenRestrictions(chosenRestrictions.filter((t) => t !== tile));
      setAvailableRestrictions([...availableRestrictions, tile]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSubmit = () => {
    const updatedCustomizations = {
      ...customizations,
      restrictions: chosenRestrictions,
    };

    if (isChromeExtension) {
      chrome.storage.local.set(
        { [CUSTOMIZATIONS]: updatedCustomizations },
        () => {
          chrome.runtime.sendMessage({
            type: UPDATE_CUSTOMIZATION,
            customizations: updatedCustomizations,
          });
        }
      );
      setCustomizationStates(updatedCustomizations); // TODO: necessary?
      handleBack();
    }
  };

  return (
    <div className="pt-3 p-1">
      <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
        <p className="text-center font-medium text-base bg-slate-200 ">
          Customizations
        </p>
        <hr className="border-t-1 border-black m-3" />
        <p className="text-center font-medium text-base bg-purple-200 mb-1">
          Restrictions
        </p>

        <div className="flex gap-0 justify-center p-1 m-1">
          <div className="flex-1 border-r-2 border-dotted border-gray-600">
            <div className="flex flex-col items-center">Available</div>
          </div>
          <div className="flex-1 flex-col items-center">
            <div className="flex flex-col items-center">Chosen</div>
          </div>
        </div>

        <p className="text-center font-medium text-base bg-purple-200">
          Options
        </p>

        <div
          className="flex gap-0 justify-center p-1 m-1"
          onDragOver={handleDragOver}
        >
          <div
            className="flex-1 border-r-2 border-dotted border-gray-600"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "available")}
          >
            <div className="p-2">
              <div className="flex flex-col gap-2">
                {availableRestrictions.map((tile) => (
                  <div
                    key={tile}
                    className="bg-gray-200 p-2 text-center rounded shadow-md cursor-pointer"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, tile, "available")}
                  >
                    {" "}
                    {tile}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1 flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "chosen")}
          >
            <div className="p-2">
              <div className="flex flex-col gap-2">
                {chosenRestrictions.map((tile) => (
                  <div
                    key={tile}
                    className="bg-gray-200 p-2 text-center rounded shadow-md cursor-pointer"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, tile, "chosen")}
                  >
                    {" "}
                    {tile}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <button
          className="bg-gray-500 font-custom text-white py-2 px-4 rounded mr-3"
          onClick={handleBack}
        >
          Return
        </button>
        <button
          type="submit"
          className="bg-blue-500 font-custom text-white py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default RestrictionsChoice;