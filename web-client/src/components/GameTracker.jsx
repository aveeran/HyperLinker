import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CLICK_COUNT, ELAPSED_TIME } from "@utils/utils";

function GameTracker({ track="clicks", countDown=-1 }) {
  const [clickCount, setClickCount] = useState(0);
  const [time, setTime] = useState(0);

  const isChromeExtension = useMemo(
    () =>
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  );

  //the useEffects have to be separated because of the addListeners
  useEffect(() => {
    if(isChromeExtension && (track === "clicks")) {
      chrome.storage.local.get([CLICK_COUNT], (result) => {
        const storedClicks = result[CLICK_COUNT] || 0;
        setClickCount(storedClicks)

      });

      const handleClickChange = (changes, area) => {
        if(area === "local" && changes[CLICK_COUNT]) {
          const storedClicks = changes[CLICK_COUNT].newValue || 0;
          setClickCount(storedClicks);
        }
      }
      chrome.storage.onChanged.addListener(handleClickChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleClickChange);
      }
    }
  }, [isChromeExtension, track]);

  useEffect(() => {
    if (isChromeExtension && (track === "time" || countDown !== -1)) {
      chrome.storage.local.get([ELAPSED_TIME], (result) => {
        const storedTime = result[ELAPSED_TIME] || 0;
        setTime(storedTime);
      })

      const handleTimeChange = (changes, area) => {
        if(area === "local" && changes[ELAPSED_TIME]) {
          const storedTime = changes[ELAPSED_TIME].newValue || 0;
          setTime(storedTime);
        }
      }
      chrome.storage.onChanged.addListener(handleTimeChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleTimeChange);
      }
    }
  }, [isChromeExtension, countDown, track]);


  const parseTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
    const formattedMinutes = `${String(minutes).padStart(2, "0")}:`;
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }, []);

  const renderContent = () => {
    switch (true) {
      case track === "clicks":
        return (
          <div className="items-center border-black border-2 border-solid p-2 m-2">
            <p>
              <span className="m-2">{track}:</span> {clickCount}
            </p>
          </div>
        );

      case track === "time":
        return (
          <div>
            <p>
              <span className="m-2">{track}:</span>
              {parseTime(time)}
            </p>
          </div>
        );

      case countDown !== -1:
        return (
          <div>
            <p>
              <span>Count down: </span>
              {parseTime(countDown - time)}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default GameTracker;