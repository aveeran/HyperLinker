import { CustomizationInterface, CUSTOMIZATIONS, defaultArticle, defaultCustomizations, MULTI_PLAYER, SINGLE_PLAYER, START_GAME, UPDATE_CUSTOMIZATION, UPDATE_GAME_MODE } from "../utils/utils";

let gameMode: string = SINGLE_PLAYER;
let gameCustomizations: CustomizationInterface = defaultCustomizations;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type) {
        case UPDATE_CUSTOMIZATION: 
            handleCustomizationsUpdate(message.customizations);
            break;
        case UPDATE_GAME_MODE:
            handleGameModeUpdate(message.game_mode);
            break;
        case START_GAME:
            break;
    }

    return false;
});


function handleCustomizationsUpdate(updatedCustomizations: CustomizationInterface) {
    gameCustomizations = updatedCustomizations;
    if(gameMode === MULTI_PLAYER) {
        // TODO: socket.io message
    }
}

function handleGameModeUpdate(updatedGameMode: string) {
    gameMode = updatedGameMode;

    if(gameMode === MULTI_PLAYER) {
        // TODO: disconnet from room
    } else if (gameMode === SINGLE_PLAYER) {

    }
}
