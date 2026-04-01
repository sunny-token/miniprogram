/**
 * 全局配置文件
 * 存放所有外部 ID、广告位 ID 及业务默认参数
 */

const CONFIG = {
  // 广告位 ID (请替换为你在小程序后台真实的广告位 ID)
  AD_UNIT_IDS: {
    BANNER: '',         // 首页/周期页 底部横幅广告
    REWARDED: '',       // 保存海报解锁无水印
    INTERSTITIAL: '',   // 页面切换插屏 (可选)
  },

  // 业务默认配置
  DEFAULTS: {
    BIRTH_DATE: '2000-01-01',
    LIFE_EXPECTANCY: 80,
    POSTER_STYLE: 'minimal', // minimal, grey, green
  },

  // UI 配置
  UI: {
    THEME: 'light',  // light, dark
    TAB_INDEX: 0,
  }
};

module.exports = CONFIG;
