import { Vihar, Poll, AppNotification } from '../types';

const KEYS = {
  VIHARS: 'hcv_vihars',
  POLLS: 'hcv_polls',
  USER_VOTES: 'hcv_user_votes', // Simple set of pollIds
  NOTIFICATIONS: 'hcv_notifications'
};

export const getVihars = (): Vihar[] => {
  const data = localStorage.getItem(KEYS.VIHARS);
  // Check specifically for null (key missing), not just falsy
  if (data === null) {
    const defaults: Vihar[] = [
      {
        id: '1',
        title: 'Shikharji Yatra',
        description: 'A holy pilgrimage to the eternal tirth.',
        from: 'Madhuban',
        to: 'Parasnath Hill',
        startDate: '2023-11-25',
        status: 'ongoing'
      }
    ];
    localStorage.setItem(KEYS.VIHARS, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse vihars data", error);
    return [];
  }
};

export const saveVihars = (vihars: Vihar[]) => {
  try {
    localStorage.setItem(KEYS.VIHARS, JSON.stringify(vihars));
  } catch (error) {
    console.error("Failed to save vihars", error);
  }
};

export const getPolls = (): Poll[] => {
  const data = localStorage.getItem(KEYS.POLLS);
  if (data === null) {
    const defaults: Poll[] = [
      {
        id: '1',
        question: 'When should we schedule the next local Vihar?',
        isActive: true,
        options: [
          { id: 'opt1', text: 'Next Sunday Morning', votes: 12 },
          { id: 'opt2', text: 'Next Saturday Evening', votes: 8 }
        ]
      }
    ];
    localStorage.setItem(KEYS.POLLS, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse polls data", error);
    return [];
  }
};

export const savePolls = (polls: Poll[]) => {
  try {
    localStorage.setItem(KEYS.POLLS, JSON.stringify(polls));
  } catch (error) {
    console.error("Failed to save polls", error);
  }
};

// Simulate user voting history locally
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

// Notification Storage
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
};