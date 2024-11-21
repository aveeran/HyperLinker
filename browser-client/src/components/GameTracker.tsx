import { useCallback, useEffect, useState } from "react";
import { ClientGameInterface, GameStatusInterface, TRACKING_CLICKS, TRACKING_TIME } from "../utils/utils";

function GameTracker({
  gameClientInformation,
  gameStatus,
  tracking,
  countDown,
}: {
  gameClientInformation: ClientGameInterface;
  gameStatus: GameStatusInterface;
  tracking: string;
  countDown: number;
}) {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (tracking === TRACKING_TIME) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tracking]);

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
    return (
      <div className="grid grid-cols-[100px_auto] gap-2 items-center">
        <span className="text-right font-medium">Count Down:</span>
        <span className="text-left">{parseTime(countDown - time)}</span>
      </div>
    );
  };

  const renderTime = () => {
    const elapsedTime =
      Date.now() - gameStatus.startTime - (gameStatus.pauseGap ?? 0);

    return (
      <div className="grid grid-cols-[100px_auto] gap-2 items-center">
        <span className="text-right font-medium">Elapsed Time:</span>
        <span className="text-left">{parseTime(Math.floor(elapsedTime / 1000))}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch (true) {
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
