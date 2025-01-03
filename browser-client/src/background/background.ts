import {
  Article,
  CLICK_COUNT,
  CustomizationInterface,
  defaultClientGame,
  END_CAUSE,
  SingleplayerEvents,
  GAME,
  GAME_CUSTOMIZATIONS,
  GAME_MODE,
  GameInterface,
  GET_TAB_ID,
  Mode,
  GamePlayMode,
  PLAYER,
  TAB_ID,
  VIEWING_PLAYER,
  WIKIPEDIA_CLICK,
  UpdateInformation,
  InformationUpdated,
 
} from "../utils/utils";


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case UpdateInformation.Customization: // from singleplayer or multiplayer host
      handleCustomizationsUpdate(message.customizations);
      break;
    case UpdateInformation.GameMode: // from the user themselves
      handleGameModeUpdate(message.game_mode);
      break;
    case SingleplayerEvents.Start: // in general?
      startSingleplayerGame(message.customizations);    
      break;
    case WIKIPEDIA_CLICK: // in general
        handleWikipediaClick(message.page);
        break;
    case InformationUpdated.ViewingPlayer: // multiplayer
        handleUpdatedViewingPlayer(message.clientID);
        break;
    case SingleplayerEvents.Pause: // singleplayer
        handleSingleplayerPause();
        break;
    case SingleplayerEvents.Unpause: // singleplayer
        handleSingleplayerUnpause();
        break;
    case GET_TAB_ID: // general
        sendTabId(sender, sendResponse);
        return true;
    case SingleplayerEvents.Finish: // singleplayer
      endSingleplayerGame(message.cause);
      break;
  }
  sendResponse({required:true})
});

// TODO: bruh we have to move this all into persistent storage, otherwise if the bg script goes inactive then

function endSingleplayerGame(cause: string) {

  chrome.storage.local.get([GAME, PLAYER], (result) => {  
      let game : GameInterface = result[GAME];
      let player : string = result[PLAYER];

      game.gameStatus.playing = false;
    
      // TODO: in multiplayer, have to do this for every player I guess...?
      let currentNode: number = game.gameClients[player].currentNode;

      game.gameClients[player].nodeHistory[currentNode].leaveTime = Date.now();
        
      chrome.storage.local.set({[GAME]: game, [END_CAUSE]: cause});
      
  });

}

function handleUpdatedViewingPlayer(clientID: string) {
  // viewingPlayer = clientID;
  chrome.storage.local.set({[VIEWING_PLAYER]: clientID});
}


//TODO: rename to handleSingleplayerPause?
function handleSingleplayerPause() {
  chrome.storage.local.get([GAME, GAME_MODE], (result)=> {
    let game : GameInterface = result[GAME];
    let gameMode: string = result[GAME_MODE];

    game.gameStatus.paused = true;
    game.gameStatus.pauseStart = Date.now();
    chrome.runtime.sendMessage({type: InformationUpdated.GameStatus, gameStatus: game.gameStatus})
    chrome.runtime.sendMessage({type: UpdateInformation.Pause, pause: true});
  
    pauseInterval = setInterval(() => {
      elapsedPause++;
    }, 1000);
  
    if(gameMode === GamePlayMode.MultiPlayer) {
  
    } else {
  
    }
    chrome.storage.local.set({[GAME]: game});
  });

}

let pauseInterval : NodeJS.Timeout | null = null;
let elapsedPause = 0;

function handleSingleplayerUnpause() {
  chrome.storage.local.get([GAME, GAME_MODE, PLAYER], (result) => {
    let game: GameInterface = result[GAME];
    let player: string = result[PLAYER];
    let gameMode: string = result[GAME_MODE];

    console.log("player is: ", player);

    if(pauseInterval) {
      clearInterval(pauseInterval);
    }
  
    game.gameStatus.paused = false;
    
    if(gameMode === GamePlayMode.MultiPlayer) {
      
    } else {
  
    }
  
    // setting delay for game
    if(game.gameStatus.pauseGap != undefined) {
      game.gameStatus.pauseGap += elapsedPause;
    } else {
      game.gameStatus.pauseGap = elapsedPause;
    }
    
    // setting delay for current node
    const currentNode = game.gameClients[player].currentNode;
    game.gameClients[player].nodeHistory[currentNode].delayTime += elapsedPause;
    game.gameStatus.paused = false;

    
    chrome.runtime.sendMessage({type: InformationUpdated.GameClient, clientID: player, gameClient: game.gameClients[player]}) // TODO: complex pause in multi-player
    chrome.runtime.sendMessage({type: InformationUpdated.GameStatus, gameStatus: game.gameStatus});
    chrome.runtime.sendMessage({type: UpdateInformation.Pause, pause: false});
  
    elapsedPause = 0;
    chrome.storage.local.set({[GAME]: game});

  });
  // since interval active, background script will not go inactive so no need for persistence
}

