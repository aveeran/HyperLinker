export function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  export const defaultSingleplayerCustomizations = {
    mode: {
      type: "path",
      path: {
        pathLength: 2,
        directed: true,
        intermediate_links: [],
      },
      "count-down": {
        timer: 0,
      },
    },
    start: {
      title: "",
      link: "",
    },
    end: {
      title: "",
      end: "",
    },
    track: ["clicks"],
    restrictions: [
      "no-opening-para",
      "no-find",
      "no-back",
      "no-category",
      "no-dates",
    ],
  };

  export const defaultGameProperties = {
    startTime: 0,
    path: []
  }

  export const defaultGameInformation = {
    freePath: [],
    visitedPath: [],
    nodeHistory: [],
    edgeHistory: [],
    currentNode: 0,
    status: {
      playing: false,
      paused: false,
      pauseStart: 0,
      pauseGap: 0,
      win: false, 
    }
  }

  // actions
  export const START_SINGLEPLAYER = "start_singleplayer";
  export const PAUSE_SINGLEPLAYER = "pause_singleplayer";
  export const UNPAUSE_SINGLEPLAYER = "unpause_singleplayer";
  export const QUIT_SINGLEPLAYER = "quit_singleplayer";
  export const WIKIPEDIA_CLICK = "wikipedia_click";
  export const SINGLEPLAYER_WIN = "singleplayer_win";
  export const SINGLEPLAYER_TIME_FINISHED = "singleplayer_time_finished";

  // data
  export const SINGLEPLAYER_CUSTOMIZATIONS = "singleplayer-customizations";
  export const SINGLEPLAYER_GAME_PROPERTIES = "singleplayer-game-properties";
  export const SINGLEPLAYER_GAME_INFORMATION = "singleplayer-game-information";
  export const SINGLEPLAYER_GAME_WIN = "singleplayer-game-win";
  export const ELAPSED_TIME = "elapsed-time";
  export const CLICK_COUNT = "click-count";
  export const TAB_ID = "tab-id";
  export const EXTERNAL_WIKI_VISIT = "external-wiki-visit";

  // should we have consts here for common storage like "singleplayer-customizations", "singleplayer-game-properties", "singleplayer-game-information"

  // export const isChromeExtension = useMemo(
  //   () =>
  //     typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
  //   []
  // );