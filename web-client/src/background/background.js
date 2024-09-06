import * as utils from "@utils/utils.js";
let singleplayerCustomizations = utils.defaultSingleplayerCustomizations;
let singleplayerGameProperties = utils.defaultGameProperties;
let singleplayerGameInformation = utils.defaultGameInformation;

chrome.storage.local.get([utils.SINGLEPLAYER_CUSTOMIZATIONS,
  utils.SINGLEPLAYER_GAME_INFORMATION, utils.SINGLEPLAYER_GAME_PROPERTIES], (result) => {
    if(result[utils.SINGLEPLAYER_CUSTOMIZATIONS]) {
      singleplayerCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS];
    }

    if(result[utils.SINGLEPLAYER_GAME_INFORMATION]) {
      singleplayerGameInformation = result[utils.SINGLEPLAYER_GAME_INFORMATION];
    }

    if(result[utils.SINGLEPLAYER_GAME_PROPERTIES]) {
      singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
    }
  });

let timerInterval;

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName == "local") {
    // may have to restrucutre in the future
    const customizationsChange = changes[utils.SINGLEPLAYER_CUSTOMIZATIONS];
    const gamePropertyChanges = changes[utils.SINGLEPLAYER_GAME_PROPERTIES];
    const gameInformationChanges = changes[utils.SINGLEPLAYER_GAME_INFORMATION];
    const elapsedTimeChanges = changes[utils.ELAPSED_TIME];

    if (customizationsChange && customizationsChange.newValue != null) {
      singleplayerCustomizations = customizationsChange.newValue;
    }

    if (gamePropertyChanges && gamePropertyChanges.newValue != null) {
      singleplayerGameProperties = gamePropertyChanges.newValue;
    }

    if (gameInformationChanges && gameInformationChanges.newValue != null) {      
      singleplayerGameInformation = gameInformationChanges.newValue; 
    }

    if (elapsedTimeChanges && elapsedTimeChanges.newValue != null) {
      handleTimeUpdate(elapsedTimeChanges);
    }
  }
});

function handleTimeUpdate(elapsedTimeChanges) {
  let currentNode = singleplayerGameInformation.currentNode;
  let nodeHistory = singleplayerGameInformation.nodeHistory;
  const updatedTime = elapsedTimeChanges.newValue;

  const mode = singleplayerCustomizations.mode.type;
  const countDown = singleplayerCustomizations.mode["count-down"].timer;

  if (mode === "count-down" && countDown - updatedTime < 0) { 
    stopPlaying();
    chrome.storage.local.set({ [utils.SINGLEPLAYER_TIME_FINISHED] : true})
  } else {
    let currentNodeHistory = nodeHistory[currentNode] || {
      elapsedTime: 0,
      clicks: 0,
    };
    currentNodeHistory.elapsedTime =
      currentNode > 0
        ? updatedTime -
          nodeHistory
            .slice(0, currentNode)
            .reduce((total, node) => total + (node.elapsedTime || 0), 0)
        : updatedTime;

    nodeHistory[currentNode] = currentNodeHistory;

    const updatedGameInformation = {
      ...singleplayerGameInformation,
      nodeHistory: nodeHistory,
    };

    chrome.storage.local.set({
      [utils.SINGLEPLAYER_GAME_INFORMATION]: updatedGameInformation,
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
  switch (message.action) {
    case utils.START_SINGLEPLAYER:
      startSingleplayer();
      break;

    case utils.PAUSE_SINGLEPLAYER:
      pauseSingleplayer();
      break;

    case utils.UNPAUSE_SINGLEPLAYER:
      unpauseSingleplayer();
      break;

    case utils.QUIT_SINGLEPLAYER:
      chrome.storage.local.set({[utils.SINGLEPLAYER_GAME_QUIT] : true});
      stopPlaying();
      break;

    case utils.WIKIPEDIA_CLICK:
      handleWikipediaClick(message);
      break;

    case utils.SINGLEPLAYER_WIN:
      // Handle singleplayer win action here
      break;

    case "reset":
      chrome.storage.local.clear();
      break;

    case "get_tab_id":
      sendTabId(sender, response);
      break;

    case utils.SINGLEPLAYER_CLEAR_END:
      clearEndFlags();
      break;

    default:
      console.warn("Unknown action:", message.action);
  }

  return true;
});

function sendTabId(sender, response) {
  if(sender.tab) {
    response({ tabId: sender.tab.id });
  } else {
    response({ tabId: null });
  }
}

function pauseSingleplayer() {
  chrome.storage.local.get([utils.SINGLEPLAYER_GAME_INFORMATION], (result) => {
    if (result[utils.SINGLEPLAYER_GAME_INFORMATION]) {
      singleplayerGameInformation = result[utils.SINGLEPLAYER_GAME_INFORMATION];
      if (
        singleplayerGameInformation.status.playing &&
        !singleplayerGameInformation.status.paused
      ) {
        singleplayerGameInformation.status.paused = true;
        singleplayerGameInformation.status.pauseStart = Date.now();
        clearInterval(timerInterval);
        chrome.storage.local.set({
          [utils.SINGLEPLAYER_GAME_INFORMATION]: singleplayerGameInformation,
        });
      }
    }
  });

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "pause_updated",
        updatedPause: true,
      });
    } 
  });
}

