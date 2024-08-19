import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RouteTracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      // On initial load, check for the last active route and navigate if it exists
      chrome.storage.local.get('lastActiveRoute', (result) => {
        if (result.lastActiveRoute && result.lastActiveRoute !== location.pathname) {
          navigate(result.lastActiveRoute);
          console.log("Navigating to saved route:", result.lastActiveRoute);
        }
        // Mark initial load as complete
        setInitialLoad(false);
      });
    }
  }, [initialLoad, location.pathname, navigate]);

  useEffect(() => {
    if (!initialLoad) {
      // Only save the location after the initial load is complete
      chrome.storage.local.set({ lastActiveRoute: location.pathname });
      console.log("Saving current route:", location.pathname);
    }
  }, [location, initialLoad]);

  return null; // or return some JSX if needed
}

export default RouteTracker;
