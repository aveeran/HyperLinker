

document.addEventListener('click', (event) => {
    if(event.target.tagName === 'A' && event.target.href.includes('wikipedia.org')) {
        chrome.runtime.sendMessage({ action: "wikipedia_click", page: event.target.href})
    }
})

//TODO: double-check that the click came from start/edge history

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
}