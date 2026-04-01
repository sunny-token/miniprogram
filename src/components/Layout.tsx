import React from 'react';
import { Hourglass, AlarmClock, RefreshCw, User, Plus, Settings, Menu } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, title }) => {
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 glass-nav border-b-[0.5px] border-tertiary-container/20 h-16 flex justify-between items-center px-5">
        <div className="flex items-center gap-4">
          <button className="text-primary active:scale-95 transition-transform">
            <Menu size={24} />
          </button>
          <h1 className="font-headline text-xl font-bold tracking-tight text-primary">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary active:scale-95 transition-transform">
            <Plus size={24} />
          </button>
          <button className="text-primary active:scale-95 transition-transform">
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 px-6 pt-8 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 rounded-t-2xl glass-nav shadow-[0_-12px_32px_-4px_rgba(67,101,90,0.08)] flex justify-around items-center px-6 pb-6 pt-3">
        <NavItem
          icon={<Hourglass size={24} />}
          label="人生进度"
          active={currentView === 'life'}
          onClick={() => onViewChange('life')}
        />
        <NavItem
          icon={<AlarmClock size={24} />}
          label="倒计时"
          active={currentView === 'countdown'}
          onClick={() => onViewChange('countdown')}
        />
        <NavItem
          icon={<RefreshCw size={24} />}
          label="周期"
          active={currentView === 'cycle'}
          onClick={() => onViewChange('cycle')}
        />
        <NavItem
          icon={<User size={24} />}
          label="关于"
          active={currentView === 'about'}
          onClick={() => onViewChange('about')}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300 px-4 py-1 rounded-xl",
        active 
          ? "bg-primary-container/20 text-primary scale-105" 
          : "text-on-surface-variant opacity-60 hover:opacity-100"
      )}
    >
      <div className={cn("mb-1", active && "fill-current")}>
        {icon}
      </div>
      <span className={cn("font-headline text-[10px] tracking-tighter", active && "font-bold")}>
        {label}
      </span>
    </button>
  );
};
