// File: src/pages/LandingPage.jsx
import React from 'react';
import '../styles/animations.css';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=900&fit=crop")',
          filter: 'brightness(0.4)'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          {/* Animated Title */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-light text-white tracking-wide animate-fade-in-down">
              SAVE
            </h1>
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              <div className="h-px w-12 bg-white/50"></div>
              <p className="text-xl text-white/80 italic font-light">the</p>
              <div className="h-px w-12 bg-white/50"></div>
            </div>
            <h2 className="text-7xl md:text-8xl font-light text-white tracking-wide animate-fade-in-up">
              DATE
            </h2>
          </div>

          {/* Wedding Info - Animated */}
          <div className="pt-8 space-y-3 animate-fade-in-up animation-delay-300">
            <h3 className="text-4xl md:text-5xl font-light text-white">
              Filip Gojković & Matea Kranjčec
            </h3>
            <p className="text-2xl text-white/80 font-light">
              August 28th, 2026
            </p>
          </div>

          {/* Decorative Line - Animated */}
          <div className="pt-16 animate-fade-in animation-delay-600">
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </div>

          {/* Floating Animation */}
          <div className="pt-4 animate-bounce animation-delay-500">
            <p className="text-white/60 text-sm italic">
              ↓ Check your invitation link ↓
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}