// pages/countdown/index.js
const storage = require('../../utils/storage.js');
const { differenceInDays, formatDate } = require('../../utils/date.js');

Page({
  data: {
    countdowns: [],
    sortedCountdowns: [],
    isModalOpen: false,
    newTitle: '',
    newDate: formatDate(new Date()),
    newCategory: 'life',
    newDesc: '',
    categories: [
      { id: 'life', name: '生活' },
      { id: 'finance', name: '资产' },
      { id: 'growth', name: '成长' },
      { id: 'travel', name: '旅行' },
      { id: 'other', name: '其他' }
    ],
    presets: [
      { title: '退休倒计时', category: 'life', desc: '愿你历尽千帆，归来仍是少年。' },
      { title: '房贷还清', category: 'finance', desc: '无债一身轻，迎接新生活。' },
      { title: '孩子成年', category: 'life', desc: '看你长大，是我最大的幸福。' },
      { title: '结婚纪念日', category: 'life', desc: '愿得一人心，白首不分离。' },
      { title: '旅行出发', category: 'travel', desc: '世界那么大，我想去看看。' }
    ],
    theme: 'light',
    timeCapsules: [],
    isCapsuleModalOpen: false,
    capsuleContent: '',
    capsuleOpenDate: formatDate(new Date(), 'yyyy-MM-dd')
  },

  onShow() {
    const theme = getApp().globalData.theme || 'light';
    this.setData({ theme });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        theme: theme
      });
    }

    this.refreshList();
    this.checkCapsules();
  },

  checkCapsules() {
    const list = storage.getTimeCapsules();
    const today = new Date().setHours(0,0,0,0);
    let updated = false;
    
    list.forEach(item => {
      if (!item.isOpen && new Date(item.openDate) <= today) {
        item.isOpen = true;
        updated = true;
      }
    });

    if (updated) {
      storage.setTimeCapsules(list);
    }
    this.setData({ timeCapsules: list });
  },

  openCapsuleModal() {
    this.setData({ isCapsuleModalOpen: true });
  },

  closeCapsuleModal() {
    this.setData({ isCapsuleModalOpen: false });
  },

  onCapsuleInput(e) {
    this.setData({ capsuleContent: e.detail.value });
  },

  onCapsuleDateChange(e) {
    this.setData({ capsuleOpenDate: e.detail.value });
  },

  submitCapsule() {
    const { capsuleContent, capsuleOpenDate } = this.data;
    if (!capsuleContent) return;

    const newList = storage.getTimeCapsules();
    newList.push({
      id: Date.now().toString(),
      content: capsuleContent,
      openDate: capsuleOpenDate,
      createdAt: formatDate(new Date()),
      isOpen: false
    });

    storage.setTimeCapsules(newList);
    this.setData({
      timeCapsules: newList,
      isCapsuleModalOpen: false,
      capsuleContent: ''
    });
    wx.showToast({ title: '埋下成功', icon: 'success' });
  },

  refreshList() {
    const list = storage.getCountdowns();
    const now = new Date();
    
    const processed = list.map(item => {
      const targetDate = new Date(item.targetDate);
      const days = differenceInDays(targetDate, now);
      return {
        ...item,
        days: Math.abs(days),
        isPast: days < 0
      };
    });

    const sorted = [...processed].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });

    this.setData({ countdowns: processed, sortedCountdowns: sorted });
  },

  openModal() {
    this.setData({ isModalOpen: true });
  },

  closeModal() {
    this.setData({ isModalOpen: false });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  setCategory(e) {
    this.setData({ newCategory: e.currentTarget.dataset.id });
  },

  selectPreset(e) {
    const preset = e.currentTarget.dataset.preset;
    this.setData({
      newTitle: preset.title,
      newCategory: preset.category,
      newDesc: preset.desc
    });
  },

  handleAdd() {
    const { newTitle, newDate, newCategory, newDesc } = this.data;
    if (!newTitle || !newDate) {
      wx.showToast({ title: '请填写标题和日期', icon: 'none' });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: newTitle,
      targetDate: newDate,
      description: newDesc,
      category: newCategory,
      isPinned: false
    };

    const updated = [...storage.getCountdowns(), newItem];
    storage.setCountdowns(updated);
    
    this.setData({
      newTitle: '',
      newDate: formatDate(new Date()),
      newCategory: 'life',
      newDesc: '',
      isModalOpen: false
    });
    this.refreshList();
  },

  handleTogglePin(e) {
    const id = e.currentTarget.dataset.id;
    const list = storage.getCountdowns();
    const updated = list.map(item => 
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    );
    storage.setCountdowns(updated);
    this.refreshList();
  },

  handleDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个倒计时吗？',
      success: (res) => {
        if (res.confirm) {
          const list = storage.getCountdowns();
          const updated = list.filter(item => item.id !== id);
          storage.setCountdowns(updated);
          this.refreshList();
        }
      }
    });
  }
});
