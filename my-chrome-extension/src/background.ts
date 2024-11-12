/// <reference types="chrome"/>
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
    if (isCompanyPage) {
      // Step 2: Extract the company name if it is a company page
      const extractPrompt = `Extract the company name from this URL: ${url}. Respond back with only the company name if there is one. Else, return nothing.`;
      const extractResult = await model.generateContent(extractPrompt);

      const extractResponseParts = extractResult.response?.candidates?.[0]?.content?.parts;
      companyName = extractResponseParts && extractResponseParts.length > 0 ? extractResponseParts[0].text : null;
    }

    // Save results to local storage
    chrome.storage.local.set({
      currentTabUrl: url,
      isCompanyPage: isCompanyPage ? "Yes" : "No",
      companyName: companyName || 'Company name not found',
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
