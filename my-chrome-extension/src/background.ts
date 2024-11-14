/// <reference types="chrome"/>
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

async function fetchMissionContent(companyName: string): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `${companyName} mission and values` }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch mission content: ${response.statusText}`);
    }

    const results = await response.json();
    return results[0]?.link || 'No relevant results found';
  } catch (error) {
    console.error('Error fetching mission content from backend:', error);
    return null;
  }
}

// Function to check if the URL is a company page and to extract the company name
async function analyzeUrl(url: string) {
  try {
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Step 1: Check if it's a company page
    const checkPrompt = `The URL provided is: ${url}. If you were to search Google, does this page appear to be a company or business website or job board? Respond with "Yes" if it likely is, or "No" if it likely isn’t.`;
    const checkResult = await model.generateContent(checkPrompt);

    const responseParts = checkResult.response?.candidates?.[0]?.content?.parts;
    const responseText = responseParts && responseParts.length > 0 ? responseParts[0].text : null;

    const isCompanyPage = responseText && responseText.trim().toLowerCase() === 'yes';

    let companyName = null;
    let missionLink = null;

    if (isCompanyPage) {
      // Step 2: Extract the company name if it is a company page
      const extractPrompt = `Extract the company name from this URL: ${url}. Respond back with only the company name if there is one. Else, return nothing.`;
      const extractResult = await model.generateContent(extractPrompt);

      const extractResponseParts = extractResult.response?.candidates?.[0]?.content?.parts;
      companyName = extractResponseParts && extractResponseParts.length > 0 ? extractResponseParts[0].text : null;
      // Step 3: Fetch mission content
      if (companyName) {
        missionLink = await fetchMissionContent(`${companyName} mission vision value`);
      }
    }

    // Save results to local storage
    chrome.storage.local.set({
      currentTabUrl: url,
      isCompanyPage: isCompanyPage ? "Yes" : "No",
      companyName: companyName || 'Company name not found',
       missionLink: missionLink || 'Mission link not found',
    });

  } catch (error) {
    console.error("Error analyzing URL with Gemini:", error);
  }
}

// Function to save and analyze the current tab URL
async function saveCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      await analyzeUrl(tab.url);
      console.log("Analyzed and saved data for URL:", tab.url);
    }
  } catch (error) {
    console.error("Error saving the current tab URL:", error);
  }
}

// Listen for tab activation or URL changes
chrome.tabs.onActivated.addListener(saveCurrentTabUrl);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    saveCurrentTabUrl();
  }
});


// Initialize side panel
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");

  chrome.sidePanel.setOptions({
    path: 'public/sidepanel.html',  // Make sure path matches the dist location
    enabled: true,
  });
  chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
})


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'fetchMissionContent') {
    const { companyName } = message;

    try {
      // Check if the mission content is already stored in local storage
      chrome.storage.local.get(['missionLink', 'companyName'], async (data) => {
        if (data.companyName === companyName && data.missionLink) {
          // Return cached mission link
          sendResponse({ link: data.missionLink });
        } else {
          // Fetch mission content if not cached
          const missionLink = await fetchMissionContent(companyName);

          // Save the result to local storage
          chrome.storage.local.set({ missionLink });

          // Send response back to the popup
          sendResponse({ link: missionLink });
        }
      });
    } catch (error) {
      console.error('Error fetching mission content:', error);
      sendResponse({ error: 'Failed to fetch mission content.' });
    }
  }
  return true; // Keeps the message channel open for async response
});

