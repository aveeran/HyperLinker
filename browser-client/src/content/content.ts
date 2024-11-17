let playing: boolean = false;
let paused = false;

chrome.storage.local.get(["game"], (result) => {
    if(result["game"]) {
        playing = result["game"];
    }

    console.log("Playing: ", playing);
})


document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if(playing && target.tagName === "A") {
        const anchor = target as HTMLAnchorElement;
        if(paused) {

        } else {
            if(!anchor.href.includes("wikipedia.org")) {
                event.preventDefault();
                alert("Cannot visit non-wikipedia sites through links!");
            } else {
                const targetPagePath = new URL(anchor.href).pathname;
                const articlePage = targetPagePath.replace("/wiki/", "");
                if(false) { // TODO: replace with dates
                    event.preventDefault();
                    alert("Cannot visit pages related to dates!");
                    return;
                }

                if(true) { // TODO: replace with count same page link
                    chrome.runtime.sendMessage({
                        type: "wikipedia_click",
                        page: anchor.href
                    });
                }

                if(false) { // TODO: replace with back
                    history.pushState(null, "", anchor.href);
                    history.back();
                    history.forward();
                }
            }
        }

    }
});