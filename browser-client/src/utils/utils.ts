export const RESET: string = "reset" as const;

export const GAME_MODE: string = "mode" as const;

// turn into enum
export enum GamePlayMode {
  SinglePlayer = "singleplayer",
  MultiPlayer = "multiplayer",
}

export const LAST_ACTIVE_ROUTE: string = "last_active_route" as const;
export const CUSTOMIZATIONS: string = "customizations" as const;

// turn into enum
export enum Mode {
  Normal = "normal",
  Path = "path",
  CountDown = "count_down",
}

export const START_GAME: string = "start_game" as const;
export const GAME_STARTED: string = "game_started" as const;

// turn into enum
export const UPDATE_CUSTOMIZATION: string = "update_customization" as const;
export const UPDATED_CUSTOMIZATION: string = "updated_customization" as const;
export const UPDATED_GAME_CLIENT: string = "updated_game_client" as const;
export const UPDATE_GAME_MODE: string = "update_game_mode" as const;

export const PLAYER: string = "player" as const;
export const VIEWING_PLAYER: string = "viewing_player" as const;
export const UPDATED_VIEWING_PLAYER: string = "updated_viewing_player" as const;
export const UPDATED_GAME_STATUS: string = "updated_game_status" as const;

// turn into enum
export const TRACKING_TIME: string = "tracking_time" as const;
export const TRACKING_CLICKS: string = "tracking_clicks" as const;

export enum Restrictions {
  NoOpeningPara = "no-opening-para",
  NoFind = "no-find",
  NoBack = "no-back",
  NoDates = "no-dates",
  SamePageLink = "same-page-link",
  NoPopups = "no-popups",
}

// turn into enum
export const TILE: string = "tile" as const;
export const SOURCE: string = "source" as const;

// turn into enum
export const AVAILABLE: string = "available" as const;
export const CHOSEN: string = "chosen" as const;

export const GAME: string = "game" as const;
export const GAME_CUSTOMIZATIONS: string = "game-customizations" as const;

export const TAB_ID: string = "tab-id" as const;
export const WIN: string = "win" as const;
export const WIKIPEDIA_CLICK: string = "wikipedia_click" as const;

export const CLICK_COUNT: string = "click-count" as const;

export const PAUSE: string = "pause" as const;
export const UNPAUSE: string = "unpause" as const;
export const UPDATE_PAUSE: string = "update_pause" as const;

export const GET_TAB_ID: string = "get_tab_id" as const;

// singleplayerEvents.ts (or wherever you want to keep it)

export enum SingleplayerEvents {
  Finish = "finish_singleplayer_game",
  Win = "singleplayer_win",
  Quit = "quit_singleplayer",
  ClearEnd = "singleplayer_clear_end",
  TimeFinished = "singleplayer_time_finished",
  ExternalWikiVisit = "external_wiki_visit",
  Done = "done_singleplayer",
}

export const END_CAUSE: string = "end-cause" as const;

export const PLAYER_SELECTOR: string = "player-selector" as const;
export const TRACKING_INFORMATION: string = "tracking-information" as const;
export const PATH_PROGRESS: string = "path-progress" as const;
export const CUSTOMIZATION_INFO: string = "customization-info" as const;

export const GAME_WIDGET_MAXIMIZED: string = "game-widget-maximized" as const;
export const GAME_END_PLAYER_SELECTOR_MAXIMIZED: string = "game-end-player-selector-maximized" as const;
export const GAME_END_WIDGET_MAXIMIZED: string = "game-end-widget-maximized" as const;

