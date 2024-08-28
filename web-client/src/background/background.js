import {
  defaultSingleplayerCustomizations,
  defaultGameProperties,
  defaultGameInformation,
} from "@utils/utils.js";

let singleplayerCustomizations = defaultSingleplayerCustomizations;
let singleplayerGameProperties = defaultGameProperties;
let singleplayerGameInformation = defaultGameInformation;

const START_SINGLEPLAYER = "start_singleplayer";

let timerInterval;
let isTimerRunning;

chrome.storage.local.clear();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName == "local") {
    // may have to restrucutre in the future
    const customizationsChange = changes["singleplayer-customizations"];
    const gamePropertyChanges = changes["singleplayer-game-properties"];
    const gameInformationChanges = changes["singleplayer-game-information"];
    const elapsedTimeChanges = changes["elapsedTime"];

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
    "singleplayer-game-information": updatedGameInformation,
  });
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.action === "start_singleplayer") {
    // SHOULD WE MAKE THESE CONSTANTS??
    startSingleplayer();
  }

  if (message.action === "pause_singleplayer") {
  }

  if (message.action === "unpause_singleplayer") {
  }

  if (message.action === "quit_singleplayer") {
  }

  if (message.action === "wikipedia_click") {
    handleWikipediaClick(message);
  }

  if (message.action === "singleplayer_win") {
  }
});

function startSingleplayer() {
  chrome.tabs.create(
    { url: singleplayerCustomizations.start.link },
    (newTab) => {
      singleplayerGameProperties.startTime = Date.now();
      singleplayerGameProperties.path = [
        singleplayerCustomizations.start,
        ...singleplayerCustomizations.mode.path.intermediate_links,
        singleplayerCustomizations.end,
      ];

      const pathLength = singleplayerGameProperties.path.length;

      chrome.storage.local.set({
        "singleplayer-game-properties": singleplayerGameProperties,
      });

      singleplayerGameInformation.status = {
        playing: true,
        paused: false,
        pauseStart: 0,
        pauseGap: 0,
      };

      if (!singleplayerCustomizations.mode.path.directed) {
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
        "singleplayer-game-information": singleplayerGameInformation,
      });

      if (singleplayerGameInformation.status.playing) {
        timerInterval = setInterval(() => {
            console.log("time");
          const elapsedTime = Math.floor(
            (Date.now() - singleplayerGameProperties.startTime) / 1000
          );
          chrome.storage.local.set({ elapsedTime: elapsedTime });
        }, 1000);
      }
    }
  );
}

function handleWikipediaClick(message) {
  if (singleplayerGameInformation.status.playing) {
    chrome.storage.local.get("clickCount", (result) => {
      let clicks = result["clickCount"] || 0;
      clicks++;
      chrome.storage.local.set({ clickCount: clicks });

      const pageUrl = message.page;
      const currentNode = singleplayerGameInformation.currentNode;
      const nextPage = singleplayerGameProperties.path[currentNode + 1]; // NEED TO ADDRESS UNDIRECTED!!!

      const searchTitle = pageUrl.split("/").pop();
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.title) {
            const pageTitle = data.title;
            let currentEdgeHistory =
              singleplayerGameInformation.edgeHistory[currentNode] || 0;
            currentEdgeHistory.push({ url: pageUrl, title: pageTitle });
            singleplayerGameInformation.edgeHistory[currentNode] =
              currentEdgeHistory;

            let currentNodeHistory = singleplayerGameInformation.nodeHistory[
              currentNode
            ] || { clicks: 0, elapsedTime: 0 };
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
                !singleplayerGameInformation.visitedPath.includes(pageUrl)
                && (pageUrl === singleplayerCustomizations.end.link ? (currentNode === singleplayerGameProperties.path.length - 2) 
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
              "singleplayer-game-information": singleplayerGameInformation,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching page title: ", error);
        });
    });
  }
}
