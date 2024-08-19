function checkForWikipedia(tabId, changeInfo, tab) {
    if(changeInfo.status === 'complete' && tab.url.includes('wikipeida.org')) {
        console.log("Hello, world!")
    }
}

chrome.tabs.onUpdated.addListener(checkForWikipedia);