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
export const UPDATED_GAME_CLIENT: string = "updated_game_client";

export const UPDATE_GAME_MODE: string = "update_game_mode";
export const PLAYER: string = "player";
export const VIEWING_PLAYER: string = "viewing_player";
export const UPDATED_VIEWING_PLAYER: string = "updated_viewing_player";
export const UPDATED_GAME_STATUS: string = "updated_game_status";

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

export const TRACKING_TIME = "tracking_time";
export const TRACKING_CLICKS = "tracking_clicks";

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
          pathLength: 9,
          directed: true,
          connections: [
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},
            {title: "aaa", link:"bb"},

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
        title: "c",
        link: "",
    },
    end: {
        title: "d",
        link: "",
    },
    track: [TRACKING_CLICKS],
    restrictions: [
        "no-opening-para",
        "no-find",
        "no-back",
        "no-dates",
        "same-page-link",
        "no-popups",
    ],
}
//TODO: RENAME ALL THIS BROOO WTF
export interface ClientStatusInterface {
    [key: string] : ClientGameInterface;
}

export interface GameInterface {
    roomID: string;
    customizations: CustomizationInterface;
    participants: string[];
    gameClients: ClientStatusInterface;
    gameStatus: GameStatusInterface,
    path: Article[]
}

export interface GameStatusInterface {
  startTime: number;
  playing: boolean;
  paused: boolean;
  pauseStart: number;
  pauseGap: number;
  win: string | null
}

export const defaultGameStatus: GameStatusInterface = {
  startTime: 0,
  playing: false,
  win: null,
  paused: false,
  pauseStart: 0,
  pauseGap: 0
}

export const defaultGame: GameInterface = {
    // _id: String (generated by MongoDB)
    roomID: "",
    customizations: defaultCustomizations,
    participants: [/*String*/],
    gameClients: {
      // clientID1: defaultClientGame,
    },
    gameStatus: {
      startTime: 0,
      playing: false,
      win: null,
      paused: false,
      pauseStart: 0,
      pauseGap: 0
    },
    path: []
    
  }

export interface NodeHistoryInterface {
    clicks: number;
    leaveTime: number | null;
    delayTime: number;
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

export const GAME = "game";
export const GAME_CUSTOMIZATIONS = "game-customizations";

export const TAB_ID = "tab-id";
export const WIN = "win";
export const WIKIPEDIA_CLICK = "wikipedia_click";

export const CLICK_COUNT = "click-count";

export const PAUSE = "pause";
export const UNPAUSE = "unpause";

export const UPDATE_PAUSE = "update_pause";
export const GET_TAB_ID = "get_tab_id";

export const FINISH_SINGLEPLAYER_GAME = "finish_singleplayer_game";
export const SINGLEPLAYER_WIN = "singleplayer_win"; // TODO: idk maybe we can optimize this and also add a sub-field for winning player ID
export const QUIT_SINGLEPLAYER = "quit_singleplayer" // TODO: deal with when one player leaves, the connection stuff
export const SINGLEPLAYER_CLEAR_END = "singleplayer_clear_end";
export const SINGLEPLAYER_TIME_FINISHED = "singleplayer_time_finished"; // TODO: can make this for multiplayer
export const EXTERNAL_WIKI_VISIT = "external_wiki_visit";
export const DONE_SINGLEPLAYER = "done_singleplayer";
export const END_CAUSE = "end-cause";

export const PLAYER_SELECTOR = "player-selector";
export const TRACKING_INFORMATION = "tracking-information";
export const PATH_PROGRESS = "path-progress";
export const CUSTOMIZATION_INFO = "customization-info";