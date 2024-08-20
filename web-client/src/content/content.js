
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_singleplayer") {
      console.log("Message from background (via popup):", message.data);
    }
  });
  
  