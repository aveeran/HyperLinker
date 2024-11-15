import {
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultArticle,
  defaultClientGame,
  defaultCustomizations,
  defaultGame,
  GAME,
  GameInterface,
  MODE_PATH,
  MULTI_PLAYER,
  SINGLE_PLAYER,
  START_GAME,
  TAB_ID,
  UPDATE_CUSTOMIZATION,
  UPDATE_GAME_MODE,
  WIKIPEDIA_CLICK,
  WIN,
} from "../utils/utils";

let gameMode: string = SINGLE_PLAYER;
let gameCustomizations: CustomizationInterface = defaultCustomizations;
let game: GameInterface = defaultGame;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case UPDATE_CUSTOMIZATION:
      handleCustomizationsUpdate(message.customizations);
      break;
    case UPDATE_GAME_MODE:
      handleGameModeUpdate(message.game_mode);
      break;
    case START_GAME:
      if (gameMode === SINGLE_PLAYER) {
        startSingleplayer(message.customizations);
      } else if (gameMode === MULTI_PLAYER) {
        // TODO: get start time from server
        startMultiplayer();
      }
      break;
    case WIKIPEDIA_CLICK:
        handleWikipediaClick(message.link);
  }

  return false;
});

function handleCustomizationsUpdate(
  updatedCustomizations: CustomizationInterface
) {
  gameCustomizations = updatedCustomizations;
  if (gameMode === MULTI_PLAYER) {
    // TODO: socket.io message
  }
}

function handleGameModeUpdate(updatedGameMode: string) {
  gameMode = updatedGameMode;

  if (gameMode === MULTI_PLAYER) {
    // TODO: disconnet from room
  } else if (gameMode === SINGLE_PLAYER) {
  }
}

function startSingleplayer(customizations: CustomizationInterface) {
  game.participants = [SINGLE_PLAYER];
  game.gameClients = {
    [SINGLE_PLAYER]: defaultClientGame,
  };

  // Set up game
  game.customizations = customizations;
  // Calculating path length to determine what to put in histories
  let pathLength = 2;
  if (game.customizations.mode.type === MODE_PATH) {
    pathLength += game.customizations.mode.path?.connections.length ?? 0;
  }

  game.gameStatus = {
    playing: true,
    paused: false,
    pauseStart: 0,
    pauseGap: 0,
    win: null,
  };

  // Initializing free-path
  if (
    game.customizations.mode.type === MODE_PATH &&
    !game.customizations.mode.path?.directed
  ) {
    game.gameClients[SINGLE_PLAYER].freePath = Array.from(
      { length: pathLength },
      () => ({ title: "???", link: "www.wikipedia.org" })
    );
  }

  // Node history
  game.gameClients[SINGLE_PLAYER].nodeHistory = Array.from(
    { length: pathLength },
    () => ({ clicks: 0, arriveTime: -1 }) 
  );

  game.gameClients[SINGLE_PLAYER].edgeHistory = Array.from(
    { length: pathLength - 1 },
    () => []
  );

  game.gameClients[SINGLE_PLAYER].visitedPath = [game.customizations.start];

  chrome.tabs.create({ url: game.customizations.start.link }, (newTab) => {
    // Initializing time
    game.startTime = Date.now();
    game.gameClients[SINGLE_PLAYER].nodeHistory[0].arriveTime = game.startTime;

    chrome.storage.local.set(
      { [GAME]: game, [WIN]: false, [TAB_ID]: newTab.id },
      () => {}
    );
  });
}

// ONLY AFTER GAME_STARTED and MODE === MULTI_PLAYER
function startMultiplayer() {}

// TODO: the pausing logic completely changes...

function handlePauseSingleplayer() {}

function handleUnpauseSingleplayer() {}

function handleWikipediaClick(link : string) {
    
}
