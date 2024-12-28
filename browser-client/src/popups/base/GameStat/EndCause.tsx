import { SingleplayerEvents } from "../../../utils/utils";

interface EndCauseProps {
    cause: string | undefined;
}

function EndCause({ cause } : EndCauseProps) {
    let message = "error";
    let color = "";

    switch (cause) {
        case SingleplayerEvents.Win:
          message = "Singleplayer Win";
          color = "bg-green-400";
          break;
        case SingleplayerEvents.Quit:
          message = "Singleplayer Quit";
          color = "bg-red-400";
          break;
        case SingleplayerEvents.ExternalWikiVisit:
          message = "External Wikipedia Visit";
          color = "bg-red-400";
          break;
        case SingleplayerEvents.TimeFinished:
          message = "Countdown Finished";
          color = "bg-red-400";
      }
      return (
        <p className={`text-center font-medium text-base p-1 mb-1 ${color} `}>
          {message}
        </p>
      )
}

export default EndCause;