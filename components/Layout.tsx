import React, { useState, useEffect } from 'react';
import { View, User, AppNotification } from '../types';
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
        ? 'text-jain-700 bg-jain-100 font-bold shadow-sm' 
        : 'text-jain-500 hover:text-jain-700 hover:bg-jain-50'
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

  // Auto-dismiss toast
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
    <div className="min-h-screen bg-gradient-to-br from-jain-50 to-orange-50 flex flex-col font-sans">
      
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
              {/* Icon / Avatar */}
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === 'vihar' ? 'bg-green-100 text-green-600' : 
                toast.type === 'poll' ? 'bg-blue-100 text-blue-600' : 
                'bg-jain-100 text-jain-600'
              }`}>
                {toast.type === 'vihar' && <Footprints className="w-5 h-5" />}
                {toast.type === 'poll' && <Vote className="w-5 h-5" />}
                {toast.type === 'info' && <Bell className="w-5 h-5" />}
              </div>
              
              {/* Content */}
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-jain-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onChangeView(View.HOME)}>
          <div className="w-10 h-10 bg-jain-600 rounded-full flex items-center justify-center text-white shadow-lg">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" fill="currentColor" className="opacity-20" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-jain-800 leading-none">Hum Chale Vihar</h1>
            <p className="text-xs text-jain-500 font-medium tracking-wider">COMMUNITY APP</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 md:space-x-4">
             {/* Notification Bell */}
             <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    requestPermission();
                  }}
                  className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-jain-100 text-jain-700' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                   <Bell className="w-6 h-6" />
                   {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                       {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                </button>

                {/* Notification Dropdown Panel */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-jain-100 overflow-hidden z-50 animate-scale-up origin-top-right">
                       <div className="bg-jain-50 px-4 py-3 border-b border-jain-100 flex justify-between items-center">
                          <h3 className="font-bold text-jain-800">Notifications</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={() => onMarkRead()}
                              className="text-xs text-jain-600 hover:text-jain-800 font-medium flex items-center"
                            >
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
                                    <h4 className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-jain-800'}`}>{n.title}</h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                      {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                 </div>
                                 <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">
                               No notifications yet.
                            </div>
                          )}
                       </div>
                       {'Notification' in window && Notification.permission === 'default' && (
                         <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button onClick={requestPermission} className="text-xs text-blue-600 font-semibold hover:underline">
                               Enable System Notifications
                            </button>
                         </div>
                       )}
                    </div>
                  </>
                )}
             </div>

             <div className="hidden md:flex flex-col items-end border-l border-gray-200 pl-4">
                <span className="text-sm font-semibold text-jain-900">{user.name}</span>
                <span className="text-xs text-jain-500 uppercase">{user.role}</span>
             </div>
             <button 
                onClick={onLogout}
                className="p-2 bg-jain-100 text-jain-700 rounded-full hover:bg-jain-200 transition-colors"
                title="Logout"
             >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6 relative">
        <div className="animate-float opacity-30 fixed top-1/4 left-10 -z-10 text-jain-200 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
               <circle cx="50" cy="50" r="40" />
           </svg>
        </div>
        {children}
      </main>

      {/* Mobile Nav */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-jain-200 px-4 py-2 pb-safe md:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex justify-around">
             <NavItem view={View.HOME} current={currentView} icon={Home} label="Home" onClick={onChangeView} />
             <NavItem view={View.VIHAR} current={currentView} icon={Footprints} label="Vihar" onClick={onChangeView} />
             <NavItem view={View.POLL} current={currentView} icon={Vote} label="Polls" onClick={onChangeView} />
           </div>
        </nav>
      )}

      {/* Desktop Nav */}
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