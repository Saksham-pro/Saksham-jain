import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeFeatures } from './components/HomeFeatures';
import { ViharFeatures } from './components/ViharFeatures';
import { PollFeatures } from './components/PollFeatures';
import { Auth } from './components/Auth';
import { User, Vihar, Poll, View, AppNotification } from './types';
import * as Storage from './services/storageService';

const App: React.FC = () => {
  // Initialize user from storage immediately to persist session
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hcv_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      localStorage.removeItem('hcv_user'); // Clean up invalid data
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<View>(() => {
    // If user is already logged in, start at HOME
    const saved = localStorage.getItem('hcv_user');
    return saved ? View.HOME : View.LOGIN;
  });
  
  // App Data State - Initialize lazily from storage to prevent race conditions
  const [vihars, setVihars] = useState<Vihar[]>(() => Storage.getVihars());
  const [polls, setPolls] = useState<Poll[]>(() => Storage.getPolls());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => Storage.getNotifications());
  
  const [toast, setToast] = useState<AppNotification | null>(null);

  // Helper to dispatch notifications
  const dispatchNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      Storage.saveNotifications(updated);
      return updated;
    });

    // Show In-App Toast
    setToast(newNotif);

    // Vibration for mobile feel (Haptic Feedback)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Trigger Browser System Notification (Real-time effect)
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico', // Fallback if no icon
          tag: 'hcv-notification'
        });
      } catch (e) {
        console.log("Notification API error", e);
      }
    }
  };

  const markRead = (id?: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        (id ? n.id === id : true) ? { ...n, read: true } : n
      );
      Storage.saveNotifications(updated);
      return updated;
    });
  };

  // Auth Handlers
  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('hcv_user', JSON.stringify(u));
    setCurrentView(View.HOME);
    
    // Request permission on login if convenient
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hcv_user');
    setCurrentView(View.LOGIN);
  };

  // Vihar Handlers
  const handleAddVihar = (v: Vihar) => {
    const updated = [v, ...vihars];
    setVihars(updated);
    Storage.saveVihars(updated); // Persist immediately
    dispatchNotification('New Vihar Planned', `Join the journey from ${v.from} to ${v.to}!`, 'vihar');
  };

  const handleUpdateVihar = (v: Vihar) => {
    const updated = vihars.map(item => item.id === v.id ? v : item);
    setVihars(updated);
    Storage.saveVihars(updated); // Persist immediately
    
    if (v.status === 'completed') {
      dispatchNotification('Vihar Completed', `The vihar to ${v.to} has successfully completed. Anumodana!`, 'vihar');
    } else {
      dispatchNotification('Vihar Updated', `${v.title} details have been updated.`, 'info');
    }
  };

  const handleDeleteVihar = (id: string) => {
    const updated = vihars.filter(item => item.id !== id);
    setVihars(updated);
    Storage.saveVihars(updated); // Persist immediately
    dispatchNotification('Vihar Removed', 'A vihar entry was removed.', 'info');
  };

  // Poll Handlers
  const handleAddPoll = (p: Poll) => {
    const updated = [p, ...polls];
    setPolls(updated);
    Storage.savePolls(updated); // Persist immediately
    dispatchNotification('New Poll', p.question, 'poll');
  };

  const handleUpdatePoll = (p: Poll) => {
    const updated = polls.map(item => item.id === p.id ? p : item);
    setPolls(updated);
    Storage.savePolls(updated); // Persist immediately
  };

  const handleDeletePoll = (id: string) => {
    const updated = polls.filter(item => item.id !== id);
    setPolls(updated);
    Storage.savePolls(updated); // Persist immediately
  };
  
  const handleVote = (pollId: string, optionId: string) => {
    const updated = polls.map(p => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
      };
    });
    setPolls(updated);
    Storage.savePolls(updated); // Persist immediately
  };

  if (!user || currentView === View.LOGIN) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      user={user} 
      onLogout={handleLogout}
      notifications={notifications}
      onMarkRead={markRead}
      toast={toast}
      onClearToast={() => setToast(null)}
    >
      {currentView === View.HOME && (
        <HomeFeatures 
          user={user} 
          vihars={vihars} 
          polls={polls} 
          onChangeView={setCurrentView}
        />
      )}
      {currentView === View.VIHAR && (
        <ViharFeatures 
          user={user} 
          vihars={vihars}
          onAdd={handleAddVihar}
          onUpdate={handleUpdateVihar}
          onDelete={handleDeleteVihar}
        />
      )}
      {currentView === View.POLL && (
        <PollFeatures 
          user={user} 
          polls={polls}
          onAdd={handleAddPoll}
          onUpdate={handleUpdatePoll}
          onDelete={handleDeletePoll}
          onVote={handleVote}
        />
      )}
    </Layout>
  );
};

export default App;