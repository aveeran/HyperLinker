// console.log("content script loaded");
// document.body.style.backgroundColor ="lightblue";

// content/content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "contentMessage") {
      console.log("Message from background (via popup):", message.data);
    }
  });
  
  