// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import RSVPPage from './pages/RSVPPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (code) {
      setInviteCode(code);
      setCurrentPage('rsvp');
    }
  }, []);

  const handleGoToLanding = () => {
    setCurrentPage('landing');
    setInviteCode('');
    window.history.pushState({}, '', window.location.pathname);
  };

  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'rsvp') {
    return <RSVPPage inviteCode={inviteCode} onReturn={handleGoToLanding} />;
  }
}