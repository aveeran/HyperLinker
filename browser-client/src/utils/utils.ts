export const RESET: string = "reset";
export const GAME_MODE: string = "mode";
export const SINGLE_PLAYER: string = "singleplayer";
export const MULTI_PLAYER: string = "multiplayer";
export const LAST_ACTIVE_ROUTE: string = "last_active_route";
export const CUSTOMIZATIONS: string = "customizations";
export const MODE_NORMAL: string = "normal";
export const MODE_PATH: string = "path";
export const MODE_COUNT_DOWN: string = "count_down";
export const START_GAME: string = "start_game";
export const GAME_STARTED: string = "game_started";

export const UPDATE_CUSTOMIZATION: string = "update_customization";
export const UPDATED_CUSTOMIZATION: string = "updated_customization";

export const UPDATE_GAME_MODE: string = "update_game_mode";

export function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };


export interface UserInterface {
    name: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesList: string[]
}

export const defaultUser: UserInterface = {
    name: "",
    gamesPlayed: 0,
    gamesWon: 0,
    gamesList: []
}

export interface Article {
    title: string,
    link: string
}

export interface Suggestion {
  article: Article;
  index: number;
}

export const defaultArticle: Article = {
  title:"",
  link:""
}

export interface CustomizationInterface {
    mode: {
        type: string;
        path?: {
            pathLength: number,
            directed: boolean,
            connections: Article[]
        },
        count_down?: {
            timer: number
        }
    },
    start: Article,
    end: Article,
    track: string[],
    restrictions: string[],
}

export const defaultCustomizations: CustomizationInterface = {
    mode: {
        type: "path",
        path: {
          pathLength: 2,
          directed: true,
          connections: [
            /*
              {
                title: String,
                link: String
              }
            */
          ],
        },
        count_down: {
          timer: 0,
        }
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
        "no-popups",
    ],
}

export interface GameStatus {
    [key: string] : ClientGameInterface;
}

export interface GameInterface {
    roomID: string;
    startTime: number;
    customizations: CustomizationInterface;
    participants: string[];
    gameClients: GameStatus;
    gameStatus: {
      playing: boolean;
      paused?: boolean;
      pauseStart?: number;
      pauseGap?: number;
      win: string | null
  }
}

export const defaultGame: GameInterface = {
    // _id: String (generated by MongoDB)
    roomID: "",
    startTime: 0,
    customizations: defaultCustomizations,
    participants: [/*String*/],
    gameClients: {
      // clientID1: defaultClientGame,
    },
    gameStatus: {
      playing: false,
      win: null
    }
  }

export interface NodeHistoryInterface {
    clicks: number;
    arriveTime: number;
}

export interface ClientGameInterface {
    freePath: Article[];
    visitedPath: Article[];
    nodeHistory: NodeHistoryInterface[];
    edgeHistory: Article[][];
    currentNode: number;
}

export const defaultClientGame: ClientGameInterface = {
    freePath: [
      /*
      {
        title: String,
        link: String
      }
      */
    ],
    visitedPath: [
      /* String (link) */
    ],
    nodeHistory: [
      /*
      {
        title: String,
        link: String
      }
      */
    ],
    edgeHistory: [
      /*
      {
        title: String,
        link: String
      }
      */
    ],
    currentNode: 0,
  };

  export interface dashboardKeyInterface {
    "/dashboard/mode":string[];
    "/dashboard/track":string[];
    "/dashboard/restrictions":string[];
  }

  export const dashboardKey: dashboardKeyInterface = {
    "/dashboard/mode" : [
        "mode", 
        "start",
        "end",
        "path",
        "count_down"
    ],
    "/dashboard/track": ["track"],
    "/dashboard/restrictions":["restrictions"]
  }

export const NO_OPENING_PARA = "no-opening-para";
export const NO_FIND = "no-find";
export const NO_BACK = "no-back";
export const NO_DATES = "no-dates";
export const SAME_PAGE_LINK = "same-page-link";
export const NO_POPUPS = "no-popups";

export const defaultRestrictions = [
  NO_OPENING_PARA,
  NO_FIND,
  NO_BACK,
  NO_DATES,
  SAME_PAGE_LINK,
  NO_POPUPS
]

// TODO: move into RestrictionsChoice.tsx
export const TILE = "tile";
export const SOURCE = "source";
export const AVAILABLE = "available";
export const CHOSEN = "chosen";

export const TRACK_CLICKS = "clicks";
export const TRACK_TIME = "time";

export const GAME = "game";

export const TAB_ID = "tab_id";
export const WIN = "win";
export const WIKIPEDIA_CLICK = "wikipedia_click';"