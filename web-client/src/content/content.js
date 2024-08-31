

chrome.storage.local.get(["tab-id", "singleplayer-game-information", "singleplayer-customizations"], (result) => {
    const storedGameInformation = result["singleplayer-game-information"] || { status: {playing: false}};
    const playing = storedGameInformation.status.playing;

    if(playing) {
        const storedID = result["tab-id"];    
        chrome.runtime.sendMessage({ action: "get_tab_id"}, (response) => {
            if(response && response.tabId) {
                console.log(response.tabId, storedID);
                if(storedID !== undefined && storedID !== null) {
                    if(response.tabId === storedID) {
                        const storedCustomizations = result["singleplayer-customizations"];
                        const restrictions = storedCustomizations.restrictions;
                        enforceRestrictions(restrictions);
                        // console.log("Playing tab ID");
                    } else {
                        // console.log("Non-playing tab ID")
                    }
                } else {
                    // console.log("stored ID null/undefined");
                }
            } else {
                // console.log("TAB ID NOT STORED??");
            }
        })
    } else {
        // console.log("Not playing!");
    }

});

function enforceRestrictions(restrictions) {
    
}



document.addEventListener('click', (event) => {

    if(event.target.tagName === 'A' && event.target.href.includes('wikipedia.org')) {
        chrome.runtime.sendMessage({ action: "wikipedia_click", page: event.target.href})
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
})


// TODO: now check to enforce restrictions