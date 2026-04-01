export type ViewType = 'life' | 'countdown' | 'cycle' | 'about';
export type LifeMode = 'circle' | 'grid' | 'rings';

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string;
  description?: string;
  icon?: string;
  category: 'finance' | 'growth' | 'life' | 'travel' | 'other';
  isPinned?: boolean;
  progress?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string; // YYYY-MM-DD
}

export interface UserSettings {
  birthDate: string;
  lifeExpectancy: number;
  theme: 'light' | 'dark';
  lifeMode: LifeMode;
}
