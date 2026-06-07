import React, { useState, useEffect } from 'react';
import '../styles/animations.css';
import { CheckCircle, MapPin } from 'lucide-react';

function getCountdownParts(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const heroPhoto = 'fm/webp/image1.webp';
const countdownPhoto = 'fm/webp/image2.webp';
const closingPhoto = 'fm/webp/image3.webp';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function HomePage() {
  const [weddingDate, setWeddingDate] = useState(new Date('2026-08-28T17:30:00'));
  const [countdown, setCountdown] = useState(getCountdownParts(new Date('2026-08-28T17:30:00')));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/wedding-date`).then(async res => {
      if (res.ok) {
        const data = await res.json();
        if (data.date) {
          setWeddingDate(new Date(data.date));
        }
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts(weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

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
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit RSVP');
      }
      setSubmitted(true);
    } catch (error) {
      setErrorMsg(error.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black antialiased">
      <section className="relative w-full overflow-hidden">
        <img
          src={`/images/${heroPhoto}`}
          alt=""
          className="w-full h-auto block opacity-80 mt-[-700px]"
          style={{ filter: 'brightness(0.85)' }}
        />

        {/* 1. Hero Section */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 w-full">
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="font-seasons text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.06em] leading-tight animate-fade-in-down">Matea & Filip</h2>
            <p className="font-seasons text-2xl md:text-3xl text-white/95 leading-relaxed animate-fade-in-up">Čuvajte datum, obucite osmijeh i slavite s nama</p>
            <p className="font-seasons text-2xl md:text-3xl text-white/95 leading-relaxed animate-fade-in-up">28.8.2026.</p>
          </div>
        </div>
      </section>

        {/* 2. Wedding Plan Section */}
      <section className="w-full py-28 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          <h3 className="font-seasons text-3xl md:text-5xl text-black mb-10 text-center tracking-wide">Plan vjenčanja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="bg-white rounded-lg p-6 border border-black space-y-3 shadow flex flex-col items-center text-center">
              <p className="font-seasons text-black text-2xl">Crkva Sv. Nikola</p>
              <p className="text-black text-base">Trg slobode 11, 42000, Varaždin</p>
              <p className="text-black text-base">17:30</p>
              <a href="https://maps.app.goo.gl/Q5w1anWPi4d7AXn27" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded-full transition duration-200"><MapPin size={12} /> Pogledaj kartu</a>
            </div>
            <div className="bg-white rounded-lg p-6 border border-black space-y-3 shadow flex flex-col items-center text-center">
              <p className="font-seasons text-black text-2xl">Restoran Kneja</p>
              <p className="text-black text-base">Prvomajska ul. 11, 40311, Mali Mihaljevec</p>
              <p className="text-black text-base">18:30</p>
              <a href="https://maps.app.goo.gl/HaMKAaBKWqB5wMDP7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded-full transition duration-200"><MapPin size={12} /> Pogledaj kartu</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Countdown Section */}
      <section className="relative w-full overflow-hidden">
        <img
          src={`/images/${countdownPhoto}`}
          alt=""
          className="w-full h-auto block opacity-80 mt-[-900px]"
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 py-16 space-y-12">
          <h3 className="font-seasons text-3xl md:text-5xl text-white tracking-wide">Ljubav je u zraku, a datum sve bliže</h3>
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            <div>
              <div className="font-seasons text-6xl md:text-8xl text-white">{countdown.days}</div>
              <div className="text-2xl md:text-3xl text-white mt-4">dana</div>
            </div>
            <div>
              <div className="font-seasons text-6xl md:text-8xl text-white">{countdown.hours}</div>
              <div className="text-2xl md:text-3xl text-white mt-4">sati</div>
            </div>
            <div>
              <div className="font-seasons text-6xl md:text-8xl text-white">{countdown.minutes}</div>
              <div className="text-2xl md:text-3xl text-white mt-4">minuta</div>
            </div>
            <div>
              <div className="font-seasons text-6xl md:text-8xl text-white">{countdown.seconds}</div>
              <div className="text-2xl md:text-3xl text-white mt-4">sekundi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RSVP Info Section */}
      <section className="w-full py-28 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl px-4 text-center space-y-6">
          <h3 className="font-seasons text-3xl md:text-4xl text-black mb-4">Potvrdite dolazak</h3>
          <p className="text-xl text-gray-700 leading-relaxed">Molimo potvrdite svoj dolazak do 25.7. putem forme niže ili na brojeve telefona</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            <div>
              <div className="font-seasons text-black text-xl">Filip</div>
              <div className="text-gray-700">+385 99 3688 644</div>
            </div>
            <div>
              <div className="font-seasons text-black text-xl">Matea</div>
              <div className="text-gray-700">+385 95 390 4605</div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden">
        <img
          src={`/images/${closingPhoto}`}
          alt=""
          className="w-full h-auto block opacity-80"
          style={{ filter: 'brightness(0.9)' }}
        />
        {/* 5. RSVP Form Section */}
        <section className="absolute inset-0 z-10 w-full flex items-center justify-center">
          <div className="w-full max-w-2xl px-4 py-8">
            <div className="bg-transparent rounded-lg p-8 border border-black/30">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <CheckCircle size={80} className="text-green-400 mx-auto" />
                  <h3 className="font-seasons text-3xl text-white">Thank You!</h3>
                  <p className="text-white/90">Your RSVP has been confirmed. We can't wait to celebrate with you!</p>
                </div>
              ) : (
                <>
                  <h3 className="font-seasons text-3xl text-white mb-6 text-center">Potvrda dolaska</h3>
                  <form onSubmit={handleRSVPSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="firstName" className="block text-white text-sm mb-2 font-light">Ime *</label>
                      <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-white/50 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition duration-300" placeholder="Vaše ime" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-white text-sm mb-2 font-light">Prezime *</label>
                      <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-white/50 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition duration-300" placeholder="Vaše prezime" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white text-sm mb-2 font-light">E-mail <span className="text-white/70 text-xs">(opcionalno: za podsjetnik 24h prije)</span></label>
                      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-white/50 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition duration-300" placeholder="vas@email.com" />
                    </div>
                    {errorMsg && <div className="text-red-500 text-sm bg-red-100 p-3 rounded border border-red-200 animate-shake">{errorMsg}</div>}
                    <button type="submit" disabled={loading || !firstName || !lastName} className="w-full py-3 bg-white hover:bg-gray-50 text-white border border-black/20 font-light rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 mt-8">{loading ? 'Slanje...' : 'Potvrdi dolazak'}</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* 6. Footer Section with Quote */}
      <footer className="w-full py-28 bg-white flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-2xl px-4">
          <div className="font-seasons text-2xl md:text-3xl text-black leading-relaxed">
            You fill my heart with gladness<br/>
            Take away all my sadness<br/>
            Ease my troubles, that's what you do
          </div>
        </div>
      </footer>
    </div>
  );
}
