const storage = require('../../utils/storage.js');
const { formatDate } = require('../../utils/date.js');

// 统一配置：局长级别(15天+)壁纸矩阵及搜索关键词
const ELITE_WALLPAPER_CONFIG = {
  '极地雪原': {
    keywords: 'Snow, Glacier, Arctic',
    ids: ['1612450639537-d44bc045efc7', '1585488637863-37a048c18c75', '1662727247995-acda4940a8ae', '1618422433596-d66702cadce0', '1611572757951-6b8e7f068942']
  },
  '落日余晖': {
    keywords: 'Sunset, Glow, Twilight',
    ids: ['1512641406448-6574e777bec6', '1586348943529-beaae6c28db9', '1588001832198-c15cff59b078', '1414609245224-afa02bfb3fda', '1517685633466-403d6955aeab']
  },
  '治愈萌宠': {
    keywords: 'Cute, Pets, Cat, Dog',
    ids: ['1693932897536-c294c8a8ba0a', '1615233500064-caa995e2f9dd', '1533738363-b7f9aef128ce', '1543852786-1cf6624b9987', '1559932199-d6da2ce8fa4e']
  },
  '旷野星空': {
    keywords: 'Starry sky, Milky Way, Night',
    ids: ['1675826774817-c15cf80ece32', '1633946395810-9e6c68a61150', '1635833742576-c9c12bb2f991', '1525847185619-02460ddde30d', '1661962607720-d23f056f56e6']
  },
  '极简空间': {
    keywords: 'Minimalist, Architecture, White',
    ids: ['1604782206219-3b9576575203', '1615382514474-6fbb95ec0aaf', '1767221057242-dc2a4f633e5b', '1546349851-64285be8e9fa', '1527576539890-dfa815648363']
  },
  '幽蓝深海': {
    keywords: 'Deep sea, Underwater, Blue',
    ids: ['1505142468610-359e7d316be0', '1669687917290-5d7bcf244165', '1535643676813-925e1853beff', '1709570125779-c8d5fcce2a8a', '1665513986377-6c4ac72912ff']
  }
};

