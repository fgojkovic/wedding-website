// File: src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import LazyBackgroundImage from '../components/LazyBackgroundImage';
import { LogOut, Download, RefreshCw, Users, CheckCircle2, Mail, Link, Upload, Send, Trash2 } from 'lucide-react';
import '../styles/animations.css';

// Snackbar component
function Snackbar({ message, onClose, color = 'red' }) {
  if (!message) return null;
  const bg = color === 'green' ? 'bg-emerald-600' : 'bg-red-600';
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bg} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-4`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold">&times;</button>
    </div>
  );
}

function AdminDashboardPage({ onLogout }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  // Snackbar state
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('red');
  const showSnackbar = (msg, color = 'red') => {
    setSnackbarMsg(msg);
    setSnackbarColor(color);
    setTimeout(() => setSnackbarMsg(''), 5000);
  };
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Invite generator state
  const [inviteBaseUrl, setInviteBaseUrl] = useState('https://f-m-wedding.duckdns.org/');
  const [inviteFile, setInviteFile] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResults, setInviteResults] = useState(null);
  const [inviteError, setInviteError] = useState('');

  // Wedding date state
  const [weddingDate, setWeddingDate] = useState('2026-08-28T17:30');
  const [weddingDateLoading, setWeddingDateLoading] = useState(false);
  const [showWeddingDateDialog, setShowWeddingDateDialog] = useState(false);

  useEffect(() => {
    fetchWeddingDate();
  }, []);

  const fetchWeddingDate = async () => {
    setWeddingDateLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/wedding-date`);
      if (!res.ok) throw new Error('Failed to fetch wedding date');
      const data = await res.json();
      // Format for input type="datetime-local"
      setWeddingDate(data.date ? data.date.slice(0, 16) : '2026-08-28T17:30');
    } catch (err) {
      showSnackbar('Failed to load wedding date');
    } finally {
      setWeddingDateLoading(false);
    }
  };

  const handleWeddingDateSave = async () => {
    setWeddingDateLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/wedding-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: weddingDate })
      });
      if (!res.ok) throw new Error('Failed to save wedding date');
      showSnackbar('Wedding date updated!', 'green');
    } catch (err) {
      showSnackbar('Failed to save wedding date', 'red');
    } finally {
      setWeddingDateLoading(false);
    }
  };

  // Email test state
  const [testEmail, setTestEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState('');
  const [emailError, setEmailError] = useState('');

  // Reminder blast state
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, first_name, last_name }
  const [deleteLoading, setDeleteLoading] = useState(false);



  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE}/api/rsvp-list`);
      if (!response.ok) throw new Error('Failed to fetch RSVPs');
      const data = await response.json();
      setRsvps(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Fetch Error:', error);
      setErrorMsg('Failed to load RSVPs. Make sure your backend is running.');
      showSnackbar('Failed to load RSVPs. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRsvps = rsvps;

  const downloadCSV = () => {
    if (rsvps.length === 0) { alert('No RSVPs to download'); return; }
    let csv = 'First Name,Last Name,Email,Date Submitted\n';
    rsvps.forEach(rsvp => {
      const date = new Date(rsvp.created_at).toLocaleDateString();
      csv += `${rsvp.first_name},${rsvp.last_name},${rsvp.email || ''},${date}\n`;
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

  const handleGenerateInvites = async () => {
    setInviteLoading(true);
    setInviteResults(null);
    setInviteError('');
    try {
      const formData = new FormData();
      formData.append('baseUrl', inviteBaseUrl);
      if (inviteFile) formData.append('file', inviteFile);

      const res = await fetch(`${API_BASE}/api/invites/generate`, {
        method: 'POST',
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid response from server.');
      }
      if (!res.ok) throw new Error(data.error || 'Failed to generate invites');
      setInviteResults(data.invites);
    } catch (err) {
      setInviteError(err.message);
      showSnackbar(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    setEmailLoading(true);
    setEmailMsg('');
    setEmailError('');
    try {
      const res = await fetch(`${API_BASE}/api/email/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail }),
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid response from server.');
      }
      if (!res.ok) throw new Error(data.error);
      setEmailMsg(data.message);
    } catch (err) {
      setEmailError(err.message);
      showSnackbar(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendReminders = async () => {
    if (!window.confirm('Send reminder emails to ALL RSVPs with an email address?')) return;
    setReminderLoading(true);
    setReminderMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/email/send-reminders`, { method: 'POST' });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid response from server.');
      }
      if (!res.ok) throw new Error(data.error);
      setReminderMsg(`Sent: ${data.sent} · Failed: ${data.failed}`);
    } catch (err) {
      setReminderMsg(`Error: ${err.message}`);
      showSnackbar(err.message);
    } finally {
      setReminderLoading(false);
    }
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/rsvp/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setRsvps((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err);
      showSnackbar('Failed to delete RSVP.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Snackbar message={snackbarMsg} onClose={() => setSnackbarMsg('')} color={snackbarColor} />
      {/* Background Image */}
      <LazyBackgroundImage
        src="/images/admin-dashboard-bg.webp"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ filter: 'brightness(0.25)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/90" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-2">Wedding RSVP Dashboard</h1>
                <p className="text-white/60 text-sm">Manage and view all guest confirmations</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition duration-300 hover:shadow-lg animate-fade-in animation-delay-300 w-full md:w-auto justify-center"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in h-full">
              <div className="flex items-center justify-between h-full">
                <div className="min-w-[8rem]">
                  <p className="text-cyan-300/80 text-xs font-light uppercase tracking-widest mb-4">Total Confirmations</p>
                  <p className="text-5xl font-light text-white">{rsvps.length}</p>

                </div>
                <div className="flex-shrink-0 flex items-center h-full">
                  <div className="bg-cyan-500/20 p-3 sm:p-4 rounded-full flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto">
                    <Users size={36} className="text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in animation-delay-150">
              <div
                className="flex items-center justify-between h-full cursor-pointer hover:bg-rose-500/10 active:bg-rose-500/20 transition duration-200 rounded-xl"
                onClick={() => setShowWeddingDateDialog(true)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowWeddingDateDialog(true); }}
                title="Edit wedding date"
              >
                <div className="w-full">
                  <p className="text-rose-300/80 text-xs font-light uppercase tracking-widest mb-4">Wedding Date</p>
                  <div className="flex items-center gap-4 sm:gap-6 px-2 py-2 w-full">
                    <div className="flex flex-col min-w-0 max-w-full md:max-w-[13rem]">
                      <span className="text-base sm:text-lg md:text-xl text-white font-light break-words truncate">
                        {(() => {
                          const [datePart, timePart] = weddingDate.split('T');
                          const [year, month, day] = datePart.split('-');
                          return `${day}.${parseInt(month)}.${year}.`;
                        })()}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg text-white/80 font-light mt-1 truncate">
                        {(() => {
                          const time = weddingDate.split('T')[1];
                          return `at ${time}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center h-full">
                  <div className="bg-rose-500/20 p-3 sm:p-4 rounded-full flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar text-rose-400" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Wedding Date Dialog - moved outside clickable card */}
            {showWeddingDateDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-slate-900 rounded-xl p-4 sm:p-8 w-full max-w-sm sm:max-w-lg shadow-2xl border border-rose-400/30 mx-2 sm:mx-0">
                  <h2 className="text-xl font-semibold text-white mb-4 text-center">Edit Wedding Date</h2>
                  <input
                    type="datetime-local"
                    value={weddingDate}
                    onChange={e => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-rose-400/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 transition duration-300 text-lg mb-4"
                    disabled={weddingDateLoading}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => { await handleWeddingDateSave(); setShowWeddingDateDialog(false); }}
                      disabled={weddingDateLoading}
                      className="flex-1 px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg transition duration-300 disabled:opacity-50 text-sm font-light"
                    >
                      {weddingDateLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowWeddingDateDialog(false)}
                      type="button"
                      className="px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 text-white/60 border border-slate-600/30 rounded-lg transition duration-300 text-sm font-light"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-sm hover:shadow-lg transition duration-300 animate-fade-in animation-delay-300">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-emerald-300/80 text-xs font-light uppercase tracking-widest mb-4">With Email</p>
                  <p className="text-3xl font-light text-white">{rsvps.filter(r => r.email).length}</p>
                  <p className="text-sm text-emerald-300/60 mt-1">can receive reminders</p>
                </div>
                <div className="bg-emerald-500/20 p-4 rounded-full"><CheckCircle2 size={40} className="text-emerald-400" /></div>
              </div>
            </div>
          </div>

          {/* ── Invite Generator ────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-violet-500/20 p-2 rounded-lg"><Link size={20} className="text-violet-400" /></div>
              <h2 className="text-xl font-light text-white">Generate Invite Links</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="inviteBaseUrl" className="block text-white/60 text-xs uppercase tracking-wider mb-2">Website URL</label>
                <input
                  id="inviteBaseUrl"
                  type="url"
                  value={inviteBaseUrl}
                  onChange={(e) => setInviteBaseUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 transition duration-300"
                  placeholder="https://yourwedding.com"
                />
              </div>
              <div>
                <label htmlFor="inviteFile" className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Excel File with Names <span className="text-white/30">(optional — first column = name)</span>
                </label>
                <label
                  htmlFor="inviteFile"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white cursor-pointer hover:border-violet-400 transition duration-300 flex items-center gap-3"
                >
                  <Upload size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-300">{inviteFile ? inviteFile.name : 'Click to choose .xlsx / .xls'}</span>
                </label>
                <input
                  id="inviteFile"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => setInviteFile(e.target.files[0] || null)}
                />
              </div>
            </div>

            <button
              onClick={handleGenerateInvites}
              disabled={inviteLoading || !inviteBaseUrl}
              className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 rounded-lg transition duration-300 disabled:opacity-50"
            >
              <Link size={16} />
              {inviteLoading ? 'Generating...' : 'Generate Links'}
            </button>

            {inviteError && (
              <p className="mt-3 text-red-300 text-sm">{inviteError}</p>
            )}

            {inviteResults && (
              <div className="mt-6 space-y-2 max-h-80 overflow-y-auto pr-1">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">{inviteResults.length} links generated</p>
                {inviteResults.map((inv) => (
                  <div key={inv.url} className="flex items-center gap-3 bg-slate-800/60 rounded-lg px-4 py-3">
                    <span className={`text-sm font-light flex-1 ${inv.isGeneral ? 'text-violet-300' : 'text-white'}`}>
                      {inv.name}
                    </span>
                    <span className="text-xs text-white/30 truncate max-w-[240px]">{inv.url}</span>
                    <button
                      onClick={() => copyToClipboard(inv.url)}
                      className="text-xs px-3 py-1 bg-violet-700/40 hover:bg-violet-600/40 text-violet-200 rounded-md transition duration-200 flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Email Tools ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Email */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-500/20 p-2 rounded-lg"><Mail size={20} className="text-cyan-400" /></div>
                <h2 className="text-xl font-light text-white">Test Email</h2>
              </div>
              <p className="text-white/40 text-sm mb-4">Send a sample reminder email to verify your SMTP settings.</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@email.com"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition duration-300 text-sm"
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={emailLoading || !testEmail}
                  className="flex items-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg transition duration-300 disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={15} />
                  {emailLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              {emailMsg && <p className="mt-3 text-emerald-300 text-sm">{emailMsg}</p>}
              {emailError && <p className="mt-3 text-red-300 text-sm">{emailError}</p>}
            </div>

            {/* Send Reminders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm animate-fade-in animation-delay-150">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-rose-500/20 p-2 rounded-lg"><Send size={20} className="text-rose-400" /></div>
                <h2 className="text-xl font-light text-white">Send Reminders</h2>
              </div>
              <p className="text-white/40 text-sm mb-4">
                Manually send the wedding reminder to all <span className="text-white/70">{rsvps.filter(r => r.email).length}</span> guests who provided an email.
                <br /><span className="text-white/30 text-xs mt-1 block">The reminder is also scheduled automatically for Aug 27th at 17:30.</span>
              </p>
              <button
                onClick={handleSendReminders}
                disabled={reminderLoading || rsvps.filter(r => r.email).length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg transition duration-300 disabled:opacity-50"
              >
                <Send size={16} />
                {reminderLoading ? 'Sending...' : 'Send to All'}
              </button>
              {reminderMsg && <p className="mt-3 text-white/60 text-sm">{reminderMsg}</p>}
            </div>
          </div>

          {/* ── Controls ────────────────────────────────────────────────────── */}
          {errorMsg && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-300 p-4 rounded-lg animate-shake backdrop-blur-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 animate-fade-in animation-delay-200">
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
                Last updated: <span className="text-white/80 ml-1">{lastUpdated}</span>
              </div>
            )}
          </div>



          {/* ── Guests Table ────────────────────────────────────────────────── */}
          {loading && (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-white/60 font-light">Loading RSVPs...</p>
            </div>
          )}
          {!loading && rsvps.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm animate-fade-in">
              <Users size={48} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/60 mb-2 font-light">No RSVPs yet</p>
              <p className="text-white/40 text-sm font-light">Guest confirmations will appear here</p>
            </div>
          )}
          {!loading && filteredRsvps.length === 0 && rsvps.length > 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm animate-fade-in">
              <p className="text-white/60 font-light">No guests match this filter</p>
            </div>
          )}
          {!loading && filteredRsvps.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm animate-fade-in animation-delay-300 hover:shadow-xl transition duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-5 text-left"><span className="text-white/80 font-light text-xs uppercase tracking-wider">First Name</span></th>
                      <th className="px-6 py-5 text-left"><span className="text-white/80 font-light text-xs uppercase tracking-wider">Last Name</span></th>
                      <th className="px-6 py-5 text-left"><span className="text-white/80 font-light text-xs uppercase tracking-wider">Email</span></th>
                      <th className="px-6 py-5 text-left"><span className="text-white/80 font-light text-xs uppercase tracking-wider">Date Submitted</span></th>
                      <th className="px-6 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredRsvps.map((rsvp, index) => (
                      <tr key={rsvp.id} className="hover:bg-white/5 transition duration-200 animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                        <td className="px-6 py-5"><span className="text-white font-light">{rsvp.first_name}</span></td>
                        <td className="px-6 py-5"><span className="text-white font-light">{rsvp.last_name}</span></td>
                        <td className="px-6 py-5">
                          {rsvp.email
                            ? <span className="text-cyan-300/80 text-sm font-light">{rsvp.email}</span>
                            : <span className="text-white/20 text-sm italic">—</span>
                          }
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-white/70 text-sm font-light">
                            {new Date(rsvp.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-right">
                          <button
                            onClick={() => setDeleteTarget(rsvp)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200"
                            title="Delete RSVP"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white/5 border-t border-white/10 px-6 py-5 flex items-center justify-between">
                <p className="text-white/60 text-sm font-light">
                  Showing: <span className="text-white font-light">{filteredRsvps.length}</span>
                  <span className="text-white/40"> guest{filteredRsvps.length === 1 ? '' : 's'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full cursor-default"
            onClick={() => !deleteLoading && setDeleteTarget(null)}
          />
          {/* Modal */}
          <div className="relative bg-slate-900 border border-red-500/30 rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-xl font-light text-white">Delete RSVP</h3>
            </div>
            <p className="text-white/70 mb-2">
              Are you sure you want to delete the RSVP for:
            </p>
            <p className="text-white font-light text-lg mb-6">
              {deleteTarget.first_name} {deleteTarget.last_name}
            </p>
            <p className="text-white/40 text-sm mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-lg transition duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={15} />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
