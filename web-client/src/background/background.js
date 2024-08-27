import { defaultSingleplayerCustomizations, defaultGameProperties, defaultGameInformation } from "@utils/utils.js";

let singleplayerCustomizations = defaultSingleplayerCustomizations;
let singleplayerGameProperties = defaultGameProperties;
let singleplayerGameInformation = defaultGameInformation;

const START_SINGLEPLAYER = "start_singleplayer"

let timerInterval;
let isTimerRunning;

chrome.storage.local.clear();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if(areaName=="local") {
        // may have to restrucutre in the future
        const customizationsChange = changes["singleplayer-customizations"];
        const gamePropertyChanges = changes["singleplayer-game-properties"];
        const gameInformationChanges = changes["singleplayer-game-information"];
        
        if(customizationsChange && customizationsChange.newValue != null) {
            singleplayerCustomizations = customizationsChange.newValue;
        }

        if(gamePropertyChanges && gamePropertyChanges.newValue != null) {
            singleplayerGameProperties = gamePropertyChanges.newValue;
        }

        if(gameInformationChanges && gameInformationChanges.newValue != null) {
            singleplayerGameInformation = gameInformationChanges.newValue;
        }
    }
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if(message.action === "start_singleplayer") { // SHOULD WE MAKE THESE CONSTANTS??
        startSingleplayer();
    }

    if(message.action === "pause_singleplayer") {

    }

    if(message.action === "unpause_singleplayer") {

    }

    if(message.action === "quit_singleplayer") {

    }

    if(message.action === "wikipedia_click") {

    }

    if(message.action === "singleplayer_win") {

    }
});

function startSingleplayer() {
    chrome.tabs.create({url: singleplayerCustomizations.start.link }, (newTab) => {
        singleplayerGameProperties.startTime = Date.now();
        singleplayerGameProperties.path = [
            singleplayerCustomizations.start,
            ...singleplayerCustomizations.mode.path.intermediate_links,
            singleplayerCustomizations.end
        ]

        const pathLength = singleplayerGameProperties.path.length;

        chrome.storage.local.set({"singleplayer-game-properties" : singleplayerGameProperties})

        singleplayerGameInformation.status = {
            playing: true,
            paused: false,
            pauseStart: 0,
            pauseGap: 0
        }

        if(!singleplayerCustomizations.mode.path.directed) {
            singleplayerGameInformation.freePath = Array.from(
                { length : pathLength },
                () => ({ title : "???", link: "www.wikipedia.org"})
            );

            singleplayerGameInformation.freePath[0] = singleplayerCustomizations.start;
            singleplayerGameInformation.freePath[pathLength] = singleplayerCustomizations.end;
        }

        singleplayerGameInformation.nodeHistory = Array.from(
            { length : pathLength},
            () => ({ clicks: 0, elapsedTime: 0})
        );

        singleplayerGameInformation.edgeHistory = Array.from(
            { length: pathLength - 1},
            () => []
        )

        singleplayerGameInformation.visitedPath = [singleplayerCustomizations.start.link]

        chrome.storage.local.set({"singleplayer-game-information" : singleplayerGameInformation})

        if(singleplayerGameInformation.status.playing) {
            timerInterval = setInterval(() => {
                const elapsedTime = Math.floor(
                    (Date.now() - singleplayerGameProperties.startTime) / 1000
                );
                chrome.storage.local.set( { elapsedTime : elapsedTime })
            }, 1000);
        }
    });

}
