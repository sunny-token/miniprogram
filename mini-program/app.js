// app.js
App({
  onLaunch() {
    const theme = wx.getStorageSync('theme') || 'light';
    this.globalData.theme = theme;
  },
  globalData: {
    theme: 'light'
  }
})
