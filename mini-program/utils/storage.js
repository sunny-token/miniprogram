const config = require('./config.js');

const KEYS = {
  SETTINGS: 'life_progress_settings',
  COUNTDOWNS: 'life_progress_countdowns',
  TASKS: 'life_progress_tasks',
  DAILY_SIGN: 'life_progress_daily_sign',
  TIME_CAPSULES: 'life_progress_time_capsules',
  CHECK_INS: 'life_progress_check_ins',
  
  // New Wallpaper Spec Keys
  STREAK_DAYS: 'checkinContinuousDays',
  LAST_CHECKIN: 'lastCheckinDate',
  TODAY_WALLPAPER: 'todayWallpaper',
  WALLPAPER_UNLOCKED: 'wallpaperUnlocked',
  COLLECTION: 'wallpaperCollection',
  REMINDER_ENABLED: 'checkinReminderEnabled',
  FRAGMENTS: 'wallpaperFragments'
};

const DEFAULT_SETTINGS = {
  birthDate: config.DEFAULTS.BIRTH_DATE,
  lifeExpectancy: config.DEFAULTS.LIFE_EXPECTANCY,
  theme: 'light',
  lifeMode: 'circle'
};

const DEFAULT_COUNTDOWNS = [
  {
    id: '1',
    title: '法定退休日',
    targetDate: '2060-01-01',
    description: '愿你历尽千帆，归来仍是少年。',
    category: 'growth',
    isPinned: true
  }
];

module.exports = {
  getSettings() {
    return wx.getStorageSync(KEYS.SETTINGS) || DEFAULT_SETTINGS;
  },
  setSettings(settings) {
    wx.setStorageSync(KEYS.SETTINGS, settings);
  },
  getCountdowns() {
    return wx.getStorageSync(KEYS.COUNTDOWNS) || DEFAULT_COUNTDOWNS;
  },
  setCountdowns(countdowns) {
    wx.setStorageSync(KEYS.COUNTDOWNS, countdowns);
  },
  getTasks() {
    return wx.getStorageSync(KEYS.TASKS) || [];
  },
  setTasks(tasks) {
    wx.setStorageSync(KEYS.TASKS, tasks);
  },
  getDailySign() {
    return wx.getStorageSync(KEYS.DAILY_SIGN) || null;
  },
  setDailySign(sign) {
    wx.setStorageSync(KEYS.DAILY_SIGN, sign);
  },
  getTimeCapsules() {
    return wx.getStorageSync(KEYS.TIME_CAPSULES) || [];
  },
  setTimeCapsules(list) {
    wx.setStorageSync(KEYS.TIME_CAPSULES, list);
  },
  getCheckIns() {
    return wx.getStorageSync(KEYS.CHECK_INS) || { records: {}, streaks: {} };
  },
  setCheckIns(data) {
    wx.setStorageSync(KEYS.CHECK_INS, data);
  },
  getReminderEnabled() {
    const val = wx.getStorageSync(KEYS.REMINDER_ENABLED);
    return val === "" ? true : val; // Spec says default true
  },
  setReminderEnabled(enabled) {
    wx.setStorageSync(KEYS.REMINDER_ENABLED, enabled);
  },
  
  // Wallpaper Spec Methods
  getStreakDays() {
    return wx.getStorageSync(KEYS.STREAK_DAYS) || 0;
  },
  setStreakDays(days) {
    wx.setStorageSync(KEYS.STREAK_DAYS, days);
  },
  getLastCheckin() {
    return wx.getStorageSync(KEYS.LAST_CHECKIN) || "";
  },
  setLastCheckin(date) {
    wx.setStorageSync(KEYS.LAST_CHECKIN, date);
  },
  getTodayWallpaper() {
    return wx.getStorageSync(KEYS.TODAY_WALLPAPER) || {};
  },
  setTodayWallpaper(data) {
    wx.setStorageSync(KEYS.TODAY_WALLPAPER, data);
  },
  getWallpaperUnlocked() {
    return wx.getStorageSync(KEYS.WALLPAPER_UNLOCKED) || {
      noWatermark: false, 
      dynamicWallpaper: false, 
      adClosed: false,
      allHistory: false,
      customAI: false,
      advancedAI: false
    };
  },
  setWallpaperUnlocked(data) {
    wx.setStorageSync(KEYS.WALLPAPER_UNLOCKED, data);
  },
  getCollection() {
    return wx.getStorageSync(KEYS.COLLECTION) || [];
  },
  setCollection(list) {
    wx.setStorageSync(KEYS.COLLECTION, list);
  },
  getLastBlindBoxDate() {
    return wx.getStorageSync('last_blind_box_date') || '';
  },
  setLastBlindBoxDate(date) {
    wx.setStorageSync('last_blind_box_date', date);
  },
  getFragments() {
    return wx.getStorageSync(KEYS.FRAGMENTS) || 0;
  },
  setFragments(val) {
    wx.setStorageSync(KEYS.FRAGMENTS, val);
  }
};
