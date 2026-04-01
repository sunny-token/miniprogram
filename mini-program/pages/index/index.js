// pages/index/index.js
const storage = require('../../utils/storage.js');
const config = require('../../utils/config.js');
const { HEALING_QUOTES, RITUAL_DATA } = require('../../utils/constants.js');
const { differenceInDays, getRemainingDuration, formatDate } = require('../../utils/date.js');

Page({
  data: {
    settings: {},
    now: formatDate(new Date()),
    progress: 0,
    isPosterOpen: false,
    posterStyle: config.DEFAULTS.POSTER_STYLE, 
    isAdUnlocked: false,
    lifeMode: 'circle',
    theme: 'light',
    isSignedToday: false,
    dailySign: null,
    reminderEnabled: false,
    shouldShowRitual: false,
    ritualAnimate: false,
    ritualData: {},
    ritualQuote: '',
    // Wallpaper Spec Data
    streakDays: 0,
    todayWallpaper: {},
    unlocked: {},
    stats: {
      totalCountdowns: 0,
      totalCheckIns: 0,
      yearRemaining: 0
    }
  },

  onShow() {
    const theme = getApp().globalData.theme || 'light';
    const settings = storage.getSettings();
    
    // Check Daily Sign & Streak
    const lastSign = storage.getDailySign();
    const todayStr = formatDate(new Date(), 'yyyy-MM-dd');
    const isSignedToday = lastSign && lastSign.date === todayStr;

    // Streak Logic (Spec 2.1 & 2.3)
    let streakDays = storage.getStreakDays();
    const lastCheckinDate = storage.getLastCheckin();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday, 'yyyy-MM-dd');

    // If it's a new day and we didn't check in yesterday, reset streak to 0 (Spec 2.3)
    if (todayStr !== lastCheckinDate && yesterdayStr !== lastCheckinDate) {
      streakDays = 0;
      storage.setStreakDays(0);
    }
    
    // Update Unlock Status (New Compressed Ladder)
    const unlocked = {
      allHistory: streakDays >= 3,
      noWatermark: streakDays >= 7,
      adClosed: streakDays >= 7,
      customAI: streakDays >= 15,
      advancedAI: streakDays >= 30 
    };
    storage.setWallpaperUnlocked(unlocked);

    // Calculate Stats for Summary
    const countdowns = storage.getCountdowns();
    const checkInData = storage.getCheckIns();
    let totalCheckIns = 0;
    Object.values(checkInData.records).forEach(dayList => {
      totalCheckIns += dayList.length;
    });

    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const dayDiff = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));

    const reminderEnabled = storage.getReminderEnabled();
    const shouldShowRitual = !isSignedToday && reminderEnabled;

    if (shouldShowRitual && !this.data.shouldShowRitual) {
      const ritual = this.getRitualContent();
      this.setData({ 
        shouldShowRitual: true,
        ritualData: ritual.data,
        ritualQuote: ritual.quote
      });
      setTimeout(() => this.setData({ ritualAnimate: true }), 100);
    }

    this.setData({ 
      theme, 
      settings, 
      lifeMode: settings.lifeMode || 'circle',
      isSignedToday,
      dailySign: lastSign,
      reminderEnabled,
      streakDays,
      unlocked,
      todayWallpaper: storage.getTodayWallpaper(),
      stats: {
        totalCountdowns: countdowns.length,
        totalCheckIns,
        yearRemaining: dayDiff
      }
    });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        theme: theme
      });
    }

    this.refreshProgress();
    this.randomQuote();
    this.startTimer();
  },

  getRitualContent() {
    const hour = new Date().getHours();
    let slot = 'day';
    if (hour >= 6 && hour < 11) slot = 'morning';
    else if (hour >= 18 || hour < 4) slot = 'night';
    
    const data = RITUAL_DATA[slot];
    const quote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
    return { data, quote };
  },

  closeRitual() {
    this.setData({ ritualAnimate: false });
    setTimeout(() => this.setData({ shouldShowRitual: false }), 400);
  },

  scrollToSign() {
    wx.pageScrollTo({
      selector: '.interactive-section',
      duration: 500
    });
  },

  onHide() {
    this.stopTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.refreshProgress();
    }, 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  refreshProgress() {
    const settings = this.data.settings;
    if (!settings || !settings.birthDate) return;

    const now = new Date();
    const birthday = new Date(settings.birthDate);
    const totalDays = settings.lifeExpectancy * 365.25;
    const lived = differenceInDays(now, birthday);
    const remaining = Math.max(0, totalDays - lived);
    const progress = Math.min(100, (lived / totalDays) * 100);

    const targetDate = new Date(birthday.getFullYear() + settings.lifeExpectancy, birthday.getMonth(), birthday.getDate());
    
    // Calculate precise remaining time
    const diff = targetDate.getTime() - now.getTime();
    if (diff < 0) {
      this.setData({ 
        progress: 100, 
        livedDays: Math.floor(totalDays), 
        remainingDays: 0,
        remainingTime: { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
      });
      return;
    }

    const remainingTime = {
      years: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
      months: Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)),
      days: Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };

    // Optimization: avoid unnecessary setData
    if (this._lastSecond === remainingTime.seconds) {
        return; 
    }
    this._lastSecond = remainingTime.seconds;

    this.setData({
      now: formatDate(now, 'yyyy.MM.dd'),
      progress: parseFloat(progress.toFixed(1)),
      livedDays: lived,
      remainingDays: Math.floor(remaining),
      remainingTime
    });
  },

  randomQuote() {
    const index = Math.floor(Math.random() * HEALING_QUOTES.length);
    this.setData({ quote: HEALING_QUOTES[index] });
  },

  toggleMode() {
    const modes = ['circle', 'grid', 'rings'];
    let currentMode = this.data.lifeMode;
    const nextIdx = (modes.indexOf(currentMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    
    const settings = this.data.settings;
    settings.lifeMode = nextMode;
    storage.setSettings(settings);
    this.setData({ lifeMode: nextMode, settings });
  },

  openPoster() {
    this.setData({ isPosterOpen: true });
  },

  drawSign() {
    if (this.data.isSignedToday) return;

    // Haptic Feedback
    wx.vibrateShort({ type: 'medium' });

    const todayStr = formatDate(new Date(), 'yyyy-MM-dd');
    const index = Math.floor(Math.random() * HEALING_QUOTES.length);
    const sign = {
      date: todayStr,
      content: HEALING_QUOTES[index],
      id: index
    };
    
    // Streak Logic (Spec 2.1)
    let streak = storage.getStreakDays();
    const lastDate = storage.getLastCheckin();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday, 'yyyy-MM-dd');

    if (lastDate === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }
    
    // Curated AI Gallery: Fixed High-Quality IDs for stability & aesthetics
    const stylesMap = {
      '日系胶片': 10,       // Ocean, Serene
      '赛博朋克': 1016,     // Neon City
      '莫奈油画': 1045,     // Soft Floral
      '极简极光': 1015,     // Snowy Mountain
      '治愈手绘': 1084,     // Ocean/Healing
      '3D超写实': 1044,     // Minimalist Arch
      '水墨中国风': 1035    // Misty Forest
    };
    const styleNames = Object.keys(stylesMap);
    const styleName = styleNames[Math.floor(Math.random() * styleNames.length)];
    const picId = stylesMap[styleName];
    
    // Using ID instead of seed/keyword is fast & reliable in CN
    const wallpaper = {
      id: Date.now(),
      date: todayStr,
      style: styleName,
      url: `https://images.weserv.nl/?url=picsum.photos/id/${picId}/1080/1920&output=jpg`
    };

    storage.setDailySign(sign);
    storage.setStreakDays(streak);
    storage.setLastCheckin(todayStr);
    storage.setTodayWallpaper(wallpaper);

    // Update Unlock Status (New Compressed Ladder)
    const unlocked = {
      noWatermark: streak >= 7,   // Ad-free moved to 7 days
      adClosed: streak >= 7,
      allHistory: streak >= 3,    // History stays at 3 days
      customAI: streak >= 15,     // Simple AI moved to 15 days
      advancedAI: streak >= 30    // Advanced AI moved to 30 days
    };
    storage.setWallpaperUnlocked(unlocked);

    this.setData({ 
      dailySign: sign, 
      isSignedToday: true,
      shouldShowRitual: false,
      ritualAnimate: false,
      quote: sign.content,
      streakDays: streak,
      todayWallpaper: wallpaper,
      unlocked
    });
    
    wx.showToast({ title: '今日礼成', icon: 'success' });

    // Transition to wallpaper after brief pause (Spec 2.1)
    setTimeout(() => {
      this.goToWallpaper();
    }, 1500);
  },

  goToWallpaper() {
    wx.navigateTo({
      url: '/pages/wallpaper/index'
    });
  },

  // Developer Debug: Long press to cycle levels [1, 3, 7, 30]
  onDebugLevel() {
    const levels = [1, 3, 7, 15, 30];
    let current = storage.getStreakDays();
    let nextIndex = (levels.indexOf(current) + 1) % levels.length;
    let nextLevel = levels[nextIndex];
    
    // Simulate New Compressed Reward Progression
    storage.setStreakDays(nextLevel);
    storage.setLastBlindBoxDate(''); // Reset daily limit for easy testing
    const unlocked = {
      allHistory: nextLevel >= 3,
      noWatermark: nextLevel >= 7,
      adClosed: nextLevel >= 7,
      customAI: nextLevel >= 15,
      advancedAI: nextLevel >= 30
    };
    storage.setWallpaperUnlocked(unlocked);

    this.setData({ 
      streakDays: nextLevel,
      unlocked 
    });
    
    wx.vibrateShort();
    wx.showToast({
      title: `体验模式: ${nextLevel}天`,
      icon: 'none'
    });
  },

  openSummaryPoster() {
    this.setData({ 
      isPosterOpen: true,
      isSummaryPoster: true
    });
  },

  switchPosterStyle() {
    const styles = ['minimal', 'grey', 'green'];
    const current = this.data.posterStyle;
    const next = styles[(styles.indexOf(current) + 1) % styles.length];
    this.setData({ posterStyle: next });
  },

  closePoster() {
    this.setData({ 
      isPosterOpen: false,
      isSummaryPoster: false
    });
  },

  unlockNoWatermark() {
    // Ad Integration Placeholder
    if (wx.createRewardedVideoAd) {
      const adUnitId = config.AD_UNIT_IDS.REWARDED;
      
      if (!adUnitId) {
        // No ad configured, allow unlocking
        wx.showToast({ title: '已解锁!', icon: 'success' });
        this.setData({ isAdUnlocked: true });
        return;
      }

      wx.showLoading({ title: '加载视频中...' });
      // In real app, create reward ad instance here using adUnitId
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({ title: '解锁成功!', icon: 'success' });
        this.setData({ isAdUnlocked: true });
      }, 1500);
    }
  },

  savePoster() {
    if (!this.data.isAdUnlocked) {
      wx.showModal({
        title: '提示',
        content: '观看激励视频可解锁无水印高清海报',
        confirmText: '去解锁',
        success: (res) => {
          if (res.confirm) {
            this.unlockNoWatermark();
          }
        }
      });
      return;
    }
    wx.showToast({ title: '正在保存...', icon: 'loading' });
    // In real app, use Canvas to draw and wx.saveImageToPhotosAlbum
  },
  
  onBirthdayChange(e) {
    const settings = this.data.settings;
    settings.birthDate = e.detail.value;
    storage.setSettings(settings);
    this.setData({ settings });
    this.refreshProgress();
  },
  
  onLifespanChange(e) {
    const ranges = [60, 70, 80, 90, 100];
    const val = ranges[parseInt(e.detail.value)];
    const settings = this.data.settings;
    settings.lifeExpectancy = val;
    storage.setSettings(settings);
    this.setData({ settings });
    this.refreshProgress();
  }
});
