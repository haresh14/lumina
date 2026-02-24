import React from 'react';
import { Home, BarChart2, PlusCircle, User, Activity } from 'lucide-react';
import { cn } from '../utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'trends', icon: BarChart2, label: 'Trends' },
    { id: 'log', icon: PlusCircle, label: 'Log', primary: true },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-200 px-6 pb-8 pt-3 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            tab.primary ? "relative -top-6" : "",
            activeTab === tab.id ? "text-emerald-600" : "text-stone-400"
          )}
        >
          {tab.primary ? (
            <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20 text-white">
              <tab.icon className="w-7 h-7" />
            </div>
          ) : (
            <>
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};
