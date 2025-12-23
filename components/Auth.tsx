import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Logo } from './Logo';
import { KeyRound, User as UserIcon, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin' && pin !== 'JAIN') {
      alert("Invalid Admin PIN (Hint: JAIN)");
      return;
    }
    
    onLogin({
      id: Date.now().toString(),
      name: name || (role === 'admin' ? 'Admin' : 'Yatri'),
      role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jain-100 to-white flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative border border-gray-100">
          
          {/* Decorative Header */}
          <div className="bg-gradient-to-br from-viharGreen to-viharGreen/80 p-8 text-center text-white relative">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="flex justify-center mb-4 relative z-10 bg-white w-24 h-24 mx-auto rounded-full p-2 shadow-xl animate-scale-up">
                <Logo className="w-full h-full" hideText={true} />
             </div>
             <h1 className="text-3xl font-black mb-1 relative z-10 uppercase tracking-tighter">Hum Chale Vihar</h1>
             <div className="w-12 h-1 bg-viharOrange mx-auto rounded-full"></div>
          </div>

          <div className="p-8">
             <div className="flex bg-gray-50 rounded-2xl p-1 mb-8">
                <button 
                  onClick={() => setRole('user')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'user' ? 'bg-white text-viharGreen shadow-sm' : 'text-gray-400 hover:text-viharGreen'}`}
                >
                  Yatri (User)
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-white text-viharGreen shadow-sm' : 'text-gray-400 hover:text-viharGreen'}`}
                >
                  Admin
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Name</label>
                   <div className="relative">
                      <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                      <input 
                         type="text" 
                         className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white transition-all text-gray-800 font-medium"
                         placeholder={role === 'admin' ? "Admin Name" : "Your Name"}
                         value={name}
                         onChange={e => setName(e.target.value)}
                         required
                      />
                   </div>
                </div>

                {role === 'admin' && (
                   <div className="space-y-1 animate-slide-down">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Admin PIN</label>
                      <div className="relative">
                         <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                         <input 
                            type="password" 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white transition-all text-gray-800 font-medium"
                            placeholder="Hint: JAIN"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                         />
                      </div>
                   </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-viharGreen text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-viharGreen/20 hover:bg-viharGreen/90 transition-all active:scale-95 flex items-center justify-center mt-6 uppercase tracking-wider"
                >
                   <span>Enter Journey</span>
                   <ArrowRight className="w-5 h-5 ml-2" />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};