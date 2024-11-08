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
      link: "",
    },
    track: ["clicks"],
    restrictions: [
      "no-opening-para",
      "no-find",
      "no-back",
      "no-dates",
      "same-page-link",
      "no-popups"
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

  export const defaultEndGameInfo = {
    ended : false,
    singleplayerGameInformation: defaultGameInformation,
    singleplayerGameProperties: defaultGameProperties,
    singleplayerCustomizations: defaultSingleplayerCustomizations
  }

  // actions
  export const START_SINGLEPLAYER = "start_singleplayer";
  export const PAUSE_SINGLEPLAYER = "pause_singleplayer";
  export const UNPAUSE_SINGLEPLAYER = "unpause_singleplayer";
  export const QUIT_SINGLEPLAYER = "quit_singleplayer";
  export const WIKIPEDIA_CLICK = "wikipedia_click";
  export const SINGLEPLAYER_WIN = "singleplayer_win";
  export const SINGLEPLAYER_CLEAR_END = "singleplayer_clear_end";
  
  // data
  export const SINGLEPLAYER_CUSTOMIZATIONS = "singleplayer-customizations";
  export const SINGLEPLAYER_GAME_PROPERTIES = "singleplayer-game-properties";
  export const SINGLEPLAYER_GAME_INFORMATION = "singleplayer-game-information";
  export const SINGLEPLAYER_GAME_WIN = "singleplayer-game-win";
  export const SINGLEPLAYER_TIME_FINISHED = "singleplayer-time-finished";
  export const SINGLEPLAYER_GAME_QUIT = "singleplayer-game-quit";
  export const ELAPSED_TIME = "elapsed-time";
  export const CLICK_COUNT = "click-count";
  export const TAB_ID = "tab-id";
  export const EXTERNAL_WIKI_VISIT = "external-wiki-visit";
  export const CTRL_F_PRESSED = "ctrl-f-pressed";
  export const END_GAME_INFO = "end-game-info";

  // should we have consts here for common storage like "singleplayer-customizations", "singleplayer-game-properties", "singleplayer-game-information"

  // export const isChromeExtension = useMemo(
  //   () =>
  //     typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
  //   []
  // );