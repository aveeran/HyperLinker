export const RESET: string = "reset";
export const MODE: string = "mode";
export const SINGLE_PLAYER: string = "singleplayer";
export const MULTI_PLAYER: string = "multiplayer";
export const LAST_ACTIVE_ROUTE: string = "last_active_route";
export const CUSTOMIZATIONS: string = "customizations";
export const MODE_NORMAL: string = "normal";
export const MODE_PATH: string = "path";
export const MODE_COUNT_DOWN: string = "count_down";

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
    gameStatus: GameStatus;
}

export const defaultGame: GameInterface = {
    // _id: String (generated by MongoDB)
    roomID: "",
    startTime: 0,
    customizations: defaultCustomizations,
    participants: [/*String*/],
    gameStatus: {
      // clientID1: defaultClientGame,
    }
  }

export interface NodeHistoryInterface {
    clicks: number;
    timeElapsed: number;
}

export interface ClientGameInterface {
    freePath: Article[];
    visitedPath: Article[];
    nodeHistory: NodeHistoryInterface[];
    edgeHistory: Article[];
    currentNode: number;
    status: {
        playing: boolean;
        paused: boolean;
        pauseStart: number;
        pauseGap: number;
        win: boolean
    }
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
    status : {
      playing: false,
      paused: false,
      pauseStart: 0,
      pauseGap: 0,
      win: false
    }
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