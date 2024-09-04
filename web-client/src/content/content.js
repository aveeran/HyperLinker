const NO_OPENING_PARA = "no-opening-para";
const NO_FIND = "no-find";
const NO_BACK = "no-back";
const NO_DATES = "no-dates";
const SAME_PAGE_LINK = "same-page-link";
const currentPagePath = window.location.pathname;
const NO_POPUPS = "no-popups";
let playing = false;
let paused = false;
let countSamePageLink = false;
let useBack = true;
let noDates = false;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  // Handle the message here
});



chrome.storage.local.get(
  ["tab-id", "singleplayer-game-information", "singleplayer-customizations"],
  (result) => {
    const storedGameInformation = result["singleplayer-game-information"] || {
      status: { playing: false },
    };
    playing = storedGameInformation.status.playing;
    paused = storedGameInformation.status.paused;

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

              if (restrictions.includes(NO_DATES)) {
                // TODO: alternative approach is to check every link and disable dates
                noDates = true;
              }

              enforceRestrictions(restrictions);
            }
          }
        }
      });
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
      case NO_POPUPS:
        noPopups();
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

document.addEventListener("click", (event) => {
  alert(`${playing} ${paused}`);
  if (playing && event.target.tagName === "A" && event.target.href.includes("wikipedia.org")) {
    const targetPagePath = new URL(event.target.href).pathname;
    const articlePage = targetPagePath.replace("/wiki/", "");
    if (noDates && checkDate(articlePage)) {
      event.preventDefault();
      alert("Cannot visit pages related to dates");
      return;
    }

    if (countSamePageLink || (!countSamePageLink && currentPagePath !== targetPagePath)) {
      chrome.runtime.sendMessage({
        action: "wikipedia_click",
        page: event.target.href,
      });
    }

    if (!useBack && currentPagePath !== targetPagePath) {
      history.pushState(null, null, event.target.href);
      history.back();
      history.forward();
    }
  } else if (playing && paused) {
    alert('bruh');
    event.preventDefault();
  }
});


function checkDate(url) {
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