Page({
  data: {
    historyWallpapers: [],
    currentIndex: 0,
    streakDays: 0,
    fragmentCount: 0,
    isTodayLoaded: false,
    unlocked: {
      noWatermark: false,
      is4K: false
    }
  },

  onLoad() {
    this.initData();
    this.initHistoryWallpapers();
  },

  onShow() {
    this.initData();
  },

  initData() {
    const days = storage.getStreakDays();
    this.setData({
      streakDays: days,
      unlocked: {
        noWatermark: days >= 7,
        is4K: days >= 7
      }
    });
  },

  initHistoryWallpapers() {
    const today = storage.getTodayWallpaper();
    const fragmentCount = storage.getFragments();
    const collection = storage.getCollection();

    const todayStr = formatDate(new Date(), 'yyyy-MM-dd');
    let history = [];

    // Add today first
    if (today.url) {
      today.isUnlocked = true;
      history.push(today);
    }

    // Prepend collected items
    if (collection.length > 0) {
      history = [...collection, ...history];
    }

    // Sanitize all URLs (Self-healing from old structural errors)
    history = history.map(item => ({
      ...item,
      url: this._sanitizeUrl(item.url)
    }));

    // Stable Master Pool (1x50 curated Aesthetic IDs)
    const masterPool = [
      1015, 1016, 1018, 1019, 1021, 1022, 1024, 1025, 1032, 1033, 1035, 1036, 1037, 1038, 1039,
      1041, 1042, 1043, 1044, 1045, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056,
      1057, 1058, 1059, 1060, 1062, 1063, 1064, 1065, 1067, 1068, 1069, 1070, 1071, 1072, 1073,
      1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084
    ];

    const styleNames = ['日系胶片', '赛博朋克', '莫奈油画', '极简极光', '治愈手绘', '3D超写实', '水墨中国风'];

    for (let i = 1; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = formatDate(d, 'yyyy-MM-dd');
      const dayHash = parseInt(dStr.replace(/-/g, ''));
      const pid = masterPool[dayHash % masterPool.length];
      const styleName = styleNames[dayHash % styleNames.length];

      history.push({
        date: dStr,
        style: styleName,
        // Shielded URL
        url: `https://images.weserv.nl/?url=picsum.photos/id/${pid}/1080/1920&output=jpg&q=75`,
        isUnlocked: false
      });
    }

    this.setData({
      historyWallpapers: history,
      fragmentCount: fragmentCount,
      isTodayLoaded: true
    });
  },

  onSwiperChange(e) {
    this.setData({ currentIndex: e.detail.current });
  },

  onSave() {
    const index = this.data.currentIndex;
    const wp = this.data.historyWallpapers[index];
    wx.showLoading({ title: '保存中...' });
    wx.downloadFile({
      url: wp.url,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({ title: '已保存到相册', icon: 'success' });
            },
            fail: (err) => {
              wx.hideLoading();
              if (err.errMsg.indexOf('auth deny') >= 0) {
                wx.showModal({
                  title: '提示',
                  content: '请授权保存到相册',
                  success: (mRes) => { if (mRes.confirm) wx.openSetting(); }
                });
              }
            }
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  onShare() {
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
    wx.showToast({ title: '分享后可解锁额外壁纸', icon: 'none' });
  },

  // Code-level Self-healing (No local file dependency)
  onImageError(e) {
    const index = e.currentTarget.dataset.index;
    const history = this.data.historyWallpapers;
    console.error(`[系统自愈] 图片加载失败(索引:${index}, URL: ${history[index]?.url}), 已转由本地 Zen 兜底逻辑渲染。`);
    // More aesthetic base64 placeholder (Zen Charcoal Gradient Mock)
    const placeholder = 'https://images.weserv.nl/?url=picsum.photos/id/1015/1080/1920&output=jpg&q=40&blur=10';
    history[index].url = placeholder;
    this.setData({ historyWallpapers: history });
  },

  onBlindBox() {
    const days = parseInt(this.data.streakDays || storage.getStreakDays());
    const today = formatDate(new Date(), 'yyyy-MM-dd');

    // 3天基础门槛
    if (days < 3) {
      wx.showModal({
        title: '坚持就是胜利',
        content: `您当前已累计 ${days} 天。坚持到 3 天即可开启初步盲盒奖励！`,
        showCancel: false,
        confirmText: '我知道了'
      });
      return;
    }

    // Level 30: Master Mode
    if (days >= 30) {
      wx.showModal({
        title: 'Master 局长指令',
        placeholderText: '例如：极简落日、赛博城市',
        editable: true,
        success: (mRes) => {
          if (mRes.confirm && mRes.content) {
            wx.showLoading({ title: 'Master 正在理解指令...' });
            const pids = [10, 11, 15, 1015, 1016, 1033, 1044, 1047, 1048, 1050];
            const pid = pids[Math.floor(Math.random() * pids.length)];
            setTimeout(() => {
              this.applyGeneratedWallpaper({
                date: "Master-" + Date.now(),
                style: "Master: " + mRes.content,
                url: `https://images.weserv.nl/?url=picsum.photos/id/${pid}/1080/1920&output=jpg&q=80`,
                isUnlocked: true
              });
            }, 1000);
          }
        }
      });
      return;
    }

    // Level 15: Style Selection Matrix (Vetted & Shielded)
    if (days >= 15) {
      const styles = Object.keys(ELITE_WALLPAPER_CONFIG);

      /**
       * 更新说明：
       * 若需更换图片 ID 或关键词，请修改文件顶部的 ELITE_WALLPAPER_CONFIG 常量。
       * 1. 访问 Unsplash，按关键词搜索并筛选竖屏
       * 2. 提取 ID 填充至对应分类的 ids 数组
       */
      wx.showActionSheet({
        itemList: styles,
        success: (res) => {
          const idx = res.tapIndex;
          const styleName = styles[idx];
          const pool = ELITE_WALLPAPER_CONFIG[styleName].ids;
          const photoId = pool[Math.floor(Math.random() * pool.length)];

          wx.showLoading({ title: '局长大片派发中...' });
          setTimeout(() => {
            this.applyGeneratedWallpaper({
              date: "Elite-" + Date.now(),
              style: "局长特选: " + styleName,
              url: `https://images.weserv.nl/?url=images.unsplash.com/photo-${photoId}&w=1080&h=1920&fit=cover&output=webp&v=${Date.now()}`,
              isUnlocked: true
            });
          }, 800);
        }
      });
      return;
    }

    // 7-14天：随机图片和碎片二选一
    if (days >= 7) {
      wx.showActionSheet({
        itemList: ['抽取随机大片', '获取进度碎片'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this._handleRandomPhoto();
          } else if (res.tapIndex === 1) {
            this._handleFragmentLogic();
          }
        }
      });
      return;
    }

    // 3-6天：仅能抽取碎片
    wx.showActionSheet({
      itemList: ['抽取进度碎片', '规则说明'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this._handleFragmentLogic();
        } else {
          wx.showModal({
            title: '规则说明',
            content: '累计 3 天可获得碎片抽取权限（集齐 5 枚合成隐藏款）；坚持执勤 7 天可解锁每日随机壁纸直领。',
            showCancel: false
          });
        }
      }
    });
  },

  _handleRandomPhoto() {
    wx.showLoading({ title: '随机抽取中...' });
    const masterPool = [
      1015, 1016, 1018, 1019, 1021, 1022, 1024, 1025, 1032, 1033, 1035, 1036, 1037, 1038, 1039,
      1041, 1042, 1043, 1044, 1045, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056
    ];
    const pid = masterPool[Math.floor(Math.random() * masterPool.length)];

    setTimeout(() => {
      this.applyGeneratedWallpaper({
        date: "Random-" + Date.now(),
        style: "随机惊喜",
        url: `https://images.weserv.nl/?url=picsum.photos/id/${pid}/1080/1920&output=jpg`,
        isUnlocked: true
      });
    }, 1000);
  },

  _handleFragmentLogic() {
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    let count = storage.getFragments();
    count++;

    if (count >= 5) {
      storage.setFragments(0);
      wx.showModal({
        title: '进度达标！', content: '恭喜！集满 5/5，立刻抽取隐藏款大片！',
        success: (ok) => {
          if (ok.confirm) {
            wx.showLoading({ title: 'AI 抽取中...' });
            setTimeout(() => {
              const hiddenPool = { '暗金流梦': 1048, '赛博武侠': 1033, '极简山脊': 1042, '远端幻境': 1050, '冰湖碎梦': 1084 };
              const name = Object.keys(hiddenPool)[Math.floor(Math.random() * 5)];
              const hiddenWp = {
                date: "Hidden-" + Date.now(), style: name,
                url: `https://images.weserv.nl/?url=picsum.photos/id/${hiddenPool[name]}/1080/1920&output=jpg`,
                isUnlocked: true
              };
              const collection = storage.getCollection();
              collection.unshift(hiddenWp);
              storage.setCollection(collection);
              storage.setLastBlindBoxDate(today);

              const list = this.data.historyWallpapers;
              list.splice(0, 0, hiddenWp);
              this.setData({ historyWallpapers: list, currentIndex: 0, fragmentCount: 0 });
              wx.hideLoading();
              wx.showModal({ title: '抽中隐藏款！', content: `【${name}】已为您永久收藏。`, showCancel: false });
              wx.vibrateLong();
            }, 1500);
          }
        }
      });
    } else {
      storage.setFragments(count);
      storage.setLastBlindBoxDate(today);
      this.setData({ fragmentCount: count });
      wx.showToast({ title: `碎片进度 ${count}/5`, icon: 'success' });
      wx.vibrateShort();
    }
  },


  applyGeneratedWallpaper(wp) {
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const collection = storage.getCollection();
    collection.unshift(wp);
    storage.setCollection(collection);
    storage.setLastBlindBoxDate(today);

    const list = this.data.historyWallpapers;
    const sanitizedWp = { ...wp, url: this._sanitizeUrl(wp.url) };
    list.splice(0, 0, sanitizedWp);

    this.setData({
      historyWallpapers: list,
      currentIndex: 0
    });

    wx.hideLoading();
    wx.showToast({ title: '定制成功', icon: 'success' });
    wx.vibrateLong();
  },

  goBack() {
    wx.navigateBack();
  },

  _sanitizeUrl(url) {
    if (!url) return '';
    // If it's already proxied, skip
    if (url.indexOf('weserv.nl') > -1) return url;

    // If it's an Unsplash direct URL, wrap it
    if (url.indexOf('images.unsplash.com') > -1) {
      // Remove existing params to avoid nested encoding issues if any
      const base = url.split('?')[0];
      return `https://images.weserv.nl/?url=${encodeURIComponent(base)}&w=1080&h=1920&fit=cover&output=webp`;
    }

    // If it's a Picsum URL, also proxy it for better CN reliability
    if (url.indexOf('picsum.photos') > -1) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg`;
    }

    return url;
  }
});
