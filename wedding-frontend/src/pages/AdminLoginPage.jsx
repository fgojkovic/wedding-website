// File: src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import '../styles/animations.css';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simple authentication (credentials: admin / 12345)
    if (username === 'admin' && password === '12345') {
      // Store auth token in sessionStorage (not localStorage for security)
      sessionStorage.setItem('adminAuth', JSON.stringify({
        username,
        timestamp: Date.now()
      }));
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid username or password');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/admin-login-bg.jpg")',
          filter: 'brightness(0.3)'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full animate-fade-in">
          {/* Login Card */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-lg p-8 border border-slate-700/30 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-down">
              <div className="flex justify-center mb-4">
                <div className="bg-cyan-500/20 p-3 rounded-full">
                  <Lock size={40} className="text-cyan-400" />
                </div>
              </div>
              <h2 className="text-3xl font-light text-white mb-2">
                Admin Panel
              </h2>
              <p className="text-slate-400 text-sm">
                Secure access to RSVP management
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in animation-delay-200">
              <div className="transform transition duration-300">
                <label className="block text-slate-200 text-sm mb-2 font-light">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/20 transition duration-300"
                  placeholder="Enter username"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="transform transition duration-300">
                <label className="block text-slate-200 text-sm mb-2 font-light">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/20 transition duration-300"
                  placeholder="Enter password"
                  autoComplete="off"
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-red-300 text-sm bg-red-900/30 p-3 rounded border border-red-600/30 animate-shake">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-light rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 mt-8"
              >
                {loading ? 'Authenticating...' : 'Login'} →
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700/30 text-center">
              <p className="text-slate-400 text-xs font-light">
                This area is restricted to authorized users only.
              </p>
            </div>
          </div>

          {/* Demo Hint */}
          <div className="mt-6 text-center animate-fade-in animation-delay-400">
            <p className="text-slate-400 text-xs">
              Demo credentials: <span className="text-cyan-400 font-semibold">admin</span> / <span className="text-cyan-400 font-semibold">12345</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}