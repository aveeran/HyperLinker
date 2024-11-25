import { useCallback, useEffect, useMemo, useState } from "react";
import { ClientGameInterface, GameStatusInterface, TRACKING_CLICKS, TRACKING_TIME } from "../utils/utils";

function GameTracker({
  gameClientInformation,
  gameStatus,
  tracking,
  countDown = -1,
}: {
  gameClientInformation: ClientGameInterface;
  gameStatus: GameStatusInterface;
  tracking: string;
  countDown: number;
}) {
  
  const [time, setTime] = useState<number>(0); // dummy-variable to force re-render
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if(countDown != -1) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        const rawElapsedTime = Date.now() - gameStatus.startTime - (gameStatus.pauseGap ?? 0);
        if(Math.floor(rawElapsedTime/1000) > countDown) {

          // TODO: send signal, navigate to game end page
          console.log("Count down done!");
        }
      }, 1000);

    } else if (tracking === TRACKING_TIME) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tracking, countDown, gameStatus.pauseGap]);

  const countClicks = (): number => {
    const nodes = gameClientInformation.nodeHistory;
    let clickCount = 0;

    for (let i = 0; i < nodes.length; i++) {
      clickCount += nodes[i].clicks;
    }

    return clickCount;
  };

  const parseTime = useCallback((seconds: number) => {
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
      <div className="grid grid-cols-[100px_auto]  gap-2 items-center">
        <span className="text-right font-medium">Click Count:</span>
        <span className="text-left">{countClicks()}</span>
      </div>
    );
  };

  const renderCountDown = () => {
    const rawElapsedTime = Date.now() - gameStatus.startTime - (gameStatus.pauseGap ?? 0);
    const formattedTime = countDown - Math.floor(rawElapsedTime/1000);

    return (
      <div className="grid grid-cols-[100px_auto] gap-2 items-center">
        <span className="text-right font-medium">Count Down:</span>
        <span className="text-left">{parseTime(formattedTime)}</span>
      </div>
    );
  };

  const renderTime = () => {
    const rawTime =
      Date.now() - gameStatus.startTime - (gameStatus.pauseGap ?? 0);
    const formattedTime = Math.floor(rawTime/1000);

    return (
      <div className="grid grid-cols-[100px_auto] gap-2 items-center">
        <span className="text-right font-medium">Elapsed Time:</span>
        <span className="text-left">{parseTime(formattedTime)}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch (true) {
      case tracking === TRACKING_CLICKS && countDown != -1:
        return (
          <div className="flex flex-col justify-items-center gap-2">
            {renderClicks()}
            {renderCountDown()}
          </div>
        );
      case tracking === TRACKING_TIME && countDown != -1:
        return (
          <div className="flex flex-col justify-items-center gap-2">
            {renderTime()}
            {renderCountDown()}
          </div>
        )
      case tracking === TRACKING_CLICKS:
        return renderClicks();
      case tracking === TRACKING_TIME:
        return renderTime();

      default:
        return <p>bruh: {tracking}</p>;
    }
  };

  return <div className="flex flex-col items-center mb-1">{renderContent()}</div>;
}

export default GameTracker;
