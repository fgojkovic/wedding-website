import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function WeddingInvitation() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    // Get invite code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite');
    if (code) {
      setInviteCode(code);
      setCurrentPage('rsvp');
    }
  }, []);

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

      // Success!
      setSubmitted(true);
      setTimeout(() => {
        setCurrentPage('landing');
        setFirstName('');
        setLastName('');
        setSubmitted(false);
        setInviteCode('');
      }, 3000);
    } catch (error) {
      console.error('RSVP Error:', error);
      setErrorMsg(error.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-light text-slate-800 tracking-wide">
              SAVE
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-slate-300"></div>
              <p className="text-xl text-slate-500 italic font-light">the</p>
              <div className="h-px w-12 bg-slate-300"></div>
            </div>
            <h2 className="text-7xl md:text-8xl font-light text-slate-800 tracking-wide">
              DATE
            </h2>
          </div>

          <div className="pt-8 space-y-3">
            <p className="text-sm text-slate-600 tracking-widest uppercase">to celebrate the wedding of</p>
            <h3 className="text-4xl md:text-5xl font-light text-slate-800">
              Matea & Filip
            </h3>
            <p className="text-2xl text-slate-500 font-light">
              August 28th, 2026
            </p>
          </div>

          <div className="pt-16">
            <div className="h-px w-24 bg-slate-200 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'rsvp') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {!submitted ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-5xl font-light text-white mb-4">
                  We invite you
                </h2>
              </div>

              <p className="text-center text-teal-50 mb-8 leading-relaxed text-base">
                We would be happy to celebrate our wedding day with you. Your presence means the world to us as we begin this new chapter of our lives together.
              </p>

              <div className="bg-teal-800 bg-opacity-50 rounded-lg p-6 mb-8 border border-teal-600 space-y-4">
                <div>
                  <p className="text-teal-300 text-sm font-light uppercase tracking-wide mb-1">Ceremony</p>
                  <p className="text-rose-300 font-light text-lg">Church Sv. Nikola</p>
                  <p className="text-teal-100 text-sm">Varaždin</p>
                  <p className="text-teal-100 text-sm">August 28th, 2026 at 17:30</p>
                </div>
                
                <div className="h-px bg-teal-600"></div>
                
                <div>
                  <p className="text-teal-300 text-sm font-light uppercase tracking-wide mb-1">Reception</p>
                  <p className="text-rose-300 font-light text-lg">Restaurant Kneja</p>
                  <p className="text-teal-100 text-sm">Međimurje</p>
                  <p className="text-teal-100 text-sm">August 28th, 2026 at 20:00</p>
                </div>
              </div>

              <form onSubmit={handleRSVPSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-teal-50 text-sm mb-2 font-light">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300"
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-teal-50 text-sm mb-2 font-light">Surname *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300"
                    placeholder="Your surname"
                    required
                  />
                </div>
                {errorMsg && <p className="text-red-300 text-sm">{errorMsg}</p>}
                <button
                  type="submit"
                  disabled={loading || !firstName || !lastName}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-light rounded-lg transition disabled:opacity-50 mt-6"
                >
                  {loading ? 'Submitting...' : 'Confirm'} →
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle size={80} className="text-green-400" />
              </div>
              <h3 className="text-3xl font-light text-white mb-2">Thank You!</h3>
              <p className="text-teal-100">Your RSVP has been confirmed. We can't wait to celebrate with you!</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}