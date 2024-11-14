import React, { useEffect, useState } from 'react';

const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isCompanyPage, setIsCompanyPage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [missionLink, setMissionLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data from storage
    chrome.storage.local.get(
      ['currentTabUrl', 'isCompanyPage', 'companyName', 'missionLink'],
      (data) => {
        setCurrentUrl(data.currentTabUrl || 'No URL available');
        setIsCompanyPage(data.isCompanyPage ?? 'Checking...');
        setCompanyName(data.companyName ?? 'Checking...');
        setMissionLink(data.missionLink ?? null);
        setLoading(false);
      }
    );

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
        if (changes.missionLink) {
          setMissionLink(changes.missionLink.newValue ?? null);
        }
      }
    });
  }, []);

  const refreshData = () => {
    setLoading(true);
    chrome.storage.local.get(
      ['currentTabUrl', 'isCompanyPage', 'companyName', 'missionLink'],
      (data) => {
        setCurrentUrl(data.currentTabUrl || 'No URL available');
        setIsCompanyPage(data.isCompanyPage ?? 'Checking...');
        setCompanyName(data.companyName ?? 'Checking...');
        setMissionLink(data.missionLink ?? null);
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Current Tab Info</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p><strong>URL:</strong> {currentUrl}</p>
          <p><strong>Is this a company page?</strong> {isCompanyPage}</p>

          {isCompanyPage === 'Yes' && companyName && (
            <>
              <h2>Extracted Information</h2>
              <p><strong>Company Name:</strong> {companyName}</p>
              {missionLink ? (
                <>
                  <p><strong>Mission Link:</strong></p>
                  <a href={missionLink} target="_blank" rel="noopener noreferrer">
                    {missionLink}
                  </a>
                </>
              ) : (
                <p>No mission link found.</p>
              )}
            </>
          )}

          {isCompanyPage === 'No' && <p>This is not a company page.</p>}
        </>
      )}
      <button
        onClick={refreshData}
        style={{
          marginTop: '16px',
          padding: '8px 12px',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Refresh Data
      </button>
    </div>
  );
};

export default SidePanel;
