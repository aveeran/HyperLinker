function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    console.log("Connection status:", isOnline);
  
    // Send connection status to the background script (Service Worker)
    chrome.runtime.sendMessage({ type: "connectionStatus", online: isOnline });
  }
  
  // Initial connection status check
  updateConnectionStatus();
  
  // Listen for online/offline events
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);