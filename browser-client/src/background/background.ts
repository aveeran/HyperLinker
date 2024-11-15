import {
    CLICK_COUNT,
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
        handleWikipediaClick(message.page);
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
  if (game.customizations.mode.type === MODE_PATH &&
    !game.customizations.mode.path?.directed) {
    game.gameClients[SINGLE_PLAYER].freePath = Array.from(
      { length: pathLength },
      () => ({ title: "???", link: "www.wikipedia.org" })
    );
  }

  // Game Path
  game.path = [
    game.customizations.start,
    ...(game.customizations.mode.type === MODE_PATH ? (game.customizations.mode.path?.connections ?? []) : []),
    game.customizations.end
  ];

  // Node history
  game.gameClients[SINGLE_PLAYER].nodeHistory = Array.from(
    { length: pathLength },
    () => ({ clicks: 0, arriveTime: -1 }) 
  );
  
  // Edge history
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

function handleWikipediaClick(page : string ) {
    chrome.storage.local.get([CLICK_COUNT], (result) => {
        if(game.gameStatus.playing) {
            let clicks = result[CLICK_COUNT] || 0;
            clicks++;
            chrome.storage.local.set({[CLICK_COUNT] : clicks});

            const currentNode = game.gameClients[SINGLE_PLAYER].currentNode; // TODO: maybe instead of SINGLE_PLAYER, we use another IDENTITY that we set (to id)
            const nextPage = game.path[currentNode + 1];

            const searchTitle = page.split("/").pop();
            fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`)
            .then((response) => response.json())
            .then((data) => {
                if(data.title) {
                    const pageTitle = data.title;

                    // Updating edge history
                    let currentEdgeHistory = game.gameClients[SINGLE_PLAYER].edgeHistory[currentNode];
                    currentEdgeHistory.push({title: pageTitle, link: page});
                    game.gameClients[SINGLE_PLAYER].edgeHistory[currentNode] = currentEdgeHistory;

                    // Updating node history
                    let currentNodeHistory = game.gameClients[SINGLE_PLAYER].nodeHistory[currentNode];
                    currentNodeHistory.clicks++;
                    game.gameClients[SINGLE_PLAYER].nodeHistory[currentNode] = currentNodeHistory;

                    if(game.customizations.mode.path?.directed === true) {
                        if(page === nextPage.link) {
                            game.gameClients[SINGLE_PLAYER].currentNode++;
                            game.gameClients[SINGLE_PLAYER].visitedPath.push({title: pageTitle, link: page});
                        }
                    } 
                    // TODO: WHAT THE FUCK DOES THIS CODE DO
                    else if (game.customizations.mode.path?.directed === false) {
                        if(game.path.map((article) => article.link).includes(page) && 
                        !game.gameClients[SINGLE_PLAYER].visitedPath.includes({title: pageTitle, link: page})
                        && (page === game.customizations.end.link ? currentNode === game.path.length - 2 : true)) {
                           game.gameClients[SINGLE_PLAYER].currentNode++;
                           game.gameClients[SINGLE_PLAYER].freePath[game.gameClients[SINGLE_PLAYER].currentNode] = {
                            title: pageTitle,
                            link:page
                           } ;
                           game.gameClients[SINGLE_PLAYER].visitedPath.push({title: pageTitle, link: page});
                        }
                    }
                    // TODO: can optimize by creating article = {pageTitle, page}

                    // store

                    // if multiplayer, send out updated object gameClients[SINGLE_PLAYER]

                    // check if end

                    // if end and multiplayer, send message


                }
            });
        }
    }) 
}
