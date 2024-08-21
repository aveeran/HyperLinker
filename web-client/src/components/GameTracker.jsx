import React, { useEffect, useState } from "react";

function GameTracker({ track }) {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (track === "clicks") {
      const handleMessage = (message) => {
        if (message.action === "wikipedia_click") {
          setClickCount(message.data);
        }
      };

      // SO WE NEED TO TRACK A CURRENT GAME STATE

      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [track]);

  return (
    <div>
      {track === "clicks" ? (
        <div className="items-center border-black border-2 border-solid p-2 m-2">
          <p>
            <span className="m-2">{track}:</span> {clickCount}
          </p>
        </div>
      ) : null}

      {track === "time" ? <div></div> : null}
    </div>
  );
}

export default GameTracker;
