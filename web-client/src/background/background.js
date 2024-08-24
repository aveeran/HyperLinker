let singleplayerGame = {
  singleplayerCustomizations: {},
  playing: false,
  startTime: 0,
  tracking: 0,
  path: [],
  freePath: [],
  visitedPath: [],
  nodeHistory: [],
  edgeHistory: [],
  currentNode: 0,
};

let visitedPage = null;

let timerInterval;

chrome.storage.local.clear();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes["singleplayer-game"]) {
    singleplayerGame = changes["singleplayer-game"].newValue;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_singleplayer") {
    const { start, end } = message.data;
    chrome.tabs.create({ url: start.link }, (newTab) => {
      singleplayerGame.singleplayerCustomizations = message.data;
      singleplayerGame.playing = true;
      singleplayerGame.startTime = Date.now();

      singleplayerGame.path = [
        singleplayerGame.singleplayerCustomizations.start,
        ...(singleplayerGame.singleplayerCustomizations.mode?.path
          ?.intermediate_links || []),
        singleplayerGame.singleplayerCustomizations.end,
      ];

      if(!singleplayerGame.singleplayerCustomizations.mode.path.directed) {
        singleplayerGame.freePath = Array.from(
          {length: singleplayerGame.path.length },
          () => ({title: "???", link:"www.wikipedia.org"})
        );

        singleplayerGame.freePath[0] = singleplayerGame.singleplayerCustomizations.start;
        singleplayerGame.freePath[singleplayerGame.path.length - 1] = singleplayerGame.singleplayerCustomizations.end;
      }

      singleplayerGame.nodeHistory = Array.from(
        { length: singleplayerGame.path.length },
        () => ({ clicks: 0, elapsedTime: 0 })
      );

      singleplayerGame.edgeHistory = Array.from(
        { length: singleplayerGame.path.length - 2 },
        () => []
      );

      singleplayerGame.visitedPath = [
        singleplayerGame.singleplayerCustomizations.start.link,
      ];

      chrome.storage.local.set({ "singleplayer-game": singleplayerGame });
      if (singleplayerGame.playing) {
        timerInterval = setInterval(() => {
          const elapsedTime = Math.floor(
            (Date.now() - singleplayerGame.startTime) / 1000
          );
          chrome.storage.local.set({ elapsedTime: elapsedTime });
        }, 1000);
      }
    });
  }

  if (message.action === "wikipedia_click") {
    if (singleplayerGame.playing) {
      chrome.storage.local.get(["clickCount"], (result) => {
        let clicks = result.clickCount || 0;
        clicks++;
        chrome.storage.local.set({ clickCount: clicks });

        const pageUrl = message.page;
        const currentNode = singleplayerGame.currentNode;
        const nextPage = singleplayerGame.path[currentNode + 1]; // FOR DIRECTED/NORMAL; need to address undirected now
        
        const searchTitle = pageUrl.split("/").pop();
        fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTitle}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.title) {
              const pageTitle = data.title;
              let currentEdgeHistory =
                singleplayerGame.edgeHistory[currentNode] ||
                [];
              currentEdgeHistory.push({ url: pageUrl, title: pageTitle });
              singleplayerGame.edgeHistory[currentNode] =
                currentEdgeHistory;

              let currentNodeHistory = singleplayerGame.nodeHistory[
                currentNode
              ] || { clicks: 0, elapsedTime: 0 }; 
              currentNodeHistory.clicks++;
              singleplayerGame.nodeHistory[currentNode] =
                currentNodeHistory;
            }

            if(singleplayerGame.singleplayerCustomizations.mode.path.directed) {
              if (pageUrl === nextPage.link) {
                singleplayerGame.currentNode++;
                singleplayerGame.visitedPath.push(pageUrl);
              }
            } else {
              console.log("undirected", singleplayerGame.path, singleplayerGame.visitedPath, pageUrl);
              if(singleplayerGame.path.map(article=>article.link).includes(pageUrl) && !singleplayerGame.visitedPath.includes(pageUrl)) {
                console.log("Should be here!");
                singleplayerGame.currentNode++;
                singleplayerGame.freePath[singleplayerGame.currentNode] = {title: data.title, link: pageUrl};
                singleplayerGame.visitedPath.push(pageUrl);
              }
            }
            console.log(singleplayerGame);
            chrome.storage.local.set({ "singleplayer-game": singleplayerGame });
          })
          .catch((error) => {
            console.error("Error fetching page title: ", error);
          });
      });
    }
  }

  if (message.action === "quit_singleplayer") {
    singleplayerGame.playing = false;
    clearInterval(timerInterval); // Stop the timer
    // chrome.storage.local.set({
    //   clickCount: gameData.clickCount,
    //   pagesVisited: gameData.pagesVisited,
    //   elapsedTime: gameData.elapsedTime,
    //   playing: false,
    // });
  }
});
