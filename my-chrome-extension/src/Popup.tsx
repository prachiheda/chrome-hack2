/*global chrome*/
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCompanyPage, setIsCompanyPage] = useState<string | null>(null);

  useEffect(() => {
    // Check if 'chrome' is available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Get the current tab URL from chrome storage
      chrome.storage.local.get('currentTabUrl', (data) => {
        if (data.currentTabUrl) {
          setCurrentUrl(data.currentTabUrl);
        }
      });
    } else {
      console.error('Chrome API is not available');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiKey) {
          throw new Error("VITE_GEMINI_API_KEY is missing");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prompt to emulate grounded response
        const prompt = `The URL provided is: ${currentUrl}. If you were to search Google, does this page appear to be a company or business website? Respond with "Yes" if it likely is, or "No" if it likely isn’t.`;

        const result = await model.generateContent(prompt);

        // Extract text if available in a nested structure
        const responseParts = result.response?.candidates?.[0]?.content?.parts;
        const responseText = responseParts && responseParts.length > 0 ? responseParts[0].text : null;

        if (responseText) {
          setIsCompanyPage(responseText.trim().toLowerCase() === 'yes' ? 'Yes' : 'No');
        } else {
          console.warn("No valid response text available.");
          setIsCompanyPage('Unable to determine');
        }
      } catch (error) {
        console.error("Error generating content:", error);
        setIsCompanyPage('Error occurred');
      }
    };

    if (currentUrl) {
      fetchData();
    }
  }, [currentUrl]);

  return (
    <div>
      <h1>Current Tab URL</h1>
      <p>{currentUrl || 'No URL available'}</p>
      <h2>Is this a company page?</h2>
      <p>{isCompanyPage ?? 'Checking...'}</p>
    </div>
  );
};

export default Popup;
