import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LAST_ACTIVE_ROUTE } from '../../utils/utils';

function RouterTracker() {
    const location = useLocation();
    const navigate = useNavigate();
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    const isChromeExtension = useMemo<boolean>(() => {
        return !!(
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        );
      }, []);

      useEffect(() => {
        if(isChromeExtension && initialLoad) {
            chrome.storage.local.get([LAST_ACTIVE_ROUTE], (result) => {
                const route = result[LAST_ACTIVE_ROUTE];
                if(route && route !== location.pathname) {
                    navigate(route);
                }
                setInitialLoad(false);
            });
        }
      }, [initialLoad, location.pathname, navigate]);

      useEffect(() => {
        if(isChromeExtension && !initialLoad) {
            chrome.storage.local.set({[LAST_ACTIVE_ROUTE] : location.pathname});
        }
      }, [location, initialLoad]);

      return null;
}

export default RouterTracker;