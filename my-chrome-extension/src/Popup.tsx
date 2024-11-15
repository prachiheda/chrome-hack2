/*global chrome*/
import React, { useEffect, useState } from 'react';

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCompanyPage, setIsCompanyPage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stored data when popup opens
    chrome.storage.local.get(['currentTabUrl', 'isCompanyPage', 'companyName'], (data) => {
      setCurrentUrl(data.currentTabUrl || 'No URL available');
      setIsCompanyPage(data.isCompanyPage ?? 'Checking...');
      setCompanyName(data.companyName ?? 'Checking...');
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

export default Popup;
