import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppAuthProvider, isClerkMode } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const AppShell = () => (
  <ThemeProvider>
    <AppAuthProvider>
      <App />
    </AppAuthProvider>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isClerkMode ? (
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        afterSignOutUrl="/"
      >
        <AppShell />
      </ClerkProvider>
    ) : (
      <AppShell />
    )}
  </React.StrictMode>
);
