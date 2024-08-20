import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RouteTracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  // Determine if we are in a Chrome extension environment
  const isChromeExtension = useMemo(() => typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local, []);

  // Define storage mechanism using useMemo
  const storage = useMemo(() => {
    if (isChromeExtension) {
      return chrome.storage.local;
    } else {
      return {
        get: (key, callback) => {
          const value = localStorage.getItem(key);
          callback({ [key]: JSON.parse(value) });
        },
        set: (obj, callback) => {
          const key = Object.keys(obj)[0];
          const value = obj[key];
          localStorage.setItem(key, JSON.stringify(value));
          callback && callback();
        }
      };
    }
  }, [isChromeExtension]);

  useEffect(() => {
    if (initialLoad) {
      // On initial load, check for the last active route and navigate if it exists
      storage.get('lastActiveRoute', (result) => {
        if (result.lastActiveRoute && result.lastActiveRoute !== location.pathname) {
          navigate(result.lastActiveRoute);
          console.log("Navigating to saved route:", result.lastActiveRoute);
        }
        // Mark initial load as complete
        setInitialLoad(false);
      });
    }
  }, [initialLoad, location.pathname, navigate, storage]);

  useEffect(() => {
    if (!initialLoad) {
      // Only save the location after the initial load is complete
      storage.set({ lastActiveRoute: location.pathname });
      console.log("Saving current route:", location.pathname);
    }
  }, [location, initialLoad, storage]);

  return null; // or return some JSX if needed
}

export default RouteTracker;
