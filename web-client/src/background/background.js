import { defaultSingleplayerCustomizations, defaultGameProperties, defaultGameInformation } from "@utils/utils.js";

let singleplayerCustomizations = defaultSingleplayerCustomizations;
let singleplayerGameProperties = defaultGameProperties;
let singleplayerGameInformation = defaultGameInformation;

chrome.storage.onChanged.addListener((changes, areaName) => {
    if(areaName=="local") {
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
