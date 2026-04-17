'use client';

import { useEffect, useRef } from 'react';

type LoadingProps = { exiting?: boolean; duration?: number };

export default function Loading({ exiting = false, duration = 3500 }: LoadingProps) {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.animationDuration = `${duration}ms`;
      fillRef.current.classList.add('animate');
    }
  }, [duration]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Top 2/3 - Loader Section */}
      <div className="flex-1 relative flex items-center justify-center loader-bg-gradient">
        <div className="vignette" />

        <div className={`relative z-20 text-center px-6 fade-in ${exiting ? 'fade-out' : ''}`}>
          {/* Leaf Icon */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-2xl animate-pulse-slow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-emerald-100">
              <path d="M12 2s4 3 4 7-4 9-4 9-4-5-4-9 4-7 4-7z" fill="currentColor" opacity="0.99" />
            </svg>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl font-light tracking-wide text-emerald-50 mb-1">Ayurved</h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-emerald-200/80 font-light tracking-widest uppercase">The Digital Apothecary</p>

          {/* Divider Line */}
          <div className="mt-8 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />

          {/* Progress Bar */}
          <div className="mt-10 w-72 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto">
            <div ref={fillRef} className="progress-fill h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '0%' }} />
          </div>

          {/* Loading Text */}
          <p className="mt-6 text-sm text-emerald-300 font-light tracking-wide">LOADING THE APOTHECARY...</p>
          <p className="mt-2 text-xs text-emerald-400/60">Establishing neural sync</p>

          {/* Animated Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="loader-dot w-2 h-2 rounded-full bg-emerald-500" style={{ animation: 'pulse 1.5s ease-in-out 0s infinite' }} />
            <div className="loader-dot w-2 h-2 rounded-full bg-emerald-500" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
            <div className="loader-dot w-2 h-2 rounded-full bg-emerald-500" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }} />
          </div>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-10 right-10">
          <div className="text-emerald-400/30 text-2xl animate-float-slow">✦</div>
        </div>
        <div className="absolute bottom-20 left-10">
          <div className="text-emerald-400/20 text-3xl animate-float-slow" style={{ animationDelay: '1s' }}>✦</div>
        </div>
      </div>
    </div>
  );
}
