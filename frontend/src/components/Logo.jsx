import React from 'react';

export function Logo({ size = 28, withWordmark = true, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 rounded-lg"
      aria-label="ArtLoop home"
    >
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
          <defs>
            <linearGradient id="al-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#f472b6" />
              <stop offset="55%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M16 3.2c7.07 0 12.8 5.73 12.8 12.8 0 4.69-2.52 8.79-6.27 11.02-2.04 1.21-3.99-1.05-3.07-3.16.62-1.42.96-2.99.96-4.66 0-6.4-5.18-11.6-11.58-11.6-1.6 0-3.13.32-4.52.9C2.06 9.4 4.55 4.2 9.66 3.6 11.69 3.36 13.7 3.2 16 3.2Z"
            fill="url(#al-grad)"
          />
          <circle cx="16" cy="16" r="3.2" fill="#0c0817" />
          <circle cx="16" cy="16" r="3.2" fill="url(#al-grad)" opacity=".5" />
        </svg>
        <span
          className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-90 transition-opacity"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.55), transparent 70%)' }}
        />
      </span>
      {withWordmark && (
        <span className="font-display font-bold text-[1.15rem] tracking-tight">
          ART<span className="gradient-text">LOOP</span>
        </span>
      )}
    </button>
  );
}
