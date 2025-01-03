import { useCallback, useEffect, useMemo, useState } from "react";
import { 
  ClientGameInterface, 
  defaultClientGame, 
  SingleplayerEvents, 
  GameStatusInterface, 
  NodeHistoryInterface, 
  Tracking, 
  UpdateInformation, 
  CustomizationInterface, 
  Mode } from "../utils/utils";

function GameTracker({
  gameClientInformation,
  mode,
  gameStatus,
  tracking,
  countDown = -1,
}: {
  gameClientInformation: ClientGameInterface;
  mode: string;
  gameStatus: GameStatusInterface;
  tracking: string;
  countDown: number;
}) {
  
  const [time, setTime] = useState<number>(0); // dummy-variable to force re-render
  let interval: NodeJS.Timeout | null = null;

  if(!gameClientInformation) {
    gameClientInformation = defaultClientGame;
  }

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(typeof chrome !== "undefined" && chrome.storage && chrome.storage.local);
  }, []);

  useEffect(() => {
    if(!gameStatus.paused) { // only if not paused, 
  
      if(countDown != -1 && mode === Mode.CountDown) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
          const rawElapsedTime = Date.now() - gameStatus.startTime - ((gameStatus.pauseGap ?? 0) * 1000); // TODO: we need to set the pause gap
          if(Math.floor(rawElapsedTime/1000) > countDown) {

            if(isChromeExtension) {
              chrome.runtime.sendMessage({
                type: SingleplayerEvents.Finish,
                cause: SingleplayerEvents.TimeFinished
              });
            }
          }
        }, 1000);
  
      } else if (tracking === Tracking.Time) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      }
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [tracking, countDown, gameStatus.pauseGap, gameStatus.paused]);

  useEffect(() => {
    if(isChromeExtension) {
      chrome.runtime.onMessage.addListener((message, sender, response) => {
        if(message.type === UpdateInformation.Pause) {
          if(message.pause && interval) {
            clearInterval(interval);
          } else if (!message.pause) {
            if(countDown != -1 && mode == Mode.CountDown) {
              interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
                const rawElapsedTime = Date.now() - gameStatus.startTime - ((gameStatus.pauseGap ?? 0) * 1000); // TODO: we need to set the pause gap
                if(Math.floor(rawElapsedTime/1000) > countDown) {
        
                  chrome.runtime.sendMessage({
                    type: SingleplayerEvents.Finish,
                    cause: SingleplayerEvents.TimeFinished
                  });
                }
              }, 1000);
        
            } else if (tracking === Tracking.Time) {
              interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
              }, 1000);
            }
          }
        }
      });
    }
  });

  const countClicks = (): number => {
    const nodes = gameClientInformation?.nodeHistory || [];
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
    let rawTime = 0;
    if(!gameStatus.paused) {
      rawTime =
      Date.now() - gameStatus.startTime - ((gameStatus.pauseGap ?? 0) * 1000);
    } else {      
      rawTime = gameStatus.pauseStart - gameStatus.startTime - (gameStatus.pauseGap*1000);      
    }
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
      case tracking === Tracking.Clicks && countDown != -1 && mode === Mode.CountDown:
        return (
          <div className="flex flex-col justify-items-center gap-2">
            {renderClicks()}
            {renderCountDown()}
          </div>
        );
      case tracking === Tracking.Time && countDown != -1 && mode === Mode.CountDown:
        return (
          <div className="flex flex-col justify-items-center gap-2">
            {renderTime()}
            {renderCountDown()}
          </div>
        )
      case tracking === Tracking.Clicks:
        return renderClicks();
      case tracking === Tracking.Time:
        return renderTime();

      default:
        return <p>bruh: {tracking}</p>;
    }
  };

  return <div className="flex flex-col items-center mb-1 bg-gray-50">{renderContent()}</div>;
}

export default GameTracker;
