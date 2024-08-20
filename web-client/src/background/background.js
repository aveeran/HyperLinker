function checkForWikipedia(tabId, changeInfo, tab) {

    if (changeInfo.status === 'complete' && tab.url.includes('wikipedia.org')) {
        console.log("Hello, world!");
    }
}

chrome.tabs.onUpdated.addListener(checkForWikipedia);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "start_singleplayer") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "start_singleplayer", data: message.data});
        });
    }
});
