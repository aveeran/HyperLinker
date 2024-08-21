let gameData = {
    playing: false,
    startTime: 0,
    elapsedTime: 0,
    pagesVisited: [],
    nodeHistory: [],
    edgeHistory: [],
    currentNode: 0,
    clickCount: 0
  };
  
  let timerInterval;

  chrome.storage.local.clear();



  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_singleplayer") {
      const { start, end } = message.data;
      chrome.tabs.create({ url: start.link }, (newTab) => {
        gameData.playing = true;
        gameData.startTime = Date.now();
        gameData.endPage = end.link;
        gameData.clickCount = 0;
        gameData.pagesVisited = [start.link]; // Initial page
        chrome.storage.local.set({ "gameData": gameData});
  
        // Start tracking time
        timerInterval = setInterval(() => {
          if (gameData.playing) {
            gameData.elapsedTime = Math.floor((Date.now() - gameData.startTime) / 1000);
            chrome.storage.local.set({ elapsedTime: gameData.elapsedTime });
            console.log(gameData.elapsedTime);
          }
        }, 1000);
  
        chrome.tabs.sendMessage(newTab.id, { action: "start_singleplayer", data: message.data });
      });
    }
  
    if (message.action === "wikipedia_click") {
      if (gameData.playing) {
        chrome.storage.local.get(['clickCount', 'pageVisited'], (result) => {
          let clicks = result.clickCount || 0;
          clicks++;
          gameData.clickCount = clicks;
  
        //   let pagesVisited = result.pageVisited || '';
        //   pagesVisited.push(message.page);
        //   gameData.pagesVisited = pagesVisited;
  
          chrome.storage.local.set({ clickCount: clicks, pageVisited: message.page });
        });
      }
    }
  
    if (message.action === "quit_singleplayer") {
      gameData.playing = false;
      clearInterval(timerInterval); // Stop the timer
      chrome.storage.local.set({
        clickCount: gameData.clickCount,
        pagesVisited: gameData.pagesVisited,
        elapsedTime: gameData.elapsedTime,
        playing: false
      });
    }
  });
  