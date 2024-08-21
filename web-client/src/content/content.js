
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_singleplayer") {
      console.log("Message from background (via popup):", message.data);

      chrome.runtime.sendMessage({
        action: "customizations",
        data: message.data
      })
    }
  });

  document.addEventListener('click', (event) => {
    if(event.target.tagName === 'A' && event.target.href.includes('wikipedia.org')) {
      chrome.runtime.sendMessage({ action : 'wikipedia_click'})
    }
  })

  
