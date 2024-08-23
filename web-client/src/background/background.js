let singleplayerGame = {
  singleplayerCustomizations: {},
  playing: false,
  startTime: 0,
  tracking: 0,
  path: [],
  visitedPath: [],
  nodeHistory: [],
  edgeHistory: [],
  currentNode: 0
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
        singleplayerGame.singleplayerCustomizations.start,
        ...((singleplayerGame.singleplayerCustomizations.mode?.path?.intermediate_links
        ) || []),
        singleplayerGame.singleplayerCustomizations.end,
      ];

      singleplayerGame.nodeHistory = Array.from(
        { length: singleplayerGame.path.length },
        () => ({clicks: 0, elapsedTime: 0})
      );

      singleplayerGame.edgeHistory = Array.from(
        { length: singleplayerGame.path.length - 2 },
        () => []
      );

      singleplayerGame.visitedPath = [singleplayerGame.singleplayerCustomizations.start.link];

      chrome.storage.local.set({ "singleplayer-game": singleplayerGame });

      // if (singleplayerGame.singleplayerCustomizations.track === "time") {
      //   timerInterval = setInterval(() => {
      //     if (singleplayerGame.playing) {
      //       const elapsedTime = Math.floor(
      //         (Date.now() - singleplayerGame.startTime) / 1000
      //       );
      //       chrome.storage.local.set({ elapsedTime: elapsedTime });
      //     }
      //   }, 1000);
      // }

      if(singleplayerGame.playing) {
        timerInterval = setInterval(() => {
          const elapsedTime = Math.floor(
            (Date.now() - singleplayerGame.startTime) / 1000
          );
          chrome.storage.local.set({elapsedTime : elapsedTime});
        }, 1000);
      }

      // TEST SCRIPT TO SEND MESSAGE
      chrome.tabs.sendMessage(newTab.id, {
        action: "start_singleplayer",
        data: message.data,
      });
    });
  }

  if (message.action === "wikipedia_click") {
    console.log(message);
    if (singleplayerGame.playing) { 
      chrome.storage.local.get(["clickCount", "pageVisited"], (result) => {
        let clicks = result.clickCount || 0;
        clicks++;
        chrome.storage.local.set({
          clickCount: clicks,
          pageVisited: message.page

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
