import React from 'react';
import { Logo } from './Logo';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
      <div className="relative animate-scale-up">
        {/* Soft bloom effect background */}
        <div className="absolute inset-0 bg-jain-500/20 blur-3xl rounded-full animate-pulse-soft"></div>
        
        <div className="relative z-10">
          <Logo className="w-64 h-64" hideText={false} />
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center animate-fade-in-up">
        <div className="flex gap-1 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-viharGreen animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-viharOrange animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-viharGreen animate-bounce [animation-delay:0.4s]"></div>
        </div>
        <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Spiritual Journey Awaits</p>
      </div>
    </div>
  );
};
