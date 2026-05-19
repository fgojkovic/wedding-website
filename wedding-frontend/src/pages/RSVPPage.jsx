// File: src/pages/RSVPPage.jsx
import React, { useState, useEffect } from 'react';
import LazyBackgroundImage from '../components/LazyBackgroundImage';
import { CheckCircle, ExternalLink, MapPin } from 'lucide-react';
import '../styles/animations.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function RSVPPage({ inviteCode, onReturn }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch guest name from backend using invite code
  useEffect(() => {
    if (!inviteCode) return;

    fetch(`${API_BASE}/api/invite/${inviteCode}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.guestName && data.guestName !== 'General Invitation') {
          const parts = data.guestName.trim().split(' ');
          setFirstName(parts[0] || '');
          setLastName(parts.slice(1).join(' ') || '');
        }
      })
      .catch(() => {});
  }, [inviteCode]);

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email || null,
          inviteCode
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit RSVP');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('RSVP Error:', error);
      setErrorMsg(error.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <LazyBackgroundImage
          src="/images/rsvp-bg.jpg"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ filter: 'brightness(0.3)' }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 min-h-screen bg-gradient-to-b from-teal-900/80 via-teal-800/80 to-slate-900/80 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="animate-scale-in">
                <CheckCircle size={100} className="text-green-400" />
              </div>
            </div>
            <h3 className="text-4xl font-light text-white mb-3 animate-fade-in-up animation-delay-200">
              Thank You!
            </h3>
            <p className="text-teal-100 mb-8 animate-fade-in-up animation-delay-300">
              Your RSVP has been confirmed. We can't wait to celebrate with you!
            </p>
            <button
              onClick={onReturn}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-light rounded-lg transition duration-300 hover:shadow-lg animate-fade-in-up animation-delay-400"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fixed background */}
      <LazyBackgroundImage
        src="/images/rsvp-bg.jpg"
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ filter: 'brightness(0.3)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent -z-10" />

      {/* RSVP Section */}
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Left Side - Text Content */}
            <div className="text-white space-y-6 animate-fade-in-down">
              <div>
                <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
                  We invite you
                </h2>
                <div className="h-1 w-20 bg-rose-400"></div>
              </div>

              <p className="text-lg text-teal-50 leading-relaxed">
                We would be happy to celebrate our wedding day with you. Your presence means the world to us as we begin this new chapter of our lives together.
              </p>

              <div className="bg-teal-900/60 backdrop-blur rounded-lg p-6 border border-teal-600 space-y-6 mt-8">
                {/* Ceremony */}
                <div className="transition duration-300">
                  <p className="text-rose-300 font-light text-lg">Church Sv. Nikola</p>
                  <p className="text-teal-100 text-sm">Varaždin</p>
                  <p className="text-teal-100 text-sm">August 28th, 2026 at 17:30</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href="https://www.zupa-sv-nikole-varazdin.hr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-teal-700/60 hover:bg-teal-600/60 text-teal-100 rounded-full transition duration-200"
                    >
                      <ExternalLink size={12} /> Website
                    </a>
                    <a
                      href="https://maps.app.goo.gl/Q5w1anWPi4d7AXn27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-teal-700/60 hover:bg-teal-600/60 text-teal-100 rounded-full transition duration-200"
                    >
                      <MapPin size={12} /> View Map
                    </a>
                  </div>
                </div>

                <div className="h-px bg-teal-600/50"></div>

                {/* Reception */}
                <div className="transition duration-300">
                  <p className="text-rose-300 font-light text-lg">Restaurant Kneja</p>
                  <p className="text-teal-100 text-sm">Međimurje</p>
                  <p className="text-teal-100 text-sm">August 28th, 2026 at 20:00</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href="https://restoran-kneja.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-teal-700/60 hover:bg-teal-600/60 text-teal-100 rounded-full transition duration-200"
                    >
                      <ExternalLink size={12} /> Website
                    </a>
                    <a
                      href="https://maps.app.goo.gl/HaMKAaBKWqB5wMDP7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-3 py-1 bg-teal-700/60 hover:bg-teal-600/60 text-teal-100 rounded-full transition duration-200"
                    >
                      <MapPin size={12} /> View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-teal-900/70 backdrop-blur-md rounded-lg p-8 border border-teal-600/30 animate-fade-in-up animation-delay-300">
              <h3 className="text-2xl font-light text-white mb-6 text-center">Confirm Your Attendance</h3>

              <form onSubmit={handleRSVPSubmit} className="space-y-5">
                <div className="transform transition duration-300 hover:translate-x-1">
                  <label htmlFor="firstName" className="block text-teal-50 text-sm mb-2 font-light">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
                    placeholder="Your first name"
                    required
                  />
                </div>

                <div className="transform transition duration-300 hover:translate-x-1">
                  <label htmlFor="lastName" className="block text-teal-50 text-sm mb-2 font-light">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
                    placeholder="Your last name"
                    required
                  />
                </div>

                <div className="transform transition duration-300 hover:translate-x-1">
                  <label htmlFor="email" className="block text-teal-50 text-sm mb-2 font-light">
                    Email <span className="text-teal-400 text-xs">(optional — to receive a reminder 24h before)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-300 text-sm bg-red-900/30 p-3 rounded border border-red-600/30 animate-shake">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !firstName || !lastName}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-light rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 mt-8"
                >
                  {loading ? 'Submitting...' : 'Confirm'} →
                </button>
              </form>

              <p className="text-teal-300 text-xs text-center mt-6 font-light">
                Your information is secure and will only be used for our wedding
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Maps Section */}
      <div className="relative px-4 py-16 bg-black/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-light text-white text-center mb-2">Venue Locations</h3>
          <div className="h-px w-16 bg-rose-400 mx-auto mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Ceremony */}
            <div className="bg-teal-900/60 backdrop-blur rounded-xl overflow-hidden border border-teal-600/30">
              <div className="p-5">
                <p className="text-teal-300 text-xs font-light uppercase tracking-widest mb-1">📍 Ceremony</p>
                <h4 className="text-rose-300 text-xl font-light mb-1">Church Sv. Nikola</h4>
                <p className="text-teal-100 text-sm mb-4">Varaždin · August 28th at 17:30</p>
                <div className="flex gap-2">
                  <a
                    href="https://www.zupa-sv-nikole-varazdin.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition duration-200"
                  >
                    <ExternalLink size={12} /> Website
                  </a>
                  <a
                    href="https://maps.app.goo.gl/Q5w1anWPi4d7AXn27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-rose-700/70 hover:bg-rose-600/70 text-white rounded-lg transition duration-200"
                  >
                    <MapPin size={12} /> Open in Maps
                  </a>
                </div>
              </div>
              <iframe
                title="Ceremony location"
                src="https://maps.google.com/maps?q=Z%C5%BEupna+crkva+sv.+Nikole+Vara%C5%BEdin+Hrvatska&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Reception */}
            <div className="bg-teal-900/60 backdrop-blur rounded-xl overflow-hidden border border-teal-600/30">
              <div className="p-5">
                <p className="text-teal-300 text-xs font-light uppercase tracking-widest mb-1">🍽️ Reception</p>
                <h4 className="text-rose-300 text-xl font-light mb-1">Restaurant Kneja</h4>
                <p className="text-teal-100 text-sm mb-4">Međimurje · August 28th at 20:00</p>
                <div className="flex gap-2">
                  <a
                    href="https://restoran-kneja.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition duration-200"
                  >
                    <ExternalLink size={12} /> Website
                  </a>
                  <a
                    href="https://maps.app.goo.gl/HaMKAaBKWqB5wMDP7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-rose-700/70 hover:bg-rose-600/70 text-white rounded-lg transition duration-200"
                  >
                    <MapPin size={12} /> Open in Maps
                  </a>
                </div>
              </div>
              <iframe
                title="Reception location"
                src="https://maps.google.com/maps?q=Restoran+Kneja+Me%C4%91imurje+Hrvatska&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}