function unpauseSingleplayer() {
  chrome.storage.local.get(
    [utils.SINGLEPLAYER_GAME_INFORMATION, utils.SINGLEPLAYER_GAME_PROPERTIES],
    (result) => {
      if (result[utils.SINGLEPLAYER_GAME_INFORMATION] && result[utils.SINGLEPLAYER_GAME_PROPERTIES]) {
        singleplayerGameInformation =
          result[utils.SINGLEPLAYER_GAME_INFORMATION];
        singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
        if (singleplayerGameInformation.status.playing && singleplayerGameInformation.status.paused) {
          singleplayerGameInformation.status.paused = false;
          const pausedDuration =
            Date.now() - singleplayerGameInformation.status.pauseStart;
          singleplayerGameInformation.status.pauseGap += pausedDuration;
          singleplayerGameInformation.status.pauseStart = 0;
          timerInterval = setInterval(() => {
            const elapsedTime = Math.floor(
              (Date.now() -
                singleplayerGameProperties.startTime -
                singleplayerGameInformation.status.pauseGap) /
                1000
            );
            chrome.storage.local.set({ [utils.ELAPSED_TIME]: elapsedTime });
          }, 1000);
          console.log(singleplayerGameInformation);
          chrome.storage.local.set({
            [utils.SINGLEPLAYER_GAME_INFORMATION]: singleplayerGameInformation,
          });
        }
      }
    }
  );

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "pause_updated",
        updatedPause: false,
      });
    } 
  });
}

function startSingleplayer() {
  chrome.tabs.create(
    { url: singleplayerCustomizations.start.link },
    (newTab) => {
      singleplayerGameProperties.startTime = Date.now();
      singleplayerGameProperties.path = [
        singleplayerCustomizations.start,
        ...(singleplayerCustomizations.mode.type === "path"
          ? singleplayerCustomizations.mode.path.intermediate_links
          : []),
        singleplayerCustomizations.end,
      ];

      const pathLength = singleplayerGameProperties.path.length;

      chrome.storage.local.set({
        [utils.SINGLEPLAYER_GAME_PROPERTIES]: singleplayerGameProperties,
      });

      singleplayerGameInformation.status = {
        playing: true,
        paused: false,
        pauseStart: 0,
        pauseGap: 0,
      };

      if (
        singleplayerCustomizations.mode.type === "path" && !singleplayerCustomizations.mode.path.directed) {
        singleplayerGameInformation.freePath = Array.from(
          { length: pathLength },
          () => ({ title: "???", link: "www.wikipedia.org" })
        );

        singleplayerGameInformation.freePath[0] =
          singleplayerCustomizations.start;
        singleplayerGameInformation.freePath[pathLength - 1] =
          singleplayerCustomizations.end;
      }

      singleplayerGameInformation.nodeHistory = Array.from(
        { length: pathLength },
        () => ({ clicks: 0, elapsedTime: 0 })
      );

      singleplayerGameInformation.edgeHistory = Array.from(
        { length: pathLength - 1 },
        () => []
      );

      singleplayerGameInformation.visitedPath = [
        singleplayerCustomizations.start.link,
      ];

      chrome.storage.local.set({
        [utils.SINGLEPLAYER_GAME_INFORMATION]: singleplayerGameInformation,
      });

      chrome.storage.local.set({
        [utils.SINGLEPLAYER_GAME_WIN]: false,
      });

      if (singleplayerGameInformation.status.playing) {
        timerInterval = setInterval(() => {
          const elapsedTime = Math.floor(
            (Date.now() -
              singleplayerGameProperties.startTime -
              singleplayerGameInformation.status.pauseGap) /
              1000
          );
          chrome.storage.local.set({ [utils.ELAPSED_TIME]: elapsedTime });
        }, 1000);
      }
      chrome.storage.local.set({ [utils.TAB_ID]: newTab.id }); // SETTING THE TAB ID
    }
  );
}

