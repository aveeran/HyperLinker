import { CustomizationInterface, Mode } from "../utils/utils";

export interface CustomizationValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

export function validateCustomizations(customizations: CustomizationInterface): CustomizationValidationResult {
    if (!customizations.start.link) {
        return {
            isValid: false,
            errorMessage: "Invalid path. The start article has not been set properly"
        }
    } else if (!customizations.end.link) {
        return {
            isValid: false,
            errorMessage: "Invalid path. The end article has not been set properly."
        }
    }
    
    const mode = customizations.mode.type;
    if(mode == Mode.Path) {
                // ensuring that the articles themselves are valid
                const pathLength = customizations.mode.path?.pathLength;

                // validating connecting articles
                const connectionPath = customizations.mode.path?.connections;
                const connectionPathLength = (connectionPath?.length ?? 0) + 2;
                // what even is this one
                if (pathLength != connectionPathLength) {
                  return {
                    isValid: false,
                    errorMessage: "Invalid path.?"
                  }
                }
        
                for (let i = 0; i < (connectionPath?.length ?? 0); i++) {
                  if (connectionPath?.[i]?.link === "") {
                    return {
                        isValid: false,
                        errorMessage: `Invalid path. Article ${i+1} has not been set properly.`
                    }
                  }
                }
             
                // validating no duplicates
                const path = [customizations.start, ...(connectionPath || []), customizations.end];
                const objectStrings = path.map(item => JSON.stringify(item));
                const hasDuplicates = new Set(objectStrings).size !== objectStrings.length;
                if (hasDuplicates) {
                  return {
                    isValid: false,
                    errorMessage: "Invalid path. There are duplicate articles."
                  }
                }
    }

    return {
        isValid: true
    }

}