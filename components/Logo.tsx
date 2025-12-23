import React from 'react';

export const Logo: React.FC<{ className?: string, hideText?: boolean }> = ({ className = "w-16 h-16", hideText = false }) => (
  <div className={`flex flex-col items-center justify-center ${hideText ? '' : 'gap-2'}`}>
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#438e2a" />
          <stop offset="50%" stopColor="#ef921a" />
          <stop offset="100%" stopColor="#438e2a" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e3f2fd" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Sunburst Rays */}
      <g opacity="0.4">
        {Array.from({ length: 15 }).map((_, i) => (
          <line 
            key={i}
            x1="250" y1="280" 
            x2={250 + Math.cos((180 + i * 12.8) * Math.PI / 180) * 200} 
            y2={280 + Math.sin((180 + i * 12.8) * Math.PI / 180) * 200} 
            stroke="#90caf9" 
            strokeWidth="2" 
          />
        ))}
      </g>

      {/* Outer Arch */}
      <path 
        d="M110 300 A140 140 0 0 1 390 300" 
        stroke="url(#archGrad)" 
        strokeWidth="24" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Jain Hand Symbol (Top) */}
      <g transform="translate(235, 145) scale(0.6)">
        <path d="M25 0 C35 0 45 10 45 25 V60 H5 V25 C5 10 15 0 25 0Z" fill="#ef921a" />
        <circle cx="25" cy="30" r="12" fill="white" />
        <path d="M20 30 L25 25 L30 30 L25 35 Z" fill="#ef921a" />
        <path d="M25 60 L25 75" stroke="#ef921a" strokeWidth="4" />
        {/* Palm fingers simplified */}
        <rect x="12" y="-10" width="6" height="15" rx="3" fill="#ef921a" />
        <rect x="22" y="-15" width="6" height="20" rx="3" fill="#ef921a" />
        <rect x="32" y="-10" width="6" height="15" rx="3" fill="#ef921a" />
      </g>

      {/* Green Foliage (Sides) */}
      <g fill="#438e2a" opacity="0.8">
        <path d="M100 280 Q120 240 140 280 T180 280" fill="#438e2a" />
        <path d="M320 280 Q360 240 380 280 T400 280" fill="#438e2a" />
        <circle cx="130" cy="250" r="15" />
        <circle cx="150" cy="265" r="12" />
        <circle cx="350" cy="250" r="15" />
        <circle cx="370" cy="265" r="12" />
      </g>

      {/* Base Platform */}
      <path d="M100 290 Q250 270 400 290" stroke="#ef921a" strokeWidth="4" fill="none" />

      {/* Walking Monks */}
      <g transform="translate(190, 150) scale(0.9)">
        {/* Monk 1 (Left) */}
        <g>
          {/* Head */}
          <circle cx="50" cy="115" r="12" fill="#fbd38d" />
          <path d="M42 110 Q50 105 58 110" stroke="#78350f" strokeWidth="1" fill="none" />
          {/* Body/Robe */}
          <path d="M38 127 C38 127 30 150 30 180 L70 180 C70 150 62 127 62 127 Z" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {/* Sash */}
          <path d="M38 127 L65 170" stroke="#ef921a" strokeWidth="10" opacity="0.9" />
          {/* Legs */}
          <path d="M45 180 V195 M55 180 V195" stroke="#fbd38d" strokeWidth="4" />
          {/* Staff */}
          <line x1="38" y1="140" x2="38" y2="200" stroke="#78350f" strokeWidth="3" />
        </g>
        
        {/* Monk 2 (Right) */}
        <g transform="translate(60, 0)">
          {/* Head */}
          <circle cx="50" cy="115" r="12" fill="#fbd38d" />
          <path d="M42 110 Q50 105 58 110" stroke="#78350f" strokeWidth="1" fill="none" />
          {/* Body/Robe */}
          <path d="M38 127 C38 127 30 150 30 180 L70 180 C70 150 62 127 62 127 Z" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {/* Sash */}
          <path d="M38 127 L65 170" stroke="#ef921a" strokeWidth="10" opacity="0.9" />
          {/* Legs */}
          <path d="M45 180 V195 M55 180 V195" stroke="#fbd38d" strokeWidth="4" />
          {/* Staff */}
          <line x1="68" y1="140" x2="68" y2="195" stroke="#78350f" strokeWidth="3" />
        </g>
      </g>
    </svg>
    
    {!hideText && (
      <div className="text-center flex flex-col items-center">
        <h2 className="text-[#ef921a] text-4xl font-black tracking-tight uppercase leading-none" style={{ fontFamily: 'Mukta, sans-serif' }}>
          Hum Chale
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 4 10 4 16C4 18.2 5.8 20 8 20C10.2 20 12 18.2 12 16V2Z" fill="#438e2a" />
          </svg>
          <h1 className="text-[#438e2a] text-6xl font-black tracking-tighter leading-none" style={{ fontFamily: 'Mukta, sans-serif' }}>
            Vihar
          </h1>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
             <path d="M12 2C12 2 4 10 4 16C4 18.2 5.8 20 8 20C10.2 20 12 18.2 12 16V2Z" fill="#438e2a" />
          </svg>
        </div>
      </div>
    )}
  </div>
);
