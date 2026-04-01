import React, { useState, useEffect } from 'react';
import { Calendar, Check, Plus, Flower, Package, Edit3, Trash2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { startOfYear, endOfYear, differenceInCalendarDays, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';
import { TaskItem } from '../types';
import { storage } from '../lib/storage';

export const Cycles: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('year');
  const [tasks, setTasks] = useState<TaskItem[]>(storage.getTasks());
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const now = new Date();
  
  // Year Progress
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);
  const totalDaysInYear = differenceInCalendarDays(yearEnd, yearStart) + 1;
  const daysPassedInYear = differenceInCalendarDays(now, yearStart) + 1;
  const yearProgress = Math.round((daysPassedInYear / totalDaysInYear) * 100);
  const daysRemainingInYear = totalDaysInYear - daysPassedInYear;

  // Month Progress
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const totalDaysInMonth = differenceInCalendarDays(monthEnd, monthStart) + 1;
  const daysPassedInMonth = differenceInCalendarDays(now, monthStart) + 1;
  const monthProgress = Math.round((daysPassedInMonth / totalDaysInMonth) * 100);
  const daysRemainingInMonth = totalDaysInMonth - daysPassedInMonth;

  // Day Progress
  const dayProgress = Math.round(((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400) * 100);
  const hoursRemainingInDay = 24 - now.getHours();

  const currentProgress = activeTab === 'year' ? yearProgress : activeTab === 'month' ? monthProgress : dayProgress;
  const currentLabel = activeTab === 'year' ? '今年' : activeTab === 'month' ? '本月' : '今日';
  
  const addTask = () => {
    if (tasks.length >= 3) {
      alert('今日待办已达上限（3条），请先完成或删除。');
      return;
    }
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const newList = [...tasks, newTask];
    setTasks(newList);
    storage.setTasks(newList);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    const newList = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(newList);
    storage.setTasks(newList);
  };

  const deleteTask = (id: string) => {
    const newList = tasks.filter(t => t.id !== id);
    setTasks(newList);
    storage.setTasks(newList);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* View Switcher */}
      <nav className="flex p-1 bg-surface-container rounded-xl">
        {(['year', 'month', 'day'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300",
              activeTab === tab 
                ? "bg-primary-container text-white shadow-sm" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {tab === 'year' ? '年度' : tab === 'month' ? '月度' : '今日'}
          </button>
        ))}
      </nav>

      {/* Progress Hero Section */}
      <section className="relative">
        <div className="flex items-center justify-between">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-surface-container"
              />
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * currentProgress) / 100}
                strokeLinecap="round"
                className="text-primary-container transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-headline text-5xl font-bold text-on-surface">{currentProgress}</span>
              <span className="text-lg font-semibold text-primary-container">%</span>
            </div>
          </div>
          <div className="flex-1 pl-8">
            <p className="font-label italic text-tertiary text-xs mb-2">"白驹过隙，不负韶华"</p>
            <h2 className="font-headline text-2xl font-bold text-primary leading-tight">
              {currentLabel}已过 <span className="text-primary-container">{currentProgress}%</span>
            </h2>
            <div className="mt-4 space-y-1">
              {activeTab === 'year' && (
                <>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Calendar size={14} />
                    <p className="text-sm font-medium">剩余 {Math.ceil(daysRemainingInYear / 7)} 周</p>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Calendar size={14} />
                    <p className="text-sm font-medium">剩余 {daysRemainingInYear} 天</p>
                  </div>
                </>
              )}
              {activeTab === 'month' && (
                <>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Calendar size={14} />
                    <p className="text-sm font-medium">剩余 {daysRemainingInMonth} 天</p>
                  </div>
                </>
              )}
              {activeTab === 'day' && (
                <>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Clock size={14} />
                    <p className="text-sm font-medium">剩余 {hoursRemainingInDay} 小时</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Today's Tasks Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            今日待办
            <span className="text-xs font-normal text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{tasks.length} / 3</span>
          </h3>
          {tasks.length < 3 && (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="添加待办..."
                className="bg-transparent border-b border-outline-variant text-sm px-2 py-1 focus:outline-none focus:border-primary-container"
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button 
                onClick={addTask}
                className="text-primary-container hover:opacity-80 active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "flex items-center p-4 rounded-xl transition-all border border-outline-variant/10",
                task.isCompleted ? "bg-white shadow-sm" : "bg-surface-container"
              )}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors",
                  task.isCompleted ? "border-primary-container bg-primary-container text-white" : "border-outline-variant"
                )}
              >
                {task.isCompleted && <Check size={14} />}
              </button>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  task.isCompleted ? "text-on-surface-variant line-through opacity-60" : "text-on-surface"
                )}>
                  {task.title}
                </p>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-outline-variant hover:text-error transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant/40 text-sm italic">
              今日暂无待办，点击上方添加。
            </div>
          )}
        </div>
      </section>

      {/* Decorative Ancient Illustration */}
      <section className="mt-12 opacity-40 grayscale pointer-events-none">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2BkXng6EbFMU6YAFlyTuKHd9Hcd5V0ZdleWLOnaEs_Jn0Et_MSIt5plhOwdL3H7AzZkiDskuUc-qyUejYHAkTRQGyDWliigloZEwmUPQEq5dnBzoPAyXfdWaRx7L_R6LU9dpbq1DAm4gwN62gXUOwQpDnGlKMfuMVmZJfUVyOrJBjlufoMSCQueM6GT7DybdjezQi_GPjW0O-5eh7pXIsOp--qcygAdV5JuR7yyVZCwBxjOps9b1HqKSAqtSseUBbH1aWuzRLn0o" 
          alt="Zen ink painting" 
          className="w-full h-32 object-cover rounded-2xl"
          referrerPolicy="no-referrer"
        />
      </section>
    </motion.div>
  );
};
