const NO_OPENING_PARA = "no-opening-para";
const NO_FIND = "no-find";
const NO_BACK = "no-back";
const NO_CATEGORY = "no-category";
const NO_DATES = "no-dates";
const SAME_PAGE_LINK = "same-page-link";
const currentPagePath = window.location.pathname;
let countSamePageLink = false;
let useBack = true;

chrome.storage.local.get(
  ["tab-id", "singleplayer-game-information", "singleplayer-customizations"],
  (result) => {
    const storedGameInformation = result["singleplayer-game-information"] || {
      status: { playing: false },
    };
    const playing = storedGameInformation.status.playing;

    if (playing) {
      const storedID = result["tab-id"];
      chrome.runtime.sendMessage({ action: "get_tab_id" }, (response) => {
        if (response && response.tabId) {
          console.log("page ", response.tabId, " stored: ", storedID);
          if (storedID !== undefined && storedID !== null) {
            if (response.tabId === storedID) {
              const storedCustomizations =
                result["singleplayer-customizations"];
              const restrictions = storedCustomizations.restrictions;
              if (restrictions.includes(SAME_PAGE_LINK)) {
                countSamePageLink = true;
              }
              if (restrictions.includes(NO_BACK)) {
                useBack = false;
              }
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
      });
    } else {
      // console.log("Not playing!");
    }
  }
);

function enforceRestrictions(restrictions) {
  for (let restriction of restrictions) {
    switch (restriction) {
      case NO_OPENING_PARA:
        noOpeningParagraph();
        break;
      case NO_FIND:
        noFind();
        break;
      default:
        break;
    }
  }
}

function noOpeningParagraph() {
  const contentDiv = document.getElementById("mw-content-text");
  if (contentDiv) {
    const firstParagraph = contentDiv.querySelector("p:not([class]):not([id])");
    if (firstParagraph) {
      firstParagraph.innerHTML =
        "Removed by the extension, since the restriction 'no-opening-para' is enabled";
    }
  }
}

function noFind() {
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "f") {
      event.preventDefault();
      alert("cannot press back");
    }
  });
}

document.addEventListener("click", (event) => {
  if (
    event.target.tagName === "A" &&
    event.target.href.includes("wikipedia.org")
  ) {
    const targetPagePath = new URL(event.target.href).pathname;
    if (
      countSamePageLink ||
      (!countSamePageLink && currentPagePath !== targetPagePath)
    ) {
      chrome.runtime.sendMessage({
        action: "wikipedia_click",
        page: event.target.href,
      });
    }

    if (!useBack) {
      history.pushState(null, null, event.target.href);
      history.back();
      history.forward();
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});

// TODO: now check to enforce restrictions
