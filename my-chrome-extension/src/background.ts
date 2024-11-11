// src/background.ts

// Ensure TypeScript knows about the Chrome APIs
/// <reference types="chrome"/>

async function saveCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab && tab.url) {
      chrome.storage.local.set({ currentTabUrl: tab.url });
      console.log('Current tab URL saved:', tab.url);
    }
  } catch (error) {
    console.error('Error saving the current tab URL:', error);
  }
}

// Listen for tab activation or URL change events
chrome.tabs.onActivated.addListener(saveCurrentTabUrl);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    saveCurrentTabUrl();
  }
});
