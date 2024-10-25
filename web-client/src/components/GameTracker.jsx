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

  useEffect(() => {
    const clickTracking = track === "clicks";
    if(isChromeExtension) {
      if(clickTracking) {
        chrome.storage.local.get([CLICK_COUNT], (result) => {
          const storedClicks = result[CLICK_COUNT] || 0;
          setClickCount(storedClicks);
        });

        if(countDown !== -1) {
          chrome.storage.local.get([ELAPSED_TIME], (result) => {
            const storedTime = result[ELAPSED_TIME] || 0;
            setTime(storedTime);
          });
        }
      } else {
        chrome.storage.local.get([ELAPSED_TIME], (result) => {
          const storedTime = result[ELAPSED_TIME] || 0;
          setTime(storedTime);
        });
      }

      const handleChange = (changes, area) => {
        if(area == "local") {
          if(clickTracking) {
            if(changes[CLICK_COUNT]) {
              const storedClicks = changes[CLICK_COUNT].newValue || 0;
              setClickCount(storedClicks);
            }

            if(countDown !== -1 && changes[ELAPSED_TIME]) {
              const storedTime = changes[ELAPSED_TIME].newValue || 0;
              setTime(storedTime);
            }
          } else {
            if(changes[ELAPSED_TIME]) {
              const storedTime = changes[ELAPSED_TIME].newValue || 0;
              setTime(storedTime);
            }
          }
        }
      }

      chrome.storage.onChanged.addListener(handleChange);

      return () => {
        chrome.storage.onChanged.removeListener(handleChange);
      }
      
    }

  }, [isChromeExtension, track, countDown])

  const parseTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
    const formattedMinutes = `${String(minutes).padStart(2, "0")}:`;
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }, []);

  const renderClicks = () => {
    return (
      <div className="items-center border-black border-2 border-solid p-2 m-2">
            <p>
              <span className="m-2">{track}:</span> {clickCount}
            </p>
          </div>
    )
  }

  const renderCountDown = () => {
    return (
      <div>
        <p>
        {console.log(track)}{console.log(countDown)}

          <span>Count down: </span>
          {parseTime(countDown - time)}
        </p>
      </div>
    );
  }

  const renderTime = () => {
    return (
      <div>
        <p>
        {console.log(track)}{console.log(countDown)}
        <span className="m-2">{track}:</span>
          {parseTime(time)}
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (true) {
      case track === "clicks" && countDown !== -1:
        return (
          <div>
            {renderClicks()}
            {renderCountDown()}
          </div>
        )
      case track === "clicks":
        return renderClicks();

      case track === "time" && countDown !== -1:
        return(
          <div>
            {renderTime()}
            {renderCountDown()}
          </div>
        )

      case track === "time":
        return renderTime();

      case countDown !== -1:
        return renderCountDown();

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default GameTracker;