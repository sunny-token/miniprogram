import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LifeProgress } from './components/LifeProgress';
import { Countdowns } from './components/Countdowns';
import { Cycles } from './components/Cycles';
import { About } from './components/About';
import { ViewType } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('life');

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const getTitle = (view: ViewType) => {
    switch (view) {
      case 'life': return '人生总进度';
      case 'countdown': return '重要倒计时';
      case 'cycle': return '年度进度';
      case 'about': return '关于我们';
      default: return '人生进度管理局';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'life': return <LifeProgress />;
      case 'countdown': return <Countdowns />;
      case 'cycle': return <Cycles />;
      case 'about': return <About />;
      default: return <LifeProgress />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      title={getTitle(currentView)}
    >
      {renderView()}
      
      {/* Decorative Background Pattern */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-[-1]" 
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbPjxytAgwF_vZOZ1ZZQ9Ebq7-1Ao2O-5VlSeBuGBi0VInmxfgoepzmQ6HGOZz9dC_Hx67ZNLBw3FPBpoZm1IyigzWJFNaBOGANixUCMbWb9JP84B8Q0Ku1a4zhx2pXF5M5i3cOdXjvk8kaGb5aWYWzgskGAxueVyvNQvJNT779dqc9hnz2bCmRLKyYIBlmm8r61sVEXf6h0yzqEfxRFsPTHUKEdo7jp3OeiOD-maHc5uAG-t5NDqigUHZ4ub1su5_v4r7EMFuHrE')" 
        }}
      ></div>
    </Layout>
  );
}
