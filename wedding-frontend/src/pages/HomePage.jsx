import React, { useState, useEffect, useRef } from 'react';
// Countdown calculation helper
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
import '../styles/animations.css';
import { CheckCircle, MapPin } from 'lucide-react';
// List of all available wedding photos for random selection
const weddingPhotos = [
  "fm/Sneak M&P-1.jpg",
  "fm/Sneak M&P-2.jpg",
  "fm/Sneak M&P-3.jpg",
  "fm/Sneak M&P-4.jpg",
  "fm/Sneak M&P-5.jpg",
  "fm/Sneak M&P-6.jpg",
  "fm/Sneak M&P-7.jpg",
  "fm/Sneak M&P-8.jpg",
  "fm/Sneak M&P-9.jpg",
  "fm/Sneak M&P-10.jpg",
  "fm/Sneak M&P-11.jpg",
  "fm/Sneak M&P-12.jpg",
  "fm/Sneak M&P-13.jpg",
  "fm/Sneak M&P-14.jpg",
  "fm/Sneak M&P-15.jpg",
  "fm/Sneak M&P-16.jpg",
  "fm/Sneak M&P-17.jpg",
  "fm/Sneak M&P-18.jpg",
  "fm/Sneak M&P-19.jpg",
  "fm/Sneak M&P-20.jpg",
  "fm/Sneak M&P-21.jpg",
  "fm/Sneak M&P-22.jpg",
  "fm/Sneak M&P-23.jpg",
  "fm/Sneak M&P-24.jpg",
  "fm/Sneak M&P-25.jpg",
  "fm/Sneak M&P-26.jpg",
  "fm/Sneak M&P-27.jpg",
  "fm/Sneak M&P-28.jpg",
  "fm/Sneak M&P-29.jpg",
  "fm/Sneak M&P-30.jpg",
  "fm/Sneak M&P-31.jpg",
  "fm/Sneak M&P-32.jpg",
  "fm/Sneak M&P-33.jpg",
  "fm/Sneak M&P-34.jpg",
  "fm/Sneak M&P-35.jpg",
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function HomePage() {
  // Wedding date state
  const [weddingDate, setWeddingDate] = useState(new Date('2026-08-28T17:30:00'));
  // Countdown state
  const [countdown, setCountdown] = useState(getCountdownParts(new Date('2026-08-28T17:30:00')));

  useEffect(() => {
    // Fetch wedding date from backend
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
  // Pick random photos for hero, glide, and countdown backgrounds only once
  const randomPhoto = useRef(weddingPhotos[Math.floor(Math.random() * weddingPhotos.length)]).current;
  const glidePhoto1 = useRef(weddingPhotos[Math.floor(Math.random() * weddingPhotos.length)]).current;
  const glidePhoto2 = useRef(weddingPhotos[Math.floor(Math.random() * weddingPhotos.length)]).current;
  const countdownPhoto = useRef(weddingPhotos[Math.floor(Math.random() * weddingPhotos.length)]).current;
  // RSVP form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('da');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          attendance,
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
    <div className="w-full min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/${randomPhoto}')`, filter: 'brightness(0.85)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-white/0" />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 w-full">
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-light text-white tracking-wide animate-fade-in-down">Filip & Matea</h2>
            <p className="text-2xl md:text-3xl text-white/90 font-light animate-fade-in-up">Vas pozivamo na naše vjenčanje</p>
          </div>
        </div>
      </section>

      {/* 2. Wedding Plan Section (Beige) */}
      <section className="w-full py-20 bg-[#f7f1e7] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-10 text-center">Plan vjenčanja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Ceremony */}
            <div className="bg-white/80 rounded-lg p-6 border border-gray-200 space-y-3 shadow">
              <p className="text-rose-400 font-light text-lg">Crkva Sv. Nikola</p>
              <p className="text-gray-700 text-sm">Varaždin</p>
              <p className="text-gray-700 text-sm">Petak, 28. kolovoza 2026. u 17:30</p>
              <a href="https://maps.app.goo.gl/Q5w1anWPi4d7AXn27" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition duration-200 w-max"><MapPin size={12} /> Pogledaj kartu</a>
            </div>
            {/* Reception */}
            <div className="bg-white/80 rounded-lg p-6 border border-gray-200 space-y-3 shadow">
              <p className="text-rose-400 font-light text-lg">Restoran Kneja</p>
              <p className="text-gray-700 text-sm">Međimurje</p>
              <p className="text-gray-700 text-sm">Petak, 28. kolovoza 2026. u 20:00</p>
              <a href="https://maps.app.goo.gl/HaMKAaBKWqB5wMDP7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition duration-200 w-max"><MapPin size={12} /> Pogledaj kartu</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Two-Photo Glide Section */}
      <section className="w-full py-24 bg-white flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl flex flex-col md:flex-row gap-8 px-4">
          <div className="w-full md:w-1/2 h-96 rounded-3xl overflow-hidden shadow-lg transform md:-translate-x-16 glide-photo glide-photo-left" style={{ backgroundImage: `url('/images/${glidePhoto1}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="w-full md:w-1/2 h-96 rounded-3xl overflow-hidden shadow-lg transform md:translate-x-16 glide-photo glide-photo-right" style={{ backgroundImage: `url('/images/${glidePhoto2}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </section>

      {/* 4. Countdown Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/${countdownPhoto}')`, filter: 'brightness(0.7)' }} />
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16 space-y-12">
          <h3 className="text-3xl md:text-4xl font-light text-gray-900">Do vjenčanja je ostalo:</h3>
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            <div>
              <div className="text-6xl md:text-8xl font-bold text-gray-900">{countdown.days}</div>
              <div className="text-2xl md:text-3xl text-gray-900 font-light mt-4">dana</div>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-bold text-gray-900">{countdown.hours}</div>
              <div className="text-2xl md:text-3xl text-gray-900 font-light mt-4">sati</div>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-bold text-gray-900">{countdown.minutes}</div>
              <div className="text-2xl md:text-3xl text-gray-900 font-light mt-4">minuta</div>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-bold text-gray-900">{countdown.seconds}</div>
              <div className="text-2xl md:text-3xl text-gray-900 font-light mt-4">sekundi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RSVP Info Section */}
      <section className="w-full py-28 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl px-4 text-center space-y-6">
          <h3 className="text-3xl font-light text-gray-900 mb-4">Potvrdite dolazak</h3>
          <p className="text-lg text-gray-700">Molimo potvrdite svoj dolazak do 1. kolovoza 2028. putem forme niže</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            <div>
              <div className="font-bold text-gray-900">Filip</div>
              <div className="text-gray-700">+385 99 3688 644</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">Matea</div>
              <div className="text-gray-700">+385 95 390 4605</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RSVP Form Section */}
      <section className="w-full py-4 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl px-4">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <CheckCircle size={80} className="text-green-400 mx-auto" />
                <h3 className="text-3xl font-light text-gray-900">Thank You!</h3>
                <p className="text-gray-700">Your RSVP has been confirmed. We can't wait to celebrate with you!</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-light text-gray-900 mb-6 text-center">Potvrda dolaska</h3>
                <form onSubmit={handleRSVPSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 text-sm mb-2 font-light">Ime *</label>
                    <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300" placeholder="Vaše ime" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 text-sm mb-2 font-light">Prezime *</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300" placeholder="Vaše prezime" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm mb-2 font-light">Email <span className="text-teal-400 text-xs">(opcionalno — za podsjetnik 24h prije)</span></label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300" placeholder="vas@email.com" />
                  </div>
                  <div>
                    <label htmlFor="attendance" className="block text-gray-700 text-sm mb-2 font-light">Potvrda dolaska *</label>
                    <select
                      id="attendance"
                      value={attendance}
                      onChange={e => setAttendance(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300 transition duration-300"
                      required
                    >
                      <option value="da">Da (Yes)</option>
                      <option value="ne">Ne (No)</option>
                    </select>
                  </div>
                  {errorMsg && <div className="text-red-500 text-sm bg-red-100 p-3 rounded border border-red-200 animate-shake">{errorMsg}</div>}
                  <button type="submit" disabled={loading || !firstName || !lastName} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-light rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 mt-8">{loading ? 'Slanje...' : 'Potvrdi dolazak'} →</button>
                </form>
                <p className="text-gray-400 text-xs text-center mt-6 font-light">Vaši podaci su sigurni i koristit će se samo za potrebe vjenčanja</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer Section with Quote */}
      <footer className="w-full py-16 bg-[#f7f1e7] flex flex-col items-center justify-center text-center">
        <div className="text-2xl md:text-3xl text-gray-900 font-fancy mb-6">
          Have I told you lately that I love you<br/>
          Have I told you there's no one else above you<br/>
          You fill my heart with gladness<br/>
          Take away all my sadness<br/>
          Ease my troubles, that's what you do
        </div>
        <div className="text-lg text-gray-900 font-light">Veselimo se Vašem dolasku!</div>
      </footer>
    </div>
  );
}
