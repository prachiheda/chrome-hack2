import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './Sidebar';

const container = document.createElement('div');
document.body.appendChild(container);

try {
  const root = ReactDOM.createRoot(container);
  root.render(<Sidebar />);
  console.log('Sidebar successfully injected.');
} catch (error) {
  console.error('Failed to inject sidebar:', error);
} 
console.log("hello there")
