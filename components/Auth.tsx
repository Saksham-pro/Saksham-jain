import React, { useState } from 'react';
import { User, UserRole } from '../types';
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
    // Simple mock authentication
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col relative">
          
          {/* Decorative Header */}
          <div className="bg-jain-600 p-8 text-center text-white relative">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <h1 className="text-3xl font-bold mb-2 relative z-10">Hum Chale Vihar</h1>
             <p className="text-jain-100 text-sm relative z-10">Jain Community App</p>
          </div>

          <div className="p-8">
             <div className="flex bg-jain-50 rounded-full p-1 mb-8">
                <button 
                  onClick={() => setRole('user')}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${role === 'user' ? 'bg-white text-jain-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Yatri (User)
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${role === 'admin' ? 'bg-white text-jain-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Admin
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-3">Name</label>
                   <div className="relative">
                      <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                         type="text" 
                         className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white transition-all"
                         placeholder={role === 'admin' ? "Admin Name" : "Your Name"}
                         value={name}
                         onChange={e => setName(e.target.value)}
                         required
                      />
                   </div>
                </div>

                {role === 'admin' && (
                   <div className="space-y-1 animate-slide-down">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-3">Admin PIN</label>
                      <div className="relative">
                         <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                         <input 
                            type="password" 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white transition-all"
                            placeholder="Hint: JAIN"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                         />
                      </div>
                   </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-jain-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-jain-700 transition-transform active:scale-95 flex items-center justify-center mt-6"
                >
                   <span>Enter App</span>
                   <ArrowRight className="w-5 h-5 ml-2" />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};