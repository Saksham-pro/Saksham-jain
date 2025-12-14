export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Vihar {
  id: string;
  title: string;
  description: string;
  from: string;
  to: string;
  startDate: string;
  status: 'planned' | 'ongoing' | 'completed';
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  userVoted?: string; // ID of the option user voted for (local storage tracking)
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'vihar' | 'poll' | 'info';
  timestamp: number;
  read: boolean;
}

export enum View {
  HOME = 'HOME',
  VIHAR = 'VIHAR',
  POLL = 'POLL',
  LOGIN = 'LOGIN'
}