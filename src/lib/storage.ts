import { UserSettings, CountdownItem, TaskItem } from '../types';

const KEYS = {
  SETTINGS: 'life_bureau_settings',
  COUNTDOWNS: 'life_bureau_countdowns',
  TASKS: 'life_bureau_tasks',
};

const DEFAULT_SETTINGS: UserSettings = {
  birthDate: '1995-01-01',
  lifeExpectancy: 80,
  theme: 'light',
  lifeMode: 'circle',
};

export const storage = {
  getSettings: (): UserSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  setSettings: (settings: UserSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },
  getCountdowns: (): CountdownItem[] => {
    const data = localStorage.getItem(KEYS.COUNTDOWNS);
    return data ? JSON.parse(data) : [];
  },
  setCountdowns: (list: CountdownItem[]) => {
    localStorage.setItem(KEYS.COUNTDOWNS, JSON.stringify(list));
  },
  getTasks: (): TaskItem[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    const tasks: TaskItem[] = data ? JSON.parse(data) : [];
    const today = new Date().toISOString().split('T')[0];
    // Auto-clear logic for web (simulating 0:00 clear)
    return tasks.filter(t => t.createdAt === today);
  },
  setTasks: (list: TaskItem[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(list));
  }
};
