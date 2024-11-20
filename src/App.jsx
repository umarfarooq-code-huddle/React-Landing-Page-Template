import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Application from './components/Application';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the OAuth provider
import ViewApplications from './components/ViewApplications';

function App() {
  return (
    <GoogleOAuthProvider clientId="189661213738-0m6dfqligt2hslr2g0a1qiunh7tib5qs.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/application" element={<Application />} />
        <Route path="/applications" element={<ViewApplications />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
