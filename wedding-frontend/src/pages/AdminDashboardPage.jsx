// File: src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, Download, RefreshCw, Users, Calendar, CheckCircle2 } from 'lucide-react';
import '../styles/animations.css';

export default function AdminDashboardPage({ onLogout }) {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/rsvp-list');

      if (!response.ok) {
        throw new Error('Failed to fetch RSVPs');
      }

      const data = await response.json();
      setRsvps(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Fetch Error:', error);
      setErrorMsg('Failed to load RSVPs. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (rsvps.length === 0) {
      alert('No RSVPs to download');
      return;
    }

    let csv = 'First Name,Last Name,Date Submitted\n';
    rsvps.forEach(rsvp => {
      const date = new Date(rsvp.created_at).toLocaleDateString();
      csv += `${rsvp.first_name},${rsvp.last_name},${date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&h=900&fit=crop")',
          filter: 'brightness(0.25)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/90" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
                  Wedding RSVP Dashboard
                </h1>
                <p className="text-white/60 text-sm">
                  Manage and view all guest confirmations
                </p>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition duration-300 hover:shadow-lg animate-fade-in animation-delay-300 w-full md:w-auto justify-center"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total RSVPs Card */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300/80 text-xs font-light uppercase tracking-widest mb-4">
                    Total Confirmations
                  </p>
                  <p className="text-5xl font-light text-white">
                    {rsvps.length}
                  </p>
                </div>
                <div className="bg-cyan-500/20 p-4 rounded-full">
                  <Users size={40} className="text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Wedding Date Card */}
            <div className="bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in animation-delay-150">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-300/80 text-xs font-light uppercase tracking-widest mb-4">
                    Wedding Date
                  </p>
                  <p className="text-2xl font-light text-white">
                    August 28th
                  </p>
                  <p className="text-sm text-rose-300/60 mt-1">
                    2026
                  </p>
                </div>
                <div className="bg-rose-500/20 p-4 rounded-full">
                  <Calendar size={40} className="text-rose-400" />
                </div>
              </div>
            </div>

            {/* Response Rate Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in animation-delay-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300/80 text-xs font-light uppercase tracking-widest mb-4">
                    RSVPs Received
                  </p>
                  <p className="text-3xl font-light text-white">
                    {rsvps.length}
                  </p>
                  <p className="text-sm text-emerald-300/60 mt-1">
                    guests confirmed
                  </p>
                </div>
                <div className="bg-emerald-500/20 p-4 rounded-full">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-300 p-4 rounded-lg mb-8 animate-shake backdrop-blur-sm">
              {errorMsg}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in animation-delay-200">
            <button
              onClick={fetchRSVPs}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition duration-300 disabled:opacity-50 backdrop-blur-sm hover:shadow-lg"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="font-light">Refresh</span>
            </button>

            <button
              onClick={downloadCSV}
              disabled={rsvps.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg transition duration-300 disabled:opacity-50 backdrop-blur-sm hover:shadow-lg"
            >
              <Download size={18} />
              <span className="font-light">Download CSV</span>
            </button>

            {lastUpdated && (
              <div className="flex-1 flex items-center justify-end text-white/60 text-sm font-light">
                <span>Last updated: <span className="text-white/80">{lastUpdated}</span></span>
              </div>
            )}
          </div>

          {/* Guests Table */}
          {loading ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-white/60 font-light">Loading RSVPs...</p>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm animate-fade-in">
              <Users size={48} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/60 mb-2 font-light">No RSVPs yet</p>
              <p className="text-white/40 text-sm font-light">Guest confirmations will appear here</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm animate-fade-in animation-delay-300 hover:shadow-xl transition duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-5 text-left">
                        <span className="text-white/80 font-light text-xs uppercase tracking-wider">
                          First Name
                        </span>
                      </th>
                      <th className="px-6 py-5 text-left">
                        <span className="text-white/80 font-light text-xs uppercase tracking-wider">
                          Last Name
                        </span>
                      </th>
                      <th className="px-6 py-5 text-left">
                        <span className="text-white/80 font-light text-xs uppercase tracking-wider">
                          Date Submitted
                        </span>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-white/10">
                    {rsvps.map((rsvp, index) => (
                      <tr
                        key={rsvp.id}
                        className="hover:bg-white/5 transition duration-200 animate-fade-in"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <td className="px-6 py-5">
                          <span className="text-white font-light">
                            {rsvp.first_name}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-white font-light">
                            {rsvp.last_name}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-white/70 text-sm font-light">
                            {new Date(rsvp.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-white/5 border-t border-white/10 px-6 py-5">
                <p className="text-white/60 text-sm font-light">
                  Total: <span className="text-white font-light">{rsvps.length} guest{rsvps.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}