import {
  Article,
    CLICK_COUNT,
  CustomizationInterface,
  CUSTOMIZATIONS,
  defaultArticle,
  defaultClientGame,
  defaultCustomizations,
  defaultGame,
  GAME,
  GAME_MODE,
  GameInterface,
  MODE_PATH,
  MULTI_PLAYER,
  PLAYER,
  SINGLE_PLAYER,
  START_GAME,
  TAB_ID,
  UPDATE_CUSTOMIZATION,
  UPDATE_GAME_MODE,
  UPDATED_GAME_CLIENT,
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

  }

  return false;
});

function handleUpdatedViewingPlayer(clientID: string) {
  viewingPlayer = clientID;
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
    game.gameClients[player].freePath = Array.from(
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
  game.gameClients[player].nodeHistory = Array.from(
    { length: pathLength },
    () => ({ clicks: 0, arriveTime: null }) 
  );
  
  // Edge history
  game.gameClients[player].edgeHistory = Array.from(
    { length: pathLength - 1 },
    () => []
  );

  game.gameClients[player].visitedPath = [game.customizations.start];

  chrome.tabs.create({ url: game.customizations.start.link }, (newTab) => {
    // Initializing time
    game.startTime = Date.now();
    game.gameClients[player].nodeHistory[0].arriveTime = game.startTime;

    chrome.storage.local.set(
      { [GAME]: game, [WIN]: false, [TAB_ID]: newTab.id, [PLAYER]: player, [VIEWING_PLAYER] : viewingPlayer },
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
                            game.gameClients[player].currentNode++;
                            game.gameClients[player].visitedPath.push(currentArticle);

                            // Updating arrive-time for the next node
                            setNextNodeArrivedTime(currentNode);
                        }
                    } else if (game.customizations.mode.path?.directed === false) {
                        if(game.path.map((article) => article.link).includes(page) && 
                        !game.gameClients[player].visitedPath.includes(currentArticle)
                        && (page === game.customizations.end.link ? currentNode === game.path.length - 2 : true)) {
                           game.gameClients[player].currentNode++;
                           game.gameClients[player].freePath[game.gameClients[player].currentNode] = currentArticle;
                           game.gameClients[player].visitedPath.push(currentArticle);

                          // Updating arrive-time for the next node
                          setNextNodeArrivedTime(currentNode);                        
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
                      console.log("Sent the message about updated game client");
                    }
                    
                    
                    // Checking if the game has been won with this click     
                    if(game.gameClients[player].currentNode === game.path.length - 1
                      && (currentArticle.link == game.customizations.end.link)) {
                        if(gameMode === SINGLE_PLAYER) {
                          // TODO: send message of win
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

function setNextNodeArrivedTime(currentNode: number) {
  let nextNodeHistory = game.gameClients[player].nodeHistory[currentNode +1];
  nextNodeHistory.arriveTime = Date.now();
  game.gameClients[player].nodeHistory[currentNode + 1] = nextNodeHistory; 
}