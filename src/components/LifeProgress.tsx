import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Hourglass, Quote, Wallpaper, PlayCircle, Grid3X3, CircleDot, Target, X, Download, Share2 } from 'lucide-react';
import { differenceInDays, intervalToDuration, format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../lib/storage';
import { HEALING_QUOTES } from '../constants';
import { LifeMode } from '../types';
import { cn } from '../lib/utils';

export const LifeProgress: React.FC = () => {
  const [settings, setSettings] = useState(storage.getSettings());
  const [now, setNow] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * HEALING_QUOTES.length));
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birthday = new Date(settings.birthDate);
  const totalDays = settings.lifeExpectancy * 365.25;
  const livedDays = differenceInDays(now, birthday);
  const remainingDays = Math.max(0, totalDays - livedDays);
  const progress = Math.min(100, (livedDays / totalDays) * 100);

  const duration = intervalToDuration({
    start: now,
    end: new Date(birthday.getFullYear() + settings.lifeExpectancy, birthday.getMonth(), birthday.getDate())
  });

  const toggleMode = () => {
    const modes: LifeMode[] = ['circle', 'grid', 'rings'];
    const next = modes[(modes.indexOf(settings.lifeMode) + 1) % modes.length];
    const newSettings = { ...settings, lifeMode: next };
    setSettings(newSettings);
    storage.setSettings(newSettings);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % HEALING_QUOTES.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Input Area */}
      <section className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-between px-4 py-3 bg-primary-container/20 rounded-lg text-primary active:scale-95 transition-all">
          <div className="flex flex-col items-start">
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-headline">Birthday</span>
            <span className="font-medium">{settings.birthDate}</span>
          </div>
          <Calendar size={20} />
        </button>
        <button className="flex items-center justify-between px-4 py-3 bg-primary-container/20 rounded-lg text-primary active:scale-95 transition-all">
          <div className="flex flex-col items-start">
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-headline">Lifespan</span>
            <span className="font-medium">预期 {settings.lifeExpectancy} 岁</span>
          </div>
          <Hourglass size={20} />
        </button>
      </section>

      {/* Core Progress Display */}
      <section className="relative flex flex-col items-center py-4">
        <div className="absolute top-0 right-0 z-20">
          <button 
            onClick={toggleMode}
            className="p-2 bg-white rounded-full shadow-sm border border-outline-variant/10 text-primary active:scale-90 transition-transform"
          >
            {settings.lifeMode === 'circle' && <CircleDot size={20} />}
            {settings.lifeMode === 'grid' && <Grid3X3 size={20} />}
            {settings.lifeMode === 'rings' && <Target size={20} />}
          </button>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          {settings.lifeMode === 'circle' && (
            <svg className="absolute inset-0 w-full h-full circular-progress" viewBox="0 0 100 100">
              <circle className="text-outline-variant opacity-20" cx="50" cy="50" r="48" fill="transparent" stroke="currentColor" strokeWidth="2" />
              <circle className="text-primary-container" cx="50" cy="50" r="48" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="301.59" strokeDashoffset={301.59 * (1 - progress / 100)} strokeLinecap="round" />
            </svg>
          )}

          {settings.lifeMode === 'grid' && (
            <div className="grid grid-cols-10 gap-1 w-full h-full p-4">
              {Array.from({ length: 100 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "rounded-[1px] transition-colors duration-500",
                    i < progress ? "bg-primary-container" : "bg-surface-container"
                  )}
                />
              ))}
            </div>
          )}

          {settings.lifeMode === 'rings' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full border border-primary-container/20"
                  style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
                />
              ))}
              <div 
                className="bg-primary-container rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, height: `${progress}%`, opacity: 0.6 }}
              />
            </div>
          )}

          <div className="text-center z-10 bg-white/40 backdrop-blur-sm p-4 rounded-full">
            <p className="text-[10px] text-primary font-headline tracking-[0.2em] mb-1 uppercase">Completed</p>
            <h2 className="font-headline text-5xl font-bold text-primary mb-2">{progress.toFixed(1)}%</h2>
            <p className="text-xs text-on-surface-variant font-medium">人生已完成</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-on-surface font-medium text-lg">
            已度过 {livedDays.toLocaleString()} 天 / 剩余 {Math.floor(remainingDays).toLocaleString()} 天
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-surface-container rounded-full">
            <span className="text-primary"><Calendar size={14} /></span>
            <p className="text-sm text-on-surface-variant font-mono tracking-tight">
              剩余：{duration.years}年{duration.months}月{duration.days}天
            </p>
          </div>
        </div>
      </section>

      {/* Quote Area */}
      <section className="relative cursor-pointer" onClick={nextQuote}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={quoteIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-white p-8 rounded-xl shadow-[0_12px_32px_-4px_rgba(67,101,90,0.08)] relative overflow-hidden group border border-outline-variant/10"
          >
            <div className="absolute top-0 right-0 w-16 h-16 border-t-[0.5px] border-r-[0.5px] border-tertiary-container/30 rounded-tr-xl"></div>
            <div className="absolute bottom-4 right-4 text-primary/10">
              <Quote size={64} className="rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
            <p className="font-label italic text-lg text-on-surface leading-relaxed relative z-10">
              “{HEALING_QUOTES[quoteIndex]}”
            </p>
            <p className="mt-4 text-xs font-label text-tertiary tracking-widest">— 点击切换语录</p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Action Area */}
      <section className="flex flex-col items-center space-y-4">
        <button 
          onClick={() => setIsPosterOpen(true)}
          className="w-full h-[54px] bg-primary text-white rounded-lg font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          <Wallpaper size={20} />
          <span>生成进度海报</span>
        </button>
        <div className="flex items-center space-x-1.5 opacity-60">
          <PlayCircle size={16} />
          <span className="text-xs">看视频解锁无水印海报</span>
        </div>
      </section>

      {/* Poster Modal */}
      <AnimatePresence>
        {isPosterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Poster Content */}
              <div className="bg-surface-container p-10 flex flex-col items-center space-y-8 relative">
                <div className="absolute top-6 left-6 text-primary/10 pointer-events-none">
                  <Hourglass size={120} className="rotate-12" />
                </div>
                
                <div className="text-center z-10">
                  <h3 className="font-headline text-3xl font-extrabold text-primary tracking-tight">人生进度管理局</h3>
                  <p className="font-label italic text-primary text-xs mt-1">The Ethereal Bureau of Life</p>
                </div>

                <div className="w-48 h-48 rounded-full border-[10px] border-primary-container/20 flex items-center justify-center relative z-10">
                  <div className="text-center">
                    <span className="font-headline text-4xl font-bold text-primary">{progress.toFixed(1)}</span>
                    <span className="text-sm font-semibold text-primary-container">%</span>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-widest">Completed</p>
                  </div>
                </div>

                <div className="text-center space-y-4 z-10">
                  <p className="font-label italic text-on-surface leading-relaxed px-4">
                    “{HEALING_QUOTES[quoteIndex]}”
                  </p>
                  <div className="h-[0.5px] w-12 bg-primary/20 mx-auto"></div>
                  <p className="text-[10px] text-on-surface-variant font-body uppercase tracking-[0.2em]">
                    {format(now, 'yyyy.MM.dd')} · 留白
                  </p>
                </div>
              </div>

              {/* Poster Actions */}
              <div className="p-6 bg-white grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-surface-container rounded-xl text-on-surface font-bold text-sm active:scale-95 transition-all">
                  <Download size={18} />
                  保存图片
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <Share2 size={18} />
                  分享好友
                </button>
              </div>

              <button 
                onClick={() => setIsPosterOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
