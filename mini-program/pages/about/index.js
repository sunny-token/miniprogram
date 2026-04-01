const storage = require('../../utils/storage.js');

Page({
  data: {
    appVersion: '1.0.0',
    theme: 'light',
    reminderEnabled: false
  },

  onShow() {
    const theme = getApp().globalData.theme || 'light';
    const reminderEnabled = storage.getReminderEnabled();
    this.setData({ theme, reminderEnabled });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        theme: theme
      });
    }
  },

  onReminderChange(e) {
    const enabled = e.detail.value;
    storage.setReminderEnabled(enabled);
    this.setData({ reminderEnabled: enabled });
    wx.showToast({ 
      title: enabled ? '提醒已开启' : '提醒已关闭', 
      icon: 'none' 
    });
  },

  toggleTheme() {
    const newTheme = this.data.theme === 'light' ? 'dark' : 'light';
    this.setData({ theme: newTheme });
    getApp().globalData.theme = newTheme;
    wx.setStorageSync('theme', newTheme);
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        theme: newTheme
      });
    }

    wx.showToast({ title: `已切换至${newTheme === 'dark' ? '深色' : '浅色'}模式`, icon: 'none' });
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私声明',
      content: '人生进度管理局（个人版）承诺：您的所有生日、预期寿命、倒计时标题及待办事项等数据，仅存储于您手机本地的微信缓存中。我们不收集、不上传、不处理任何您的个人隐私信息。您可以随时通过清理微信缓存来删除所有数据。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
