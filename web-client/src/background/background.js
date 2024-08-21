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
        // SHOULD WE MAINTAIN PERSISTENT DATA IN THE BROWSER STORAGE
        /*
        e.g.: playing = True/False
        rules = ... (and their required enforcement)
        end page = ...
        list of pages visited VISITED!!! 
        time elapsed of pages visited? <- details about time spent on a node can be stored internally/not persistent in chrome

        */
        chrome.storage.local.get('clickCount', (result) => {
            let clicks = 0;
            if(result.clickCount !== undefined) {
                clicks = result.clickCount;
            }
            clicks++;
            chrome.storage.local.set({'clickCount' : clicks});
        })

        chrome.storage.local.get('pagesVisited', (result) => {

        })
    }

    if(message.action === "quit_singleplayer") {
        chrome.storage.local.set({'clickCount' : 0});
    }

});


