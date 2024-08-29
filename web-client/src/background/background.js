import * as utils from "@utils/utils.js";
let singleplayerCustomizations = utils.defaultSingleplayerCustomizations;
let singleplayerGameProperties = utils.defaultGameProperties;
let singleplayerGameInformation = utils.defaultGameInformation;

// chrome.storage.local.get([utils.SINGLEPLAYER_CUSTOMIZATIONS,
//   utils.SINGLEPLAYER_GAME_INFORMATION, utils.SINGLEPLAYER_GAME_PROPERTIES], (result) => {
//     if(result[utils.SINGLEPLAYER_CUSTOMIZATIONS]) {
//       singleplayerCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS];
//     }

//     if(result[utils.SINGLEPLAYER_GAME_INFORMATION]) {
//       singleplayerGameInformation = result[utils.SINGLEPLAYER_GAME_INFORMATION];
//     }

//     if(result[utils.SINGLEPLAYER_GAME_PROPERTIES]) {
//       singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
//     }
//   });

let timerInterval;
let isTimerRunning;

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

  let currentNodeHistory = nodeHistory[currentNode];
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

chrome.runtime.onMessage.addListener((message, sender, response) => {
  //TODO: switch this to cases
  if (message.action === utils.START_SINGLEPLAYER) {
    // SHOULD WE MAKE THESE CONSTANTS??
    startSingleplayer();
  }

  if (message.action === utils.PAUSE_SINGLEPLAYER) {
    console.log("received paused");
    pauseSingleplayer();
  }

  if (message.action === utils.UNPAUSE_SINGLEPLAYER) {
    console.log(
      "received unpaused-----------------------------------------------------"
    );
    unpauseSingleplayer();
  }

  if (message.action === utils.QUIT_SINGLEPLAYER) {
    singleplayerGameInformation = utils.defaultGameInformation;
    singleplayerGameProperties = utils.defaultGameProperties;
    chrome.storage.local.set({ [utils.TAB_ID]: null });
  }

  if (message.action === utils.WIKIPEDIA_CLICK) {
    handleWikipediaClick(message);
  }

  if (message.action === utils.SINGLEPLAYER_WIN) {
    // we do not deal with it here?
  }

  if (message.action === "reset") {
    chrome.storage.local.clear();
  }
});

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
        // if (isTimerRunning) {
        // isTimerRunning = false;
        // }
        chrome.storage.local.set({
          [utils.SINGLEPLAYER_GAME_INFORMATION]: singleplayerGameInformation,
        });
      }
    }
  });
  // chrome.runtime.sendMessage({ action: "pause_wikipedia"});
}

function unpauseSingleplayer() {
  chrome.storage.local.get(
    [utils.SINGLEPLAYER_GAME_INFORMATION, utils.SINGLEPLAYER_GAME_PROPERTIES],
    (result) => {
      if (
        result[utils.SINGLEPLAYER_GAME_INFORMATION] &&
        result[utils.SINGLEPLAYER_GAME_PROPERTIES]
      ) {
        singleplayerGameInformation =
          result[utils.SINGLEPLAYER_GAME_INFORMATION];
        singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
        if (
          singleplayerGameInformation.status.playing &&
          singleplayerGameInformation.status.paused
        ) {
          singleplayerGameInformation.status.paused = false;
          const pausedDuration =
            Date.now() - singleplayerGameInformation.status.pauseStart;
          singleplayerGameInformation.status.pauseGap += pausedDuration;
          singleplayerGameInformation.status.pauseStart = 0;
          console.log("Updating pausing information");
          console.log("Conditional reached!");
          timerInterval = setInterval(() => {
            const elapsedTime = Math.floor(
              (Date.now() -
                singleplayerGameProperties.startTime -
                singleplayerGameInformation.status.pauseGap) /
                1000
            );

            console.log("Added timer again");
            chrome.storage.local.set({ [utils.ELAPSED_TIME]: elapsedTime });
            console.log("Updated elapsed Time ");
          }, 1000);
          console.log("Reached end");
          // if (true) {
          // isTimerRunning = true;
          // }

          console.log(singleplayerGameInformation);
          chrome.storage.local.set({
            [utils.SINGLEPLAYER_GAME_INFORMATION]: singleplayerGameInformation,
          });
        }
      }
    }
  );
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
        singleplayerCustomizations.mode.type === "path" &&
        !singleplayerCustomizations.mode.path.directed
      ) {
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
        // isTimerRunning = true;
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
  // if (singleplayerGameInformation.status.playing) {
  //TODO: see if this is still needed (async getting)
  chrome.storage.local.get(
    [
      utils.SINGLEPLAYER_GAME_INFORMATION,
      utils.SINGLEPLAYER_GAME_PROPERTIES,
      utils.CLICK_COUNT,
      utils.SINGLEPLAYER_CUSTOMIZATIONS,
    ],
    (result) => {
      if (
        result[utils.SINGLEPLAYER_GAME_INFORMATION] &&
        result[utils.SINGLEPLAYER_GAME_PROPERTIES] &&
        result[utils.SINGLEPLAYER_CUSTOMIZATIONS]
      ) {
        singleplayerGameInformation =
          result[utils.SINGLEPLAYER_GAME_INFORMATION];
        singleplayerGameProperties = result[utils.SINGLEPLAYER_GAME_PROPERTIES];
        singleplayerCustomizations = result[utils.SINGLEPLAYER_CUSTOMIZATIONS];

        if (singleplayerGameInformation.status.playing) {
          let clicks = result[utils.CLICK_COUNT] || 0;
          clicks++;
          chrome.storage.local.set({ [utils.CLICK_COUNT]: clicks });

          const pageUrl = message.page;
          const currentNode = singleplayerGameInformation.currentNode;
          const nextPage = singleplayerGameProperties.path[currentNode + 1]; // NEED TO ADDRESS UNDIRECTED!!!

          const searchTitle = pageUrl.split("/").pop();
          fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.title) {
                const pageTitle = data.title;
                let currentEdgeHistory =
                  singleplayerGameInformation.edgeHistory[currentNode] || 0;
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

                console.log(
                  singleplayerGameInformation.currentNode,
                  pageUrl,
                  singleplayerCustomizations.end.link
                );

                if (
                  singleplayerGameInformation.currentNode ===
                    singleplayerGameProperties.path.length - 1 &&
                  pageUrl === singleplayerCustomizations.end.link
                ) {
                  clearInterval(timerInterval);
                  // isTimerRunning = false;
                  singleplayerGameInformation.status.playing = false;
                  chrome.storage.local.set({
                    [utils.SINGLEPLAYER_GAME_INFORMATION]:
                      singleplayerGameInformation,
                  });
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
                console.log("not matching");
                chrome.storage.local.set({ [utils.EXTERNAL_WIKI_VISIT]: true });
                clearInterval(timerInterval);
              }
            }
          }
        }
      }
    );
  }
});