function handleCustomizationsUpdate(
  updatedCustomizations: CustomizationInterface
) {

  // TODO: need persistence for this, only if allow multiple to edit (currently, just allow host)
  chrome.storage.local.set({[GAME_CUSTOMIZATIONS]: updatedCustomizations}, () => {
    chrome.storage.local.get([GAME_MODE], (result) => {
      let gameMode: string = result[GAME_MODE];
      if (gameMode === GamePlayMode.MultiPlayer) {
        // TODO: socket.io message
        // TODO: then we also need some sort of way to retrieve the socket.io message from client-side
      }

    })

  })
}

function handleGameModeUpdate(updatedGameMode: string) {
  chrome.storage.local.get([GAME_MODE], (result) => {
    let gameMode: string = updatedGameMode;
    chrome.storage.local.set({[GAME_MODE]: gameMode});
  
    if (gameMode === GamePlayMode.MultiPlayer) {
      // TODO: player = id
    } else if (gameMode === GamePlayMode.SinglePlayer) {
      // TODO: disconnet from room
    }

  })
}

function startSingleplayerGame(customizations: CustomizationInterface) {
  chrome.storage.local.get([GAME, PLAYER, TAB_ID, VIEWING_PLAYER], (result) => {
    let game: GameInterface = result[GAME] || defaultClientGame;
    let player: string = result[PLAYER] || GamePlayMode.SinglePlayer;
    let viewingPlayer: string = result[VIEWING_PLAYER] || GamePlayMode.SinglePlayer;
    // let tabId: number = result[TAB_ID];

    game.participants = [player];
    game.gameClients = {
      [player]: defaultClientGame,
    };
  
    // Set up game
    game.customizations = customizations;
    // Calculating path length to determine what to put in histories
    let pathLength = 2;
    if (game.customizations.mode.type === Mode.Path) {
      pathLength += game.customizations.mode.path?.connections.length ?? 0;
    }
    
    // Initializing free-path
    if (game.customizations.mode.type === Mode.Path &&
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
      ...(game.customizations.mode.type === Mode.Path ? (game.customizations.mode.path?.connections ?? []) : []),
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
    game.gameClients[player].currentNode = 0;
  
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
        { [GAME]: game, [TAB_ID]: newTab.id, [PLAYER]: player, [VIEWING_PLAYER] : viewingPlayer, 
          [END_CAUSE]: undefined, [PLAYER]: GamePlayMode.SinglePlayer
         }
      );

    });
  })
}

function sendTabId(sender : chrome.runtime.MessageSender, response : (response: {tabId: number |null}) => void) : void {
  if(sender.tab) {
    response({ tabId: sender.tab.id ?? null});
  } else {
    response({ tabId: null})
  }
}

function startMultiplayerGame() {}

function handleWikipediaClick(page : string ) {
    chrome.storage.local.get([CLICK_COUNT, GAME, PLAYER, VIEWING_PLAYER, GAME_MODE], (result) => {
      let game: GameInterface = result[GAME];
      let player: string = result[PLAYER];
      let viewingPlayer: string = result[VIEWING_PLAYER];
      let gameMode: string = result[GAME_MODE];
      
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

                    console.log("Visited new page: ", currentArticle.title, " ", currentArticle.link, " current node: ", currentNode);

                    // Updating edge history
                    let currentEdgeHistory = game.gameClients[player].edgeHistory[currentNode];
                    if(!currentEdgeHistory) {
                      currentEdgeHistory = []
                    }
                    currentEdgeHistory.push({title: pageTitle, link: page});
                    game.gameClients[player].edgeHistory[currentNode] = currentEdgeHistory;

                    // Updating node history
                    let currentNodeHistory = game.gameClients[player].nodeHistory[currentNode];
                    currentNodeHistory.clicks++;
                    game.gameClients[player].nodeHistory[currentNode] = currentNodeHistory;

                    if(game.customizations.mode.path?.directed === true || game.customizations.mode.type !== Mode.Path) {
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
                    
                    if(gameMode === GamePlayMode.MultiPlayer) {
                      // TODO: send message to socket.io server
                    } else if (gameMode === GamePlayMode.SinglePlayer) {
                      chrome.runtime.sendMessage({
                        type: InformationUpdated.GameClient,
                        clientID: viewingPlayer,
                        gameClient: game.gameClients[viewingPlayer]
                      });
                    }
                    
      
                    // Checking if the game has been won with this click     
                    if(game.gameClients[player].currentNode === game.path.length - 1
                      && (currentArticle.link == game.customizations.end.link)) {
                        if(gameMode === GamePlayMode.SinglePlayer) {
                          endSingleplayerGame(SingleplayerEvents.Win);
                        } else if (gameMode === GamePlayMode.MultiPlayer) {
                          
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
    chrome.storage.local.get([GAME, TAB_ID], (result) => {
      let game: GameInterface = result[GAME];
      let tabId: number = result[TAB_ID];

      if(game.gameStatus.playing) {
        if(details.tabId != tabId) {
          endSingleplayerGame(SingleplayerEvents.ExternalWikiVisit)
        }
      }
    })
  }
});

// TODO: what happened to how we were checking for internet Lol