// Constants
export const RESET: string = "reset" as const;

export const GAME_MODE: string = "mode" as const;

export const LAST_ACTIVE_ROUTE: string = "last_active_route" as const;

export const CUSTOMIZATIONS: string = "customizations" as const;

export const PLAYER: string = "player" as const;

export const VIEWING_PLAYER: string = "viewing-player" as const;

export const GAME: string = "game" as const;

export const GAME_CUSTOMIZATIONS: string = "game-customizations" as const;

export const TAB_ID: string = "tab-id" as const;

export const WIKIPEDIA_CLICK: string = "wikipedia_click" as const;

export const CLICK_COUNT: string = "click-count" as const;

export const GET_TAB_ID: string = "get_tab_id" as const;

export const END_CAUSE: string = "end-cause" as const;

export const GAME_WIDGET_MAXIMIZED: string = "game-widget-maximized" as const;

export const GAME_END_PLAYER_SELECTOR_MAXIMIZED: string = "game-end-player-selector-maximized" as const;

export const GAME_END_WIDGET_MAXIMIZED: string = "game-end-widget-maximized" as const;

// Enums
export enum GamePlayMode {
  SinglePlayer = "singleplayer",
  MultiPlayer = "multiplayer",
}

export enum Tracking {
  Time = "tracking-time",
  Clicks = "tracking-clicks"
}

export enum Restrictions {
  NoOpeningPara = "no-opening-para",
  NoFind = "no-find",
  NoBack = "no-back",
  NoDates = "no-dates",
  SamePageLink = "same-page-link",
  NoPopups = "no-popups",
}

export enum RestrictionWidget {
  Destination = "destination",
  Source = "source"
}

export enum RestrictionWidgetStatus {
  Available = "available",
  Chosen = "chosen"
}

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

export enum Mode {
  Normal = "normal",
  Path = "path",
  CountDown = "count_down",
  Random="random"
}

export enum UpdateInformation {
  Customization = "update_customization",
  GameMode = "update_game_mode",
  Pause="update_pause"
}

export enum InformationUpdated {
  Customization = "updated_customization",
  GameClient = "updated_game_client",
  ViewingPlayer="updated_viewing_player",
  GameStatus="updated_game_status",
  GameStarted="game_started"
}

export enum SingleplayerEvents {
  Start = "start_singleplayer_game",
  Finish = "finish_singleplayer_game",
  Win = "singleplayer_win_game",
  Quit = "quit_singleplayer_game",
  ClearEnd = "singleplayer_clear_end",
  TimeFinished = "singleplayer_time_finished_end_game",
  ExternalWikiVisit = "external_wiki_visit_game_end",
  Done = "done_singleplayer",
  Pause = "singleplayer_pause_game",
  Unpause = "singleplayer_unpause_game",
}

export enum Widget {
  PlayerSelector = "player-selector",
  TrackingInformation = "tracking-information",
  PathProgress = "path-progress",
  CustomizationInfo = "customization-info"
}

export enum MultiplayerEvents {

}

export function parseEnum<T extends Record<string, string | number>>(
  enumType: T,
  value: any
): T[keyof T] {
  if (Object.values(enumType).includes(value)) {
    return value as T[keyof T];
  }
  throw new Error(`Invalid value for enum: ${value}`);
}


// Key

export const allKeys = [
  GamePlayMode.MultiPlayer,
  GamePlayMode.SinglePlayer,
  Mode.Normal,
  Mode.Path,
  Mode.CountDown,
  Mode.Random,
  InformationUpdated.Customization,
  InformationUpdated.GameClient,
  InformationUpdated.GameStarted,
  InformationUpdated.GameStatus,
  InformationUpdated.ViewingPlayer,
  UpdateInformation.Customization,
  UpdateInformation.GameMode,
  UpdateInformation.Pause,
  Tracking.Clicks,
  Tracking.Time,
  Restrictions.NoBack,
  Restrictions.NoDates,
  Restrictions.NoFind,
  Restrictions.NoOpeningPara,
  Restrictions.NoPopups,
  Restrictions.SamePageLink,
  RestrictionWidget.Destination,
  RestrictionWidget.Source,
  RestrictionWidgetStatus.Available,
  RestrictionWidgetStatus.Chosen,
  SingleplayerEvents.ClearEnd,
  SingleplayerEvents.Done,
  SingleplayerEvents.ExternalWikiVisit,
  SingleplayerEvents.Finish,
  SingleplayerEvents.Pause,
  SingleplayerEvents.Quit,
  SingleplayerEvents.Start,
  SingleplayerEvents.TimeFinished,
  SingleplayerEvents.Unpause,
  SingleplayerEvents.Win,
  Widget.CustomizationInfo,
  Widget.PathProgress,
  Widget.PlayerSelector,
  Widget.TrackingInformation,
  RESET,
  GAME_MODE,
  LAST_ACTIVE_ROUTE,
  CUSTOMIZATIONS,
  PLAYER,
  VIEWING_PLAYER,
  GAME,
  GAME_CUSTOMIZATIONS,
  TAB_ID,
  WIKIPEDIA_CLICK,
  CLICK_COUNT,
  GET_TAB_ID,
  END_CAUSE,
  GAME_WIDGET_MAXIMIZED,
  GAME_END_PLAYER_SELECTOR_MAXIMIZED,
  GAME_END_WIDGET_MAXIMIZED,
] as const;

export type MyKeys = typeof allKeys[number];

// Functions

export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// Interfaces and default values

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
    type: Mode;
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
  track: Tracking[],
  restrictions: Restrictions[],
};

export const defaultCustomizations: CustomizationInterface = {
  mode: {
    type: Mode.CountDown,
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
  track: [Tracking.Clicks],
  restrictions: [
    Restrictions.NoOpeningPara,
    Restrictions.NoFind,
    Restrictions.NoBack,
    Restrictions.NoDates,
    Restrictions.SamePageLink,
    Restrictions.NoPopups
  ],
}

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
    {
      title: "A",
      link: "https://en.wikipedia.org/wiki/A",
    },
    {
      title: "B",
      link: "https://en.wikipedia.org/wiki/B",
    },
    {
      title: "C",
      link: "https://en.wikipedia.org/wiki/C",
    }
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
  freePath: [],
  visitedPath: [],
  nodeHistory: [],
  edgeHistory: [],
  currentNode: 0,
};

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