/*  COLLECT ALL STRING CONSTANTS IN A SINGLE ARRAY
--------------------------------------------------- */
export const allKeys = [
  RESET,
  GAME_MODE,
  GamePlayMode.SinglePlayer,
  GamePlayMode.MultiPlayer,
  LAST_ACTIVE_ROUTE,
  CUSTOMIZATIONS,
  Mode.Normal,
  Mode.Path,
  Mode.CountDown,
  START_GAME,
  GAME_STARTED,
  UPDATE_CUSTOMIZATION,
  UPDATED_CUSTOMIZATION,
  UPDATED_GAME_CLIENT,
  UPDATE_GAME_MODE,
  PLAYER,
  VIEWING_PLAYER,
  UPDATED_VIEWING_PLAYER,
  UPDATED_GAME_STATUS,
  TRACKING_TIME,
  TRACKING_CLICKS,
  Restrictions.NoOpeningPara,
  Restrictions.NoFind,
  Restrictions.NoBack,
  Restrictions.NoDates,
  Restrictions.SamePageLink,
  Restrictions.NoPopups,
  TILE,
  SOURCE,
  AVAILABLE,
  CHOSEN,
  GAME,
  GAME_CUSTOMIZATIONS,
  TAB_ID,
  WIN,
  WIKIPEDIA_CLICK,
  CLICK_COUNT,
  PAUSE,
  UNPAUSE,
  UPDATE_PAUSE,
  GET_TAB_ID,
  SingleplayerEvents.Finish,
  SingleplayerEvents.Win,
  SingleplayerEvents.Quit,
  SingleplayerEvents.ClearEnd,
  SingleplayerEvents.TimeFinished,
  SingleplayerEvents.ExternalWikiVisit,
  SingleplayerEvents.Done,
  END_CAUSE,
  PLAYER_SELECTOR,
  TRACKING_INFORMATION,
  PATH_PROGRESS,
  CUSTOMIZATION_INFO,
  GAME_WIDGET_MAXIMIZED,
  GAME_END_PLAYER_SELECTOR_MAXIMIZED,
  GAME_END_WIDGET_MAXIMIZED,
] as const;

export type MyKeys = typeof allKeys[number];

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
  title: "",
  link: ""
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
};

export const defaultCustomizations: CustomizationInterface = {
  mode: {
    type: "count_down",
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
      timer: 63,
    }
  },
  start: {
    title: "A",
    link: "https://en.wikipedia.org/wiki/A",
  },
  end: {
    title: "D",
    link: "https://en.wikipedia.org/wiki/D",
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
  [key: string]: ClientGameInterface;
};

export interface GameInterface {
  roomID: string;
  customizations: CustomizationInterface;
  participants: string[];
  gameClients: ClientStatusInterface;
  gameStatus: GameStatusInterface,
  path: Article[]
};

export interface GameStatusInterface {
  startTime: number;
  playing: boolean;
  paused: boolean;
  pauseStart: number;
  pauseGap: number;
  win: string | null
};

export const defaultGameStatus: GameStatusInterface = {
  startTime: 0,
  playing: false,
  win: null,
  paused: false,
  pauseStart: 0,
  pauseGap: 0
};

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
  path: [
  ]

};

export interface NodeHistoryInterface {
  clicks: number;
  leaveTime: number | null;
  delayTime: number;
};

export interface ClientGameInterface {
  freePath: Article[];
  visitedPath: Article[];
  nodeHistory: NodeHistoryInterface[];
  edgeHistory: Article[][];
  currentNode: number;
};

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

export const defaultRestrictions = [
  Restrictions.NoOpeningPara,
  Restrictions.NoFind,
  Restrictions.NoBack,
  Restrictions.NoDates,
  Restrictions.SamePageLink,
  Restrictions.NoPopups
];

export enum CustomizationLabels {
  StartArticle = "Start Article",
  EndArticle = "End Article",
  Tracking = "Tracking",
  Restrictions = "Restrictions",
  Type = "Type",
  PathLength = "Path Length",
  Connections = "Connections",
  Directed = "Directed",
  Timer = "Timer"
}

export interface dashboardKeyInterface {
  "/dashboard/mode": string[];
  "/dashboard/track": string[];
  "/dashboard/restrictions": string[];
};

export const dashboardKey: dashboardKeyInterface = {
  "/dashboard/mode": [
    CustomizationLabels.Type,
    CustomizationLabels.StartArticle,
    CustomizationLabels.EndArticle,
  ],
  "/dashboard/track": [
    CustomizationLabels.Tracking
  ],
  "/dashboard/restrictions": [
    CustomizationLabels.Restrictions
  ]
};

export enum CustomizationDataKeys {

}

