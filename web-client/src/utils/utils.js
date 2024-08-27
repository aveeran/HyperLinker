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
      pauseGap: 0
    }
  }

  // should we have consts here for common storage like "singleplayer-customizations", "singleplayer-game-properties", "singleplayer-game-information"

  // export const isChromeExtension = useMemo(
  //   () =>
  //     typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
  //   []
  // );