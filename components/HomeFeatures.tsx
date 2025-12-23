import React, { useEffect, useState } from 'react';
import { Vihar, Poll, User } from '../types';
import { generateJainQuote } from '../services/geminiService';
import { Sparkles, MapPin, Activity } from 'lucide-react';

interface HomeFeaturesProps {
  user: User;
  vihars: Vihar[];
  polls: Poll[];
  onChangeView: (view: any) => void;
}

export const HomeFeatures: React.FC<HomeFeaturesProps> = ({ user, vihars, polls, onChangeView }) => {
  const [quote, setQuote] = useState<string>("Loading daily wisdom...");
  const ongoingVihars = vihars.filter(v => v.status === 'ongoing');
  const activePolls = polls.filter(p => p.isActive);

  useEffect(() => {
    // Fetch quote only once on mount
    let isMounted = true;
    generateJainQuote().then(q => {
      if (isMounted) setQuote(q);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-viharGreen to-viharGreen/80 rounded-3xl p-6 text-white shadow-xl shadow-viharGreen/10 relative overflow-hidden">
        <div className="relative z-10">
           <h2 className="text-3xl font-black mb-1 tracking-tight">Jai Jinendra, {user.name}!</h2>
           <p className="text-jain-200 mb-6 italic opacity-90 text-lg leading-snug">"{quote}"</p>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Ahimsa</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Satya</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Anekantavada</span>
           </div>
        </div>
        <Sparkles className="absolute top-4 right-4 text-white w-24 h-24 opacity-10 animate-spin-slow" />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ongoing Vihars Widget */}
        <div 
          onClick={() => onChangeView('VIHAR')}
          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
             <h3 className="text-lg font-black text-gray-800 flex items-center tracking-tight">
               <MapPin className="w-5 h-5 mr-2 text-viharOrange" />
               Ongoing Vihars
             </h3>
             <span className="bg-viharOrange/10 text-viharOrange px-2.5 py-1 rounded-lg text-xs font-bold">
               {ongoingVihars.length} Active
             </span>
          </div>
          
          {ongoingVihars.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {ongoingVihars.map(vihar => (
                <div key={vihar.id} className="border-l-4 border-viharGreen pl-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <p className="font-bold text-gray-800">{vihar.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="truncate">{vihar.from}</span>
                    <span className="text-viharOrange">➝</span>
                    <span className="truncate">{vihar.to}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
               No ongoing vihars at the moment
            </div>
          )}
        </div>

        {/* Active Polls Widget */}
        <div 
           onClick={() => onChangeView('POLL')}
           className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
             <h3 className="text-lg font-black text-gray-800 flex items-center tracking-tight">
               <Activity className="w-5 h-5 mr-2 text-viharGreen" />
               Community Polls
             </h3>
             <span className="bg-viharGreen/10 text-viharGreen px-2.5 py-1 rounded-lg text-xs font-bold">
               {activePolls.length} Active
             </span>
          </div>

          {activePolls.length > 0 ? (
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
               {activePolls.map(poll => (
                 <div key={poll.id} className="bg-gray-50/50 p-4 rounded-2xl hover:bg-jain-100 transition-colors border border-gray-100">
                   <p className="font-bold text-gray-800 mb-2 leading-tight">{poll.question}</p>
                   <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{poll.options.length} options</span>
                      <span className="text-viharOrange">•</span>
                      <span>{poll.options.reduce((acc, curr) => acc + curr.votes, 0)} votes</span>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
             <div className="text-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                Check back later for polls
             </div>
          )}
        </div>
      </div>
    </div>
  );
};