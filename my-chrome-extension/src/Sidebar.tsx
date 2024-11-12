// src/sidepanel.tsx
import React, { useEffect, useState } from 'react';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCompanyPage, setIsCompanyPage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data from storage
    chrome.storage.local.get(['currentTabUrl', 'isCompanyPage', 'companyName'], (data) => {
      setCurrentUrl(data.currentTabUrl || 'No URL available');
      setIsCompanyPage(data.isCompanyPage ?? 'Checking...');
      setCompanyName(data.companyName ?? 'Checking...');
    });

    // Listen for changes in chrome.storage.local
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        if (changes.currentTabUrl) {
          setCurrentUrl(changes.currentTabUrl.newValue || 'No URL available');
        }
        if (changes.isCompanyPage) {
          setIsCompanyPage(changes.isCompanyPage.newValue ?? 'Checking...');
        }
        if (changes.companyName) {
          setCompanyName(changes.companyName.newValue ?? 'Company name not found');
        }
      }
    });
  }, []);

  return (
    <div>
      <h1>Current Tab URL</h1>
      <p>{currentUrl}</p>
      <h2>Is this a company page?</h2>
      <p>{isCompanyPage}</p>
      {isCompanyPage === 'Yes' && (
        <>
          <h3>Extracted Company Name</h3>
          <p>{companyName}</p>
        </>
      )}
    </div>
  );
};

export default SidePanel;
