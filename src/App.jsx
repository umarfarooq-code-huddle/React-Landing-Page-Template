import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Application from './components/Application';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewApplications from './components/ViewApplications';
import AdminLogin from './Auth/AdminLogin';
import ProtectedRoute from './Auth/ProtectedRoute';
import NewsFeed from './pages/NewsFeed';
import AdminAddNews from './pages/AdminAddNews';
import AdminAddDrawSchedule from './pages/AdminAddDrawSchedule';
import DrawSchedule from './pages/DrawSchedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/application" element={<Application />} />
        <Route path="/news-feed" element={<NewsFeed />} />
        <Route path="/draw-schedule" element={<DrawSchedule />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ViewApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-add-news"
          element={
            <ProtectedRoute>
              <AdminAddNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-add-draw"
          element={
            <ProtectedRoute>
              <AdminAddDrawSchedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
