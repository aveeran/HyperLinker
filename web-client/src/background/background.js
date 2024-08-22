let singleplayerGame = {
  singleplayerCustomizations: {},
  playing: false,
  startTime: 0,
  tracking: 0,
  path: [],
  nodeHistory: [],
  edgeHistory: [],
};

let visitedPage = null;

let timerInterval;

chrome.storage.local.clear();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_singleplayer") {
    const { start, end } = message.data;
    chrome.tabs.create({ url: start.link }, (newTab) => {
      singleplayerGame.singleplayerCustomizations = message.data;
      singleplayerGame.playing = true;
      singleplayerGame.startTime = Date.now();

      singleplayerGame.path = [
        singleplayerGame.singleplayerCustomizations.start.link,
        ...(singleplayerGame.singleplayerCustomizations.mode?.path?.intermediate_links.map(
          (article) => article.link
        ) || []),
        singleplayerGame.singleplayerCustomizations.end.link,
      ];

      singleplayerGame.nodeHistory = Array.from(
        { length: singleplayerGame.path.length },
        () => []
      );
      chrome.storage.local.set({ "singleplayer-game": singleplayerGame });

      if (singleplayerGame.singleplayerCustomizations.track === "time") {
        timerInterval = setInterval(() => {
          if (singleplayerGame.playing) {
            const elapsedTime = Math.floor(
              (Date.now() - singleplayerGame.startTime) / 1000
            );
            // chrome.storage.local.get("singleplayer-game", (result) => {
            //   result["singleplayer-game"].track = elapsedTime;
            //   chrome.storage.local.set("singleplayer-game", result["singleplayer-game"])
            // })
            chrome.storage.local.set({ elapsedTime: elapsedTime });
          }
        }, 1000);
      }

      // TEST SCRIPT TO SEND MESSAGE
      chrome.tabs.sendMessage(newTab.id, {
        action: "start_singleplayer",
        data: message.data,
      });
    });
  }

  if (message.action === "wikipedia_click") { // HOW SHOULD WE ADDRESS WIKIPEDIA CLICK?
    if (singleplayerGame.playing) { // THE CONCERN IS HERE***
      chrome.storage.local.get(["clickCount", "pageVisited"], (result) => {
        let clicks = result.clickCount || 0;
        clicks++;
        // gameData.clickCount = clicks;

        //   let pagesVisited = result.pageVisited || '';
        //   pagesVisited.push(message.page);
        //   gameData.pagesVisited = pagesVisited;

        chrome.storage.local.set({
          clickCount: clicks,
          pageVisited: message.page,
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
