Component({
  data: {
    selected: 0,
    theme: 'light',
    color: "#94A3B8",
    selectedColor: "#43655A",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "人生",
        iconPath: "/images/tab_life.png",
        selectedIconPath: "/images/tab_life_active.png"
      },
      {
        pagePath: "/pages/countdown/index",
        text: "倒计时",
        iconPath: "/images/tab_time.png",
        selectedIconPath: "/images/tab_time_active.png"
      },
      {
        pagePath: "/pages/cycle/index",
        text: "年度",
        iconPath: "/images/tab_cycle.png",
        selectedIconPath: "/images/tab_cycle_active.png"
      },
      {
        pagePath: "/pages/about/index",
        text: "关于",
        iconPath: "/images/tab_about.png",
        selectedIconPath: "/images/tab_about_active.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        theme: getApp().globalData.theme
      })
    }
  }
})
