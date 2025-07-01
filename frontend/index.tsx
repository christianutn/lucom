
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Import HashRouter
import App from './App.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { NotificationProvider } from './hooks/useNotification.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter> {/* Add HashRouter here */}
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationProvider>
    </HashRouter> {/* Close HashRouter here */}
  </React.StrictMode>
);