import React, { useEffect, useState } from 'react';

const Sidebar: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCompanyPage, setIsCompanyPage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stored data from chrome.storage.local
    chrome.storage.local.get(['currentTabUrl', 'isCompanyPage', 'companyName'], (data) => {
      setCurrentUrl(data.currentTabUrl || 'No URL available');
      setIsCompanyPage(data.isCompanyPage ?? 'Checking...');
      setCompanyName(data.companyName ?? 'Checking...');
    });
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100vh',
        backgroundColor: '#ffffff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        padding: '20px',
        zIndex: 10000,
      }}
    >
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

export default Sidebar;
