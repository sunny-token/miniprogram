import React, { useState, useEffect } from 'react';
import { Pin, MoreHorizontal, Home, School, Plane, Heart, Plus, X, Trash2 } from 'lucide-react';
import { differenceInDays, format, startOfYear, endOfYear, differenceInCalendarDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { CountdownItem } from '../types';
import { storage } from '../lib/storage';

export const Countdowns: React.FC = () => {
  const [countdowns, setCountdowns] = useState<CountdownItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newCategory, setNewCategory] = useState<CountdownItem['category']>('life');
  const [newDesc, setNewDesc] = useState('');

  const now = new Date();

  useEffect(() => {
    setCountdowns(storage.getCountdowns());
  }, []);

  const handleAdd = () => {
    if (!newTitle || !newDate) return;

    const newItem: CountdownItem = {
      id: Date.now().toString(),
      title: newTitle,
      targetDate: newDate,
      description: newDesc,
      category: newCategory,
      isPinned: false,
    };

    const updated = [...countdowns, newItem];
    setCountdowns(updated);
    storage.setCountdowns(updated);
    
    // Reset form
    setNewTitle('');
    setNewDate(format(new Date(), 'yyyy-MM-dd'));
    setNewCategory('life');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = countdowns.filter(c => c.id !== id);
    setCountdowns(updated);
    storage.setCountdowns(updated);
  };

  const handleTogglePin = (id: string) => {
    const updated = countdowns.map(c => 
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    );
    setCountdowns(updated);
    storage.setCountdowns(updated);
  };

  // Sort: pinned first, then by date
  const sortedCountdowns = [...countdowns].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <header>
        <p className="font-label italic text-primary/60 text-sm mb-2">“逝者如斯夫，不舍昼夜。”</p>
        <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">时间行箧</h2>
        <div className="mt-1 h-[0.5px] w-12 bg-tertiary-container"></div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedCountdowns.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center">
            <p className="text-on-surface-variant font-label italic">暂无倒计时，点击右下角添加一个吧</p>
          </div>
        ) : (
          sortedCountdowns.map((item) => (
            <CountdownCard 
              key={item.id} 
              item={item} 
              now={now} 
              onDelete={() => handleDelete(item.id)}
              onTogglePin={() => handleTogglePin(item.id)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold text-primary">添加新倒计时</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-outline-variant hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">标题</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="例如：退休倒计时"
                    className="w-full bg-surface-container px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">目标日期</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-surface-container px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">分类</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['life', 'finance', 'growth', 'travel', 'other'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          newCategory === cat 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {cat === 'life' && '生活'}
                        {cat === 'finance' && '资产'}
                        {cat === 'growth' && '成长'}
                        {cat === 'travel' && '旅行'}
                        {cat === 'other' && '其他'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">寄语 (可选)</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="写下一句治愈的话..."
                    className="w-full bg-surface-container px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-body h-24 resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                开启记录
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CountdownCard: React.FC<{ 
  item: CountdownItem; 
  now: Date;
  onDelete: () => void;
  onTogglePin: () => void;
}> = ({ item, now, onDelete, onTogglePin }) => {
  const targetDate = new Date(item.targetDate);
  const daysRemaining = differenceInDays(targetDate, now);
  const isPast = daysRemaining < 0;
  
  if (item.isPinned) {
    return (
      <div className="md:col-span-2 bg-white rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors duration-300 border border-outline-variant/10 shadow-sm">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Plane size={120} className="rotate-12" />
        </div>
        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-semibold rounded-full tracking-widest uppercase">
              {isPast ? '时光印记' : '长途漫漫'}
            </span>
            <div className="flex gap-3">
              <button onClick={onTogglePin} className="text-primary">
                <Pin size={18} fill="currentColor" />
              </button>
              <button onClick={onDelete} className="text-outline-variant hover:text-error transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">{item.title}</h3>
          <p className="font-label text-sm text-on-surface-variant italic mb-8">{item.description}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`font-headline text-5xl font-extrabold ${isPast ? 'text-on-surface-variant' : 'text-primary'}`}>
            {Math.abs(daysRemaining).toLocaleString()}
          </span>
          <span className="font-body text-on-surface-variant font-medium tracking-wide uppercase text-xs">
            {isPast ? 'Days Ago' : 'Days Remaining'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col border border-outline-variant/10 hover:bg-surface-container transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-tertiary">
          {item.category === 'finance' && <Home size={16} />}
          {item.category === 'growth' && <School size={16} />}
          {item.category === 'travel' && <Plane size={16} />}
          {item.category === 'life' && <Heart size={16} />}
          <span className="text-[10px] font-bold tracking-widest uppercase">{item.category}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onTogglePin} className="text-outline-variant hover:text-primary transition-colors">
            <Pin size={16} />
          </button>
          <button onClick={onDelete} className="text-outline-variant hover:text-error transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <h3 className="font-headline text-xl font-bold text-on-surface mb-1">{item.title}</h3>
      <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-2">{item.description}</p>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span className={`font-headline text-3xl font-bold ${isPast ? 'text-on-surface-variant' : 'text-primary'}`}>
            {Math.abs(daysRemaining).toLocaleString()}
          </span>
          <span className="text-xs font-medium text-on-surface-variant">{isPast ? '天前' : '天'}</span>
        </div>
      </div>
    </div>
  );
};
