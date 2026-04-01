const storage = require('../../utils/storage.js');
const config = require('../../utils/config.js');
const { formatDate } = require('../../utils/date.js');

Page({
  data: {
    activeTab: 'year',
    tasks: [],
    newTaskTitle: '',
    progress: 0,
    label: '今年',
    remaining: '',
    remainingLabel: '天',
    theme: 'light',
    adUnitId: config.AD_UNIT_IDS.BANNER
  },

  onShow() {
    const theme = getApp().globalData.theme || 'light';
    this.setData({ theme });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        theme: theme
      });
    }
    
    this.refreshView();
  },

  refreshView() {
    const now = new Date();
    const tasks = storage.getTasks();
    let progress = 0;
    let label = '';
    let remaining = 0;
    let remainingWeeks = 0;
    let remainingLabel = '';

    if (this.data.activeTab === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      const totalDays = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      const passedDays = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      progress = Math.round((passedDays / totalDays) * 100);
      label = '今年';
      remaining = totalDays - passedDays;
      remainingWeeks = Math.ceil(remaining / 7);
      remainingLabel = '天';
    } else if (this.data.activeTab === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const totalDays = endOfMonth.getDate();
      const passedDays = now.getDate();
      progress = Math.round((passedDays / totalDays) * 100);
      label = '本月';
      remaining = totalDays - passedDays;
      remainingWeeks = Math.ceil(remaining / 7);
      remainingLabel = '天';
    } else {
      const passedSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      progress = Math.round((passedSeconds / 86400) * 100);
      label = '今日';
      remaining = 24 - now.getHours();
      remainingLabel = '小时';
    }

    this.setData({ 
      tasks, 
      progress, 
      label, 
      remaining, 
      remainingWeeks,
      remainingLabel 
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab }, () => {
      this.refreshView();
    });
  },

  onInputChange(e) {
    this.setData({ newTaskTitle: e.detail.value });
  },

  addTask() {
    const { tasks, newTaskTitle } = this.data;
    if (tasks.filter(t => !t.isCompleted).length >= 3) {
      wx.showModal({
        title: '待办已满',
        content: '今日进行中的待办已达上限（3条），请先完成或删除现有待办。',
        showCancel: false
      });
      return;
    }
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      isCompleted: false,
      createdAt: formatDate(new Date())
    };

    const updated = [...tasks, newTask];
    storage.setTasks(updated);
    this.setData({ newTaskTitle: '' });
    this.refreshView();
  },

  toggleTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = storage.getTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    storage.setTasks(updated);
    this.refreshView();
  },

  deleteTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = storage.getTasks();
    const updated = tasks.filter(t => t.id !== id);
    storage.setTasks(updated);
    this.refreshView();
  }
});
