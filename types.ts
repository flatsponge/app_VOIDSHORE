
export interface OnboardingStepProps {
  onNext: () => void;
  isActive?: boolean;
}

export interface Bottle {
  id: string;
  content: string;
  author: string; // "Anonymous" or "Stranger"
  authorRank?: string; // New: The rank of the person who wrote it
  location: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  authorRank?: string;
  timestamp: Date;
  vote?: 'up' | 'down' | 'super' | null; // Track local user vote
}

export interface SentBottle {
  id: string;
  content: string;
  timestamp: Date;
  replies: Reply[];
  location: string; // The virtual location it was sent to
  hasUnreadReplies?: boolean;
}

export interface JournalEntry {
  id: string;
  lines: string[];
  date: Date;
}

export enum ScenarioType {
  FLY = 'Fly',
  DESIGN = 'Design',
  WRITE = 'Write',
  PODCAST = 'Podcast',
  RESEARCH = 'Research',
  CODE = 'Code',
  MEDITATE = 'Meditate',
  EXPLORE = 'Explore',
  WORK = 'Work',
  READ = 'Read',
  EXERCISE = 'Exercise',
  FOCUS = 'Focus',
  LEARN = 'Learn'
}

export interface MapStyle {
  id: string;
  name: string;
  image: string;
}

export interface UserLevel {
  xp: number;
  level: number;
  title: string;
  nextLevelXp: number;
}
