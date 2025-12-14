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
      <div className="bg-gradient-to-r from-jain-500 to-jain-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
           <h2 className="text-3xl font-bold mb-2">Jai Jinendra, {user.name}!</h2>
           <p className="text-jain-100 mb-6 italic opacity-90 text-lg">"{quote}"</p>
        </div>
        <Sparkles className="absolute top-4 right-4 text-jain-300 w-24 h-24 opacity-20 animate-spin-slow" />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ongoing Vihars Widget */}
        <div 
          onClick={() => onChangeView('VIHAR')}
          className="bg-white rounded-2xl p-5 border border-jain-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
             <h3 className="text-lg font-bold text-jain-800 flex items-center">
               <MapPin className="w-5 h-5 mr-2 text-jain-500" />
               Ongoing Vihars
             </h3>
             <span className="bg-jain-100 text-jain-700 px-2 py-1 rounded-md text-xs font-bold">
               {ongoingVihars.length} Active
             </span>
          </div>
          
          {ongoingVihars.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {ongoingVihars.map(vihar => (
                <div key={vihar.id} className="border-l-4 border-jain-400 pl-3 py-1 hover:bg-gray-50 transition-colors">
                  <p className="font-semibold text-gray-800">{vihar.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="truncate">{vihar.from}</span>
                    <span>➝</span>
                    <span className="truncate">{vihar.to}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               No ongoing vihars
            </div>
          )}
        </div>

        {/* Active Polls Widget */}
        <div 
           onClick={() => onChangeView('POLL')}
           className="bg-white rounded-2xl p-5 border border-jain-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
             <h3 className="text-lg font-bold text-jain-800 flex items-center">
               <Activity className="w-5 h-5 mr-2 text-jain-500" />
               Community Polls
             </h3>
             <span className="bg-jain-100 text-jain-700 px-2 py-1 rounded-md text-xs font-bold">
               {activePolls.length} Active
             </span>
          </div>

          {activePolls.length > 0 ? (
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
               {activePolls.map(poll => (
                 <div key={poll.id} className="bg-jain-50 p-3 rounded-xl hover:bg-jain-100 transition-colors">
                   <p className="font-medium text-jain-900 mb-2">{poll.question}</p>
                   <div className="flex gap-2 text-xs text-gray-500">
                      <span>{poll.options.length} options</span>
                      <span>•</span>
                      <span>{poll.options.reduce((acc, curr) => acc + curr.votes, 0)} votes</span>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
             <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No active polls
             </div>
          )}
        </div>
      </div>
    </div>
  );
};