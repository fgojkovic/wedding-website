// File: src/pages/RSVPPage.jsx
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import '../styles/animations.css';

export default function RSVPPage({ inviteCode, onReturn }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
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
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center px-4 py-12">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-12 animate-fade-in-down">
          <h2 className="text-5xl font-light text-white mb-4">
            We invite you
          </h2>
        </div>

        <p className="text-center text-teal-50 mb-8 leading-relaxed text-base animate-fade-in animation-delay-150">
          We would be happy to celebrate our wedding day with you. Your presence means the world to us as we begin this new chapter of our lives together.
        </p>

        <div className="bg-teal-800 bg-opacity-50 rounded-lg p-6 mb-8 border border-teal-600 space-y-4 animate-slide-up animation-delay-300">
          <div className="transform hover:scale-105 transition duration-300">
            <p className="text-teal-300 text-sm font-light uppercase tracking-wide mb-1">Ceremony</p>
            <p className="text-rose-300 font-light text-lg">Church Sv. Nikola</p>
            <p className="text-teal-100 text-sm">Varaždin</p>
            <p className="text-teal-100 text-sm">August 28th, 2026 at 17:30</p>
          </div>

          <div className="h-px bg-teal-600"></div>

          <div className="transform hover:scale-105 transition duration-300">
            <p className="text-teal-300 text-sm font-light uppercase tracking-wide mb-1">Reception</p>
            <p className="text-rose-300 font-light text-lg">Restaurant Kneja</p>
            <p className="text-teal-100 text-sm">Međimurje</p>
            <p className="text-teal-100 text-sm">August 28th, 2026 at 20:00</p>
          </div>
        </div>

        <form onSubmit={handleRSVPSubmit} className="space-y-4 mb-6 animate-fade-in animation-delay-450">
          <div className="transform transition duration-300 hover:translate-x-1">
            <label className="block text-teal-50 text-sm mb-2 font-light">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
              placeholder="Your first name"
              required
            />
          </div>

          <div className="transform transition duration-300 hover:translate-x-1">
            <label className="block text-teal-50 text-sm mb-2 font-light">Surname *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
              placeholder="Your surname"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-300 text-sm bg-red-900/20 p-3 rounded animate-shake">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !firstName || !lastName}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-light rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mt-6 transform hover:scale-105"
          >
            {loading ? 'Submitting...' : 'Confirm'} →
          </button>
        </form>
      </div>
    </div>
  );
}