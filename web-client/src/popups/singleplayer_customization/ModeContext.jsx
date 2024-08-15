import React, { createContext } from 'react';

const ModeContext = createContext();

const ModeProvider = ({ children }) => {
    const storedCustomizations = sessionStorage.getItem(
        "singleplayer-customizations"
      );
    const customizations = JSON.parse(storedCustomizations);

    return (
        <ModeContext.Provider value={customizations}>
            {children}
        </ModeContext.Provider>
    )
}

export { ModeContext, ModeProvider }