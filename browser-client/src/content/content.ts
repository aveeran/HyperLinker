let playing: boolean = false;
let paused = false;

const NO_OPENING_PARA = "no-opening-para";
const NO_FIND = "no-find";
const NO_BACK = "no-back";
const NO_DATES = "no-dates";
const SAME_PAGE_LINK = "same-page-link";
const NO_POPUPS = "no-popups";
const currentPagePath = window.location.pathname;

let useBack = true;
let noDates = false;
let countSamePageLink = false;


chrome.storage.local.get(["game", "tab-id"], (result) => {
    const storedGame = result["game"] || { gameStatus : { playing: false, paused : false}}
    playing = storedGame.gameStatus.playing;
    paused = storedGame.gameStatus.paused;
    if(playing) { // If the game is being played

        // Retrieve tab ID of original tab
        const storedID = result["tab-id"];


        // Get tab ID of current tab
        chrome.runtime.sendMessage({type: "get_tab_id"}, (response) => {
            
            // If current tab is still original tab, enforce restrictions
            if(response && response.tabId && storedID) {
                if(response.tabId === storedID) {
                    const storedRestrictions : string[] = storedGame.customizations.restrictions;

                    countSamePageLink = storedRestrictions.includes(SAME_PAGE_LINK);
                    useBack = !storedRestrictions.includes(NO_BACK);
                    noDates = !storedRestrictions.includes(NO_DATES);
                    enforceRestrictions(storedRestrictions);
                    

                } else {
                    alert("Cannot visit other pages...?")
                    // TODO; see which restrictions fit
                }
            } else {
                // TODO: idk if we should have this
            }
        });

    }
});

function enforceRestrictions(restrictions: string[]) : void {
    for(let restriction of restrictions) {
        switch(restriction) {
            case NO_OPENING_PARA:
                noOpeningParagraph();
                break;
            case NO_FIND:
                noFind();
                break;
            case NO_POPUPS:
                noPopups();
                break
            default: break;

        }
    }
}

function noOpeningParagraph() {
    const contentDiv = document.getElementById("mw-content-text");
    if (contentDiv) {
      const firstParagraph = contentDiv.querySelector("p:not([class]):not([id])");
      if (firstParagraph) {
        firstParagraph.innerHTML =
          "<b>Removed by the extension, since the restriction 'no-opening-para' is enabled</b><hr>";
      }
    }
}

function noFind() {
    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "f") {
          event.preventDefault();
          alert("Restriction: Cannot use browser 'find' functionality");
        }
      });
}

function noPopups() {
    let links = document.querySelectorAll("a");

    links.forEach(function (link) {
      link.addEventListener(
        "mouseover",
        function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
        },
        true
      );
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === "update_pause") {
        paused = message.pause;
    }
});


document.addEventListener("click", (event: MouseEvent) => {
    
    const target = event.target as HTMLElement;
    if(playing && target.tagName === "A") {
        const anchor = target as HTMLAnchorElement;
        if(paused) {
            event.preventDefault();
            alert("Cannot visit other pages while paused"); // TODO: maybe we should try to detect scroll LMAOOO
        } else {
            if(!anchor.href.includes("wikipedia.org")) {
                event.preventDefault();
                alert("Cannot visit non-wikipedia sites through links!");
            } else {
                const targetPagePath = new URL(anchor.href).pathname;
                const articlePage = targetPagePath.replace("/wiki/", "");

                if(noDates && checkDate(articlePage)) { 
                    event.preventDefault();
                    alert("Cannot visit pages related to dates!");
                    return;
                }

                if(countSamePageLink || (!countSamePageLink && currentPagePath !== targetPagePath)) { 
                    chrome.runtime.sendMessage({
                        type: "wikipedia_click",
                        page: anchor.href
                    });
                } 

                if(!useBack && currentPagePath !== targetPagePath) { // TODO: replace with back
                    history.pushState(null, "", anchor.href);
                    history.back();
                    history.forward();
                }
            }
        }

    }
});

function checkDate(url: string) {
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
      /\/\d{4}\/\d{2}/, // YYYY/MM
      /\/\d{2}\/\d{4}/, // MM/YYYY
      /(January|February|March|April|May|June|July|August|September|October|November|December)_(\d{4})/, // Month_Year
      /\/\d{4}\//, // YYYY/ (year-only format in URL path)
      /\/\d{4}$/, // YYYY (year-only format at the end of URL)
      /AD_\d{4}/, // AD_YYYY format
    ];
  
    return datePatterns.some((pattern) => pattern.test(url));
  }