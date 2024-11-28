import {
  Article,
    CLICK_COUNT,
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultArticle,
  defaultClientGame,
  defaultCustomizations,
  defaultGame,
  DONE_SINGLEPLAYER,
  END_CAUSE,
  EXTERNAL_WIKI_VISIT,
  FINISH_SINGLEPLAYER_GAME,
  GAME,
  GAME_MODE,
  GameInterface,
  GET_TAB_ID,
  MODE_PATH,
  MULTI_PLAYER,
  PAUSE,
  PLAYER,
  SINGLE_PLAYER,
  SINGLEPLAYER_WIN,
  START_GAME,
  TAB_ID,
  UNPAUSE,
  UPDATE_CUSTOMIZATION,
  UPDATE_GAME_MODE,
  UPDATE_PAUSE,
  UPDATED_GAME_CLIENT,
  UPDATED_GAME_STATUS,
  UPDATED_VIEWING_PLAYER,
  VIEWING_PLAYER,
  WIKIPEDIA_CLICK,
  WIN,
} from "../utils/utils";

let gameMode: string = SINGLE_PLAYER;
let gameCustomizations: CustomizationInterface = defaultCustomizations;
let game: GameInterface = defaultGame;
let player: string = SINGLE_PLAYER;
let viewingPlayer: string = SINGLE_PLAYER;
let tabId: number = -1;

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
        break;
    case UPDATED_VIEWING_PLAYER:
        handleUpdatedViewingPlayer(message.clientID);
        break;
    case PAUSE:
        handlePause();
        break;
    case UNPAUSE:
        handleUnpause();
        break;
    case GET_TAB_ID:
        sendTabId(sender, sendResponse);
        break;
    case FINISH_SINGLEPLAYER_GAME:
      endSingleplayerGame(message.cause);
      break;

  }

  return false;
});

function endSingleplayerGame(cause: string) {


  chrome.storage.local.set({[END_CAUSE] : cause}, () => {
    chrome.runtime.sendMessage({type: DONE_SINGLEPLAYER});
  });
}

function handleUpdatedViewingPlayer(clientID: string) {
  viewingPlayer = clientID;
}

function handlePause() {
  game.gameStatus.paused = true;
  game.gameStatus.pauseStart = Date.now();
  chrome.runtime.sendMessage({type: UPDATE_PAUSE, pause: true});
  chrome.runtime.sendMessage({type: UPDATED_GAME_STATUS, gameStatus: game.gameStatus})

  pauseInterval = setInterval(() => {
    elapsedPause++;
  }, 1000);

  if(gameMode === MULTI_PLAYER) {

  } else {

  }

}

let pauseInterval : NodeJS.Timeout | null = null;
let elapsedPause = 0;

function handleUnpause() {
  if(pauseInterval) {
    clearInterval(pauseInterval);
  }

  game.gameStatus.paused = false;
  chrome.runtime.sendMessage({type: UPDATE_PAUSE, pause: false});

  if(gameMode === MULTI_PLAYER) {

  } else {

  }

  // setting delay for game
  if(game.gameStatus.pauseGap != undefined) {
    game.gameStatus.pauseGap += elapsedPause;
  } else {
    game.gameStatus.pauseGap = elapsedPause;
  }

  // TODO: this only works for singleplayer currently
  // setting delay for current node
  const currentNode = game.gameClients[player].currentNode;
  game.gameClients[player].nodeHistory[currentNode].delayTime += elapsedPause;
  game.gameStatus.paused = false;
  chrome.runtime.sendMessage({type: UPDATED_GAME_CLIENT, clientID: player, gameClient: game.gameClients[player]}) // TODO: complex pause in multi-player
  chrome.runtime.sendMessage({type: UPDATED_GAME_STATUS, gameStatus: game.gameStatus});

  elapsedPause = 0;
}

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
  chrome.storage.local.set({[GAME_MODE]: gameMode});

  if (gameMode === MULTI_PLAYER) {
    // TODO: player = id
  } else if (gameMode === SINGLE_PLAYER) {
    // TODO: disconnet from room
  }
}

function startSingleplayer(customizations: CustomizationInterface) {
  game.participants = [player];
  game.gameClients = {
    [player]: defaultClientGame,
  };

  // Set up game
  game.customizations = customizations;
  // Calculating path length to determine what to put in histories
  let pathLength = 2;
  if (game.customizations.mode.type === MODE_PATH) {
    pathLength += game.customizations.mode.path?.connections.length ?? 0;
  }



  // Initializing free-path
  if (game.customizations.mode.type === MODE_PATH &&
    !game.customizations.mode.path?.directed) {
    game.gameClients[player].freePath = Array.from(
      { length: pathLength },
      () => ({ title: "???", link: "www.wikipedia.org" })
    );
    game.gameClients[player].freePath[0] = customizations.start;
    game.gameClients[player].freePath[pathLength-1] = customizations.end;
  }

  // Game Path
  game.path = [
    game.customizations.start,
    ...(game.customizations.mode.type === MODE_PATH ? (game.customizations.mode.path?.connections ?? []) : []),
    game.customizations.end
  ];

  // Node history
  game.gameClients[player].nodeHistory = Array.from(
    { length: pathLength },
    () => ({ clicks: 0, leaveTime: null, delayTime: 0 }) 
  );
  
  // Edge history
  game.gameClients[player].edgeHistory = Array.from(
    { length: pathLength - 1 },
    () => []
  );

  game.gameClients[player].visitedPath = [game.customizations.start];

  chrome.tabs.create({ url: game.customizations.start.link }, (newTab) => {
    // Initializing time
    game.gameStatus = {
      startTime: Date.now(),
      playing: true,
      paused: false,
      pauseStart: 0,
      pauseGap: 0,
      win: null,
    };

    chrome.storage.local.set(
      { [GAME]: game, [WIN]: false, [TAB_ID]: newTab.id, [PLAYER]: player, [VIEWING_PLAYER] : viewingPlayer },
      () => {
        tabId = newTab.id ?? 0;
      }
    );
  });
}

