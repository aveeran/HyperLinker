// hooks/useCustomizationListener.ts
import { useEffect } from "react";
import {
  InformationUpdated,
  CustomizationInterface,
} from "../utils/utils";

export function useCustomizationListener(
  onCustomizationUpdate: (customizations: CustomizationInterface) => void,
  shouldListen = false
) {
  useEffect(() => {
    if (!shouldListen) return;

    const handleMessage = (
      message: { type: string; customizations: CustomizationInterface }
    ) => {
      if (message.type === InformationUpdated.Customization && message.customizations) {
        onCustomizationUpdate(message.customizations);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [shouldListen, onCustomizationUpdate]);
}
