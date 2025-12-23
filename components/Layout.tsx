import React, { useState, useEffect } from 'react';
import { View, User, AppNotification } from '../types';
import { Logo } from './Logo';
import { Home, Footprints, Vote, LogOut, Bell, X, Check } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onChangeView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkRead: (id?: string) => void;
  toast: AppNotification | null;
  onClearToast: () => void;
}

const NavItem = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  view: View; 
  current: View; 
  icon: any; 
  label: string; 
  onClick: (v: View) => void;
}) => (
  <button
    onClick={() => onClick(view)}
    className={`flex flex-col items-center justify-center p-2 flex-1 md:flex-none md:px-6 md:flex-row md:space-x-2 rounded-xl transition-all duration-300 ${
      current === view 
        ? 'text-viharGreen bg-jain-100 font-bold shadow-sm' 
        : 'text-gray-400 hover:text-viharGreen hover:bg-gray-50'
    }`}
  >
    <Icon className="w-6 h-6 mb-1 md:mb-0" />
    <span className="text-xs md:text-base">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onChangeView, 
  user, 
  onLogout,
  notifications,
  onMarkRead,
  toast,
  onClearToast
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClearToast, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClearToast]);

  const requestPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="min-h-screen bg-jain-50 flex flex-col font-sans">
      
      {/* Mobile-Style Push Notification Toast */}
      {toast && (
        <div 
           className="fixed top-4 left-3 right-3 md:left-auto md:right-6 md:w-96 z-[100] animate-slide-in-top cursor-pointer"
           onClick={() => {
              onClearToast();
              if (toast.type === 'vihar') onChangeView(View.VIHAR);
              if (toast.type === 'poll') onChangeView(View.POLL);
           }}
        >
           <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border border-gray-100 flex gap-3 items-start ring-1 ring-black/5">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === 'vihar' ? 'bg-green-100 text-viharGreen' : 
                toast.type === 'poll' ? 'bg-orange-100 text-viharOrange' : 
                'bg-jain-100 text-jain-600'
              }`}>
                {toast.type === 'vihar' && <Footprints className="w-5 h-5" />}
                {toast.type === 'poll' && <Vote className="w-5 h-5" />}
                {toast.type === 'info' && <Bell className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                 <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{toast.title}</h4>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">now</span>
                 </div>
                 <p className="text-sm text-gray-600 leading-snug line-clamp-2">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-2 md:py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onChangeView(View.HOME)}>
          <div className="transition-transform group-hover:scale-105">
             <Logo className="w-10 h-10 md:w-12 md:h-12" hideText={true} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-viharGreen text-sm md:text-base font-black uppercase tracking-tighter">Hum Chale</span>
            <span className="text-viharOrange text-lg md:text-xl font-extrabold italic" style={{ marginTop: '-4px' }}>Vihar</span>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    requestPermission();
                  }}
                  className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-jain-100 text-viharGreen' : 'hover:bg-gray-100 text-gray-400'}`}
                >
                   <Bell className="w-6 h-6" />
                   {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 w-4 h-4 bg-viharOrange text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                       {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-jain-100 overflow-hidden z-50 animate-scale-up origin-top-right">
                       <div className="bg-jain-50 px-4 py-3 border-b border-jain-100 flex justify-between items-center">
                          <h3 className="font-bold text-viharGreen">Notifications</h3>
                          {unreadCount > 0 && (
                            <button onClick={() => onMarkRead()} className="text-xs text-viharOrange hover:text-viharGreen font-medium flex items-center">
                              <Check className="w-3 h-3 mr-1" /> Mark all read
                            </button>
                          )}
                       </div>
                       <div className="max-h-[60vh] overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => !n.read && onMarkRead(n.id)}
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${n.read ? 'opacity-60' : 'bg-orange-50/30'}`}
                              >
                                 <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-viharGreen'}`}>{n.title}</h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                      {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                 </div>
                                 <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No notifications yet.</div>
                          )}
                       </div>
                    </div>
                  </>
                )}
             </div>

             <div className="hidden md:flex flex-col items-end border-l border-gray-100 pl-4">
                <span className="text-sm font-bold text-viharGreen">{user.name}</span>
                <span className="text-[10px] text-viharOrange uppercase font-bold tracking-widest leading-none">{user.role}</span>
             </div>
             <button onClick={onLogout} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6 relative">
        {children}
      </main>

      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 pb-safe md:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex justify-around">
             <NavItem view={View.HOME} current={currentView} icon={Home} label="Home" onClick={onChangeView} />
             <NavItem view={View.VIHAR} current={currentView} icon={Footprints} label="Vihar" onClick={onChangeView} />
             <NavItem view={View.POLL} current={currentView} icon={Vote} label="Polls" onClick={onChangeView} />
           </div>
        </nav>
      )}

      {user && (
         <div className="hidden md:flex fixed left-8 top-28 flex-col space-y-4">
             <NavItem view={View.HOME} current={currentView} icon={Home} label="Home" onClick={onChangeView} />
             <NavItem view={View.VIHAR} current={currentView} icon={Footprints} label="Vihar" onClick={onChangeView} />
             <NavItem view={View.POLL} current={currentView} icon={Vote} label="Polls" onClick={onChangeView} />
         </div>
      )}
    </div>
  );
};