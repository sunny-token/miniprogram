import React, { useState, useEffect } from 'react';
import { Hourglass, Share2, Palette, ShieldCheck, MessageSquare, ChevronRight, ArrowLeft, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../lib/storage';
import { UserSettings } from '../types';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [copied, setCopied] = useState(false);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    storage.setSettings(newSettings);
    
    // In a real app, we'd apply the theme class to the document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const copyWechat = () => {
    navigator.clipboard.writeText('LifeBureau_Admin');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Logo/Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center p-1 border-2 border-primary-container/30">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg">
            <Hourglass size={40} className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">人生进度管理局</h2>
          <p className="font-label italic text-primary text-sm mt-1">The Ethereal Bureau of Life</p>
        </div>
      </section>

      {/* Introduction Card */}
      <section className="bg-surface-container rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW_elg7SAje94MDY2UkEWkprqZg5KVvjZYms6O6512JGpUrKWVKhP8PaILueE340-FIdSeGFp2jmBMoyPK-fZM9nblTlW8XshWb3D3ibf00Abp-ZYguaSErY1H7_wNbfAuhmfsFQsyyo9l-jzNaEiaVVf6-taI3jQUbWHfPzVcsTqIkzfHlNC8teCbYcY29dldfT_SBC3DhETQ3S-oJvoVumdh76lWTfcqSRwyMVTviiIhPsQWR-Geqtjr-lbbhlgCVuIbyunnvM8" 
            alt="" 
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10">
          <p className="text-on-surface leading-loose font-body text-sm tracking-wide">
            人生进度管理局——把日子过成看得见的温柔。我们相信，时间不应只是数字的流逝，而是一场优雅的修行。
          </p>
          <p className="text-on-surface leading-loose font-body text-sm mt-4 tracking-wide">
            在这里，每一个进度的百分比都是对生命的一次深呼吸。我们致力于为您提供一种静谧、留白、且充满古风禅意的生活管理体验。
          </p>
          <div className="mt-6 flex justify-end">
            <span className="font-label text-xs text-tertiary italic">— 局长致辞</span>
          </div>
        </div>
      </section>

      {/* Functional Settings & Links */}
      <section className="space-y-4">
        {/* Theme Switcher */}
        <div className="flex items-center justify-between p-5 bg-white rounded-xl group transition-all duration-300 border border-outline-variant/10">
          <div className="flex items-center space-x-3">
            <Palette size={20} className="text-primary" />
            <span className="font-medium text-on-surface">主题风格</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-colors duration-300 ${
              settings.theme === 'dark' ? 'bg-primary' : 'bg-primary-container/30'
            }`}
          >
            <motion.div 
              animate={{ x: settings.theme === 'dark' ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Privacy Policy */}
        <button className="w-full flex items-center justify-between p-5 bg-white rounded-xl group hover:bg-surface-container transition-all duration-300 border border-outline-variant/10">
          <div className="flex items-center space-x-3">
            <ShieldCheck size={20} className="text-primary" />
            <span className="font-medium text-on-surface">隐私声明</span>
          </div>
          <ChevronRight size={20} className="text-primary-container" />
        </button>

        {/* Contact Info */}
        <div className="p-6 bg-white rounded-xl space-y-4 border border-outline-variant/10">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-tertiary-container rounded-full"></div>
            <h3 className="font-bold text-on-surface text-base">联系我们</h3>
          </div>
          <div className="flex items-center justify-between group">
            <div className="flex flex-col items-start">
              <span className="text-xs text-on-surface-variant font-body">官方微信客服</span>
              <span className="text-primary font-semibold font-body">LifeBureau_Admin</span>
            </div>
            <button 
              onClick={copyWechat}
              className="px-4 py-2 bg-primary-container/10 text-primary-container rounded-lg text-xs font-bold active:scale-95 transition-transform border border-primary-container/20 flex items-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '已复制' : '复制微信号'}
            </button>
          </div>
        </div>
      </section>

      {/* Version Info */}
      <footer className="text-center pt-8">
        <div className="flex flex-col items-center space-y-1">
          <p className="text-xs text-on-surface-variant font-body tracking-widest">版本号：V1.0.0</p>
          <div className="w-8 h-[0.5px] bg-tertiary-container mt-2 opacity-50"></div>
          <p className="text-[10px] text-on-surface-variant/60 mt-4 font-body uppercase tracking-[0.2em]">Designed by The Zen Lab</p>
        </div>
      </footer>
    </motion.div>
  );
};