function handleWikipediaClick(message) {
  chrome.storage.local.get(
    [
      utils.SINGLEPLAYER_GAME_INFORMATION,
      utils.SINGLEPLAYER_GAME_PROPERTIES,
      utils.CLICK_COUNT,
      utils.SINGLEPLAYER_CUSTOMIZATIONS,
    ],
    (result) => {
      if (result[utils.SINGLEPLAYER_GAME_INFORMATION] && result[utils.SINGLEPLAYER_GAME_PROPERTIES] && result[utils.SINGLEPLAYER_CUSTOMIZATIONS]) {
        singleplayerGameInformation = result[utils.SINGLEPLAYER_GAME_INFORMATION];
        singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
        singleplayerCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS];

        if (singleplayerGameInformation.status.playing) {
          let clicks = result[utils.CLICK_COUNT] || 0;
          clicks++;
          chrome.storage.local.set({ [utils.CLICK_COUNT]: clicks });

          const pageUrl = message.page;
          const currentNode = singleplayerGameInformation.currentNode;
          const nextPage = singleplayerGameProperties.path[currentNode + 1];

          const searchTitle = pageUrl.split("/").pop();
          fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.title) {
                const pageTitle = data.title;
                let currentEdgeHistory =
                  singleplayerGameInformation.edgeHistory[currentNode] || [];
                currentEdgeHistory.push({ url: pageUrl, title: pageTitle });
                singleplayerGameInformation.edgeHistory[currentNode] =
                  currentEdgeHistory;

                let currentNodeHistory = singleplayerGameInformation
                  .nodeHistory[currentNode] || { clicks: 0, elapsedTime: 0 };
                currentNodeHistory.clicks++;
                singleplayerGameInformation.nodeHistory[currentNode] =
                  currentNodeHistory;

                if (singleplayerCustomizations.mode.path.directed) {
                  if (pageUrl === nextPage.link) {
                    singleplayerGameInformation.currentNode++;
                    singleplayerGameInformation.visitedPath.push(pageUrl);
                  }
                } else {
                  if (
                    singleplayerGameProperties.path
                      .map((article) => article.link)
                      .includes(pageUrl) &&
                    !singleplayerGameInformation.visitedPath.includes(
                      pageUrl
                    ) &&
                    (pageUrl === singleplayerCustomizations.end.link
                      ? currentNode ===
                        singleplayerGameProperties.path.length - 2
                      : true)
                  ) {
                    singleplayerGameInformation.currentNode++;
                    singleplayerGameInformation.freePath[
                      singleplayerGameInformation.currentNode
                    ] = {
                      title: data.title,
                      link: pageUrl,
                    };
                    singleplayerGameInformation.visitedPath.push(pageUrl);
                  }
                }
                chrome.storage.local.set({
                  [utils.SINGLEPLAYER_GAME_INFORMATION]:
                    singleplayerGameInformation,
                });

                if (
                  singleplayerGameInformation.currentNode ===
                    singleplayerGameProperties.path.length - 1 &&
                  pageUrl === singleplayerCustomizations.end.link
                ) {
                  stopPlaying();
                  chrome.storage.local.set({
                    [utils.SINGLEPLAYER_GAME_WIN]: true,
                  });
                  // chrome.runtime.sendMessage({ action: "singleplayer-win" });
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching page title: ", error);
            });
        }
      }
    }
  );
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.url.includes("wikipedia.org")) {
    chrome.storage.local.get(
      [utils.TAB_ID, utils.SINGLEPLAYER_GAME_INFORMATION],
      (result) => {
        const storedGameInformation =
          result[utils.SINGLEPLAYER_GAME_INFORMATION];
        if (storedGameInformation) {
          if (storedGameInformation.status.playing) {
            const storedTabId = result[utils.TAB_ID];
            const currentTabId = details.tabId;

            if (storedTabId) {
              if (storedTabId !== currentTabId) {
                stopPlaying();
                chrome.storage.local.set({ [utils.EXTERNAL_WIKI_VISIT]: true });
              }
            }
          }
        }
      }
    );
  }
});

function stopPlaying() {
  clearInterval(timerInterval);
  singleplayerGameInformation.status.playing = false; // do we need this?

  const endGame = {
    singleplayerGameProperties,
    singleplayerGameInformation,
    singleplayerCustomizations
  }

  chrome.storage.local.set({ [utils.END_GAME_INFO] : endGame})

  chrome.storage.local.set({
    [utils.SINGLEPLAYER_GAME_PROPERTIES] : utils.defaultGameProperties
  });
  chrome.storage.local.set({
    [utils.SINGLEPLAYER_GAME_INFORMATION] : utils.defaultGameInformation
  });
}

function clearEndFlags() {
  chrome.storage.local.set({ [utils.END_GAME_INFO]: utils.defaultEndGameInfo})
  chrome.storage.local.set({ [utils.SINGLEPLAYER_GAME_WIN] : false});
  chrome.storage.local.set({ [utils.ELAPSED_TIME]: 0});
  chrome.storage.local.set({ [utils.CLICK_COUNT] : 0});
  chrome.storage.local.set({ [utils.TAB_ID]: null});
  chrome.storage.local.set({ [utils.EXTERNAL_WIKI_VISIT]: false});
  chrome.storage.local.set({ [utils.SINGLEPLAYER_TIME_FINISHED] : false});
  chrome.storage.local.set({ [utils.SINGLEPLAYER_GAME_QUIT] : false});
}

