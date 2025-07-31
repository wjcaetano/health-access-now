
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

// Forçar tema light
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.documentElement.style.colorScheme = 'light';

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