function sendTabId(sender : chrome.runtime.MessageSender, response : (response: {tabId: number |null}) => void) : void {
  if(sender.tab) {
    response({ tabId: sender.tab.id ?? null});
  } else {
    response({ tabId: null})
  }
}

// ONLY AFTER GAME_STARTED and MODE === MULTI_PLAYER
function startMultiplayer() {}

// TODO: the pausing logic completely changes...

function handlePauseSingleplayer() {}

function handleUnpauseSingleplayer() {}

function handleWikipediaClick(page : string ) {
    chrome.storage.local.get([CLICK_COUNT], (result) => {
        if(game.gameStatus.playing) {

            // Retrieve and implement clicks
            let clicks = result[CLICK_COUNT] || 0;
            clicks++;
            chrome.storage.local.set({[CLICK_COUNT] : clicks});

            const currentNode = game.gameClients[player].currentNode;
            const nextPage = game.path[currentNode + 1];

            const searchTitle = page.split("/").pop();
            fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`)
            .then((response) => response.json())
            .then((data) => {
                if(data.title) {
                    const pageTitle = data.title;

                    const currentArticle: Article = {
                      title: pageTitle,
                      link: page
                    };

                    console.log("Visited new page: ", currentArticle.title, " ", currentArticle.link);

                    // Updating edge history
                    let currentEdgeHistory = game.gameClients[player].edgeHistory[currentNode];
                    currentEdgeHistory.push({title: pageTitle, link: page});
                    game.gameClients[player].edgeHistory[currentNode] = currentEdgeHistory;

                    // Updating node history
                    let currentNodeHistory = game.gameClients[player].nodeHistory[currentNode];
                    currentNodeHistory.clicks++;
                    game.gameClients[player].nodeHistory[currentNode] = currentNodeHistory;

                    if(game.customizations.mode.path?.directed === true || game.customizations.mode.type !== MODE_PATH) {
                        if(page === nextPage.link) {
                            game.gameClients[player].nodeHistory[currentNode].leaveTime = Date.now();
                            game.gameClients[player].currentNode++;
                            game.gameClients[player].visitedPath.push(currentArticle);

                           
                        }
                    } else if (game.customizations.mode.path?.directed === false) {
                        if(game.path.map((article) => article.link).includes(page) && 
                        !game.gameClients[player].visitedPath.includes(currentArticle)
                        && (page === game.customizations.end.link ? currentNode === game.path.length - 2 : true)) {
                           game.gameClients[player].nodeHistory[currentNode].leaveTime = Date.now();
                           game.gameClients[player].currentNode++;
                           game.gameClients[player].freePath[game.gameClients[player].currentNode] = currentArticle;
                           game.gameClients[player].visitedPath.push(currentArticle);                     
                        }
                    }

                    // TODO: for multiplayer, maybe keep a single game object saved for the current player (in case any overwrites)
                    // !! apparently no overwrites
                    chrome.storage.local.set({
                      [GAME] : game
                    });
                    
                    if(gameMode === MULTI_PLAYER) {
                      // TODO: send message to socket.io server
                    } else if (gameMode === SINGLE_PLAYER) {
                      chrome.runtime.sendMessage({
                        type: UPDATED_GAME_CLIENT,
                        clientID: viewingPlayer,
                        gameClient: game.gameClients[viewingPlayer]
                      });
                    }
                    
      
                    // Checking if the game has been won with this click     
                    if(game.gameClients[player].currentNode === game.path.length - 1
                      && (currentArticle.link == game.customizations.end.link)) {
                        if(gameMode === SINGLE_PLAYER) {
                          chrome.runtime.sendMessage({
                            type: FINISH_SINGLEPLAYER_GAME,
                            cause: SINGLEPLAYER_WIN
                          })
                        } else if (gameMode === MULTI_PLAYER) {
                          
                        }
                      }
                      
                    // TODO: if end and multiplayer, send message


                }
            })
            .catch((error) => {
              console.error("Error fetching page title: ", error);
            });
        }
    }) 
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if(details.url.includes("wikipedia.org")) {
    if(game.gameStatus.playing) {
      if(details.tabId != tabId) {
        // TODO: now how do we do it
        chrome.runtime.sendMessage({
          type: FINISH_SINGLEPLAYER_GAME,
          cause: EXTERNAL_WIKI_VISIT
        });
      }
    }
  }
});

console.log("on new device");