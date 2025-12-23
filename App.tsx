import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeFeatures } from './components/HomeFeatures';
import { ViharFeatures } from './components/ViharFeatures';
import { PollFeatures } from './components/PollFeatures';
import { Auth } from './components/Auth';
import { SplashScreen } from './components/SplashScreen';
import { User, Vihar, Poll, View, AppNotification } from './types';
import * as Storage from './services/storageService';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

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
    const saved = localStorage.getItem('hcv_user');
    return saved ? View.HOME : View.LOGIN;
  });
  
  const [vihars, setVihars] = useState<Vihar[]>(() => Storage.getVihars());
  const [polls, setPolls] = useState<Poll[]>(() => Storage.getPolls());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => Storage.getNotifications());
  const [toast, setToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    // Show splash screen for 6 seconds as requested
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

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

    setToast(newNotif);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
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

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('hcv_user', JSON.stringify(u));
    setCurrentView(View.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hcv_user');
    setCurrentView(View.LOGIN);
  };

  const handleAddVihar = (v: Vihar) => {
    setVihars(prev => {
      const updated = [v, ...prev];
      Storage.saveVihars(updated);
      return updated;
    });
    dispatchNotification('New Vihar Planned', `Join the journey from ${v.from} to ${v.to}!`, 'vihar');
  };

  const handleUpdateVihar = (v: Vihar) => {
    setVihars(prev => {
      const updated = prev.map(item => item.id === v.id ? v : item);
      Storage.saveVihars(updated);
      return updated;
    });
  };

  const handleDeleteVihar = (id: string) => {
    Storage.markAsPermanentlyDeleted(id);
    setVihars(prev => {
      const updated = prev.filter(item => item.id !== id);
      Storage.saveVihars(updated);
      return updated;
    });
    dispatchNotification('Vihar Removed', 'A vihar entry was permanently removed.', 'info');
  };

  const handleAddPoll = (p: Poll) => {
    setPolls(prev => {
      const updated = [p, ...prev];
      Storage.savePolls(updated);
      return updated;
    });
    dispatchNotification('New Poll', p.question, 'poll');
  };

  const handleUpdatePoll = (p: Poll) => {
    setPolls(prev => {
      const updated = prev.map(item => item.id === p.id ? p : item);
      Storage.savePolls(updated);
      return updated;
    });
  };

  const handleDeletePoll = (id: string) => {
    Storage.markAsPermanentlyDeleted(id);
    setPolls(prev => {
      const updated = prev.filter(item => item.id !== id);
      Storage.savePolls(updated);
      return updated;
    });
    dispatchNotification('Poll Removed', 'A community poll was permanently deleted.', 'info');
  };
  
  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prev => {
      const updated = prev.map(p => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
        };
      });
      Storage.savePolls(updated);
      return updated;
    });
  };

  if (isAppLoading) {
    return <SplashScreen />;
  }

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