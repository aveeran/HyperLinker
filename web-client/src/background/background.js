function checkForWikipedia(tabId, changeInfo, tab) {


}

chrome.tabs.onUpdated.addListener(checkForWikipedia);


let counter = 0
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "start_singleplayer") {
        const url = message.data.start.link;
        chrome.tabs.create({url: url}, (newTab) => {
            chrome.tabs.sendMessage(newTab.id, { action: "start_singleplayer", data: message.data});
        })
    }
    if(message.action === "wikipedia_click") {
        counter++;
        chrome.runtime.sendMessage({action: 'wikipedia_click', data: counter})
    }
});


