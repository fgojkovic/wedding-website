// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import RSVPPage from './pages/RSVPPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth) {
      setCurrentPage('admin-dashboard');
    }

    // Get invite code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    const adminParam = params.get('admin');

    if (adminParam === 'true') {
      // Admin login page
      if (!adminAuth) {
        setCurrentPage('admin-login');
      } else {
        setCurrentPage('admin-dashboard');
      }
    } else if (code) {
      // RSVP page with invite code
      setInviteCode(code);
      setCurrentPage('rsvp');
    }
  }, []);

  const handleGoToLanding = () => {
    setCurrentPage('landing');
    setInviteCode('');
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setCurrentPage('landing');
    window.history.pushState({}, '', window.location.pathname);
  };

  // Render current page
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'rsvp') {
    return <RSVPPage inviteCode={inviteCode} onReturn={handleGoToLanding} />;
  }

  if (currentPage === 'admin-login') {
    return <AdminLoginPage onLoginSuccess={handleAdminLogin} />;
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboardPage onLogout={handleAdminLogout} />;
  }
}