import { Vihar, Poll, AppNotification } from '../types';

const KEYS = {
  VIHARS: 'hcv_vihars',
  POLLS: 'hcv_polls',
  USER_VOTES: 'hcv_user_votes',
  NOTIFICATIONS: 'hcv_notifications',
  INITIALIZED: 'hcv_app_initialized',
  DELETED_IDS: 'hcv_deleted_ids'
};

const DEFAULT_VIHARS: Vihar[] = [
  {
    id: 'default-vihar-1',
    title: 'Shikharji Yatra',
    description: 'A holy pilgrimage to the eternal tirth.',
    from: 'Madhuban',
    to: 'Parasnath Hill',
    startDate: '2023-11-25',
    status: 'ongoing',
    participants: []
  }
];

const DEFAULT_POLLS: Poll[] = [
  {
    id: 'default-poll-1',
    question: 'When should we schedule the next local Vihar?',
    isActive: true,
    options: [
      { id: 'opt1', text: 'Next Sunday Morning', votes: 12 },
      { id: 'opt2', text: 'Next Saturday Evening', votes: 8 }
    ]
  }
];

const getDeletedIds = (): string[] => {
  const data = localStorage.getItem(KEYS.DELETED_IDS);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const markAsPermanentlyDeleted = (id: string) => {
  const deleted = getDeletedIds();
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(KEYS.DELETED_IDS, JSON.stringify(deleted));
  }
};

const ensureInitialized = () => {
  const deletedIds = getDeletedIds();

  if (!localStorage.getItem(KEYS.INITIALIZED)) {
    if (localStorage.getItem(KEYS.VIHARS) === null) {
      const filteredVihars = DEFAULT_VIHARS.filter(v => !deletedIds.includes(v.id));
      localStorage.setItem(KEYS.VIHARS, JSON.stringify(filteredVihars));
    }
    if (localStorage.getItem(KEYS.POLLS) === null) {
      const filteredPolls = DEFAULT_POLLS.filter(p => !deletedIds.includes(p.id));
      localStorage.setItem(KEYS.POLLS, JSON.stringify(filteredPolls));
    }
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
};

export const getVihars = (): Vihar[] => {
  ensureInitialized();
  const deletedIds = getDeletedIds();
  const data = localStorage.getItem(KEYS.VIHARS);
  try {
    const vihars: Vihar[] = data ? JSON.parse(data) : [];
    // Always filter out anything in the global deleted IDs list
    return vihars.filter(v => !deletedIds.includes(v.id));
  } catch (error) {
    return [];
  }
};

export const saveVihars = (vihars: Vihar[]) => {
  try {
    localStorage.setItem(KEYS.VIHARS, JSON.stringify(vihars));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  } catch (error) {
    console.error("Failed to save vihars", error);
  }
};

export const joinVihar = (viharId: string, userId: string) => {
  const vihars = getVihars();
  const updated = vihars.map(v => {
    if (v.id === viharId) {
      const participants = v.participants || [];
      if (!participants.includes(userId)) {
        return { ...v, participants: [...participants, userId] };
      }
    }
    return v;
  });
  saveVihars(updated);
};

export const leaveVihar = (viharId: string, userId: string) => {
  const vihars = getVihars();
  const updated = vihars.map(v => {
    if (v.id === viharId) {
      const participants = v.participants || [];
      return { ...v, participants: participants.filter(id => id !== userId) };
    }
    return v;
  });
  saveVihars(updated);
};

export const getPolls = (): Poll[] => {
  ensureInitialized();
  const deletedIds = getDeletedIds();
  const data = localStorage.getItem(KEYS.POLLS);
  try {
    const polls: Poll[] = data ? JSON.parse(data) : [];
    return polls.filter(p => !deletedIds.includes(p.id));
  } catch (error) {
    return [];
  }
};

export const savePolls = (polls: Poll[]) => {
  try {
    localStorage.setItem(KEYS.POLLS, JSON.stringify(polls));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  } catch (error) {
    console.error("Failed to save polls", error);
  }
};

export const hasUserVoted = (pollId: string): boolean => {
  const data = localStorage.getItem(KEYS.USER_VOTES);
  if (!data) return false;
  try {
    const votes = JSON.parse(data);
    return !!votes[pollId];
  } catch {
    return false;
  }
};

export const recordUserVote = (pollId: string, optionId: string) => {
  try {
    const data = localStorage.getItem(KEYS.USER_VOTES);
    const votes = data ? JSON.parse(data) : {};
    votes[pollId] = optionId;
    localStorage.setItem(KEYS.USER_VOTES, JSON.stringify(votes));
  } catch (error) {
    console.error("Failed to record vote", error);
  }
};

export const getNotifications = (): AppNotification[] => {
  const data = localStorage.getItem(KEYS.NOTIFICATIONS);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications: AppNotification[]) => {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to save notifications", error);
  }
}