import React, { useEffect, useState, useRef, useMemo } from "react";

function GameTracker({ track, countDown }) {
  const [clickCount, setClickCount] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  let timerInterval = useRef(null);

  const isChromeExtension = useMemo(
    () => 
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
    []
  )

  useEffect(() => {
    if (isChromeExtension && (track === "clicks" || countDown !== -1)) {
      chrome.storage.local.get("clickCount", (result) => {
        setClickCount(result.clickCount || 0);
      });

      const handleStorageChange = (changes, area) => {
        if (area === "local" && changes.clickCount) {
          setClickCount(changes.clickCount.newValue);
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);

      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, [track, isChromeExtension, countDown]);

  useEffect(() => {
    if(isChromeExtension && track === "time") {
      chrome.storage.local.get("elapsedTime", (result) => {
        setTime(result.elapsedTime || 0);
      });

      const handleStorageChange = (changes, area) => {
        if(area === "local" && changes.elapsedTime) {
          setTime(changes.elapsedTime.newValue);
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);

      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    }
  }, [track, isChromeExtension])

  const startTimer = () => {
    setTimerRunning(true);
  }

  const stopTimer = () => {
    setTimerRunning(false);
    clearInterval(timerInterval.current);
  }

  function parseTime(seconds) {
    const hours = Math.floor(seconds / 3600); 
    const minutes = Math.floor((seconds % 3600) / 60); 
    const remainingSeconds = seconds % 60; 

    const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
    const formattedMinutes = `${String(minutes).padStart(2, '0')}:`;
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }
  

  return (
    <div>
      {track === "clicks" ? (
        <div className="items-center border-black border-2 border-solid p-2 m-2">
          <p>
            <span className="m-2">{track}:</span> {clickCount}
          </p>
        </div>
      ) : null}

      {track === "time" ? (
        <div>
          <p>
            <span className="m-2">{track}:</span>
            {parseTime(time)}
          </p>
        </div>
      ) : null}

      {countDown !== -1 ? (
        <div>
          <p>
            <span>Count down: </span>
            {parseTime(countDown-time)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default GameTracker;
