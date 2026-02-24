import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Star, Moon, Zap } from 'lucide-react';

interface HomeViewProps {
  onStartEntry: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartEntry }) => {
  return (
    <div className="p-6 pb-32 space-y-8 max-w-lg mx-auto">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Hello, Alex</h1>
          <p className="text-stone-500">Tuesday, Feb 24</p>
        </div>
        <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src="https://picsum.photos/seed/alex/100/100" alt="Profile" referrerPolicy="no-referrer" />
        </div>
      </header>

      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready to log?</h2>
          <p className="text-emerald-100/80 mb-6">It takes less than 10 seconds to track your day.</p>
          <button 
            onClick={onStartEntry}
            className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2"
          >
            Start Entry
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Today's Stats</h3>
          <button className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Details</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">7.5h</p>
              <p className="text-xs text-stone-500 font-medium">Sleep</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">High</p>
              <p className="text-xs text-stone-500 font-medium">Energy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Recent Logs</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Feb {24 - i}</p>
                  <p className="text-xs text-stone-500">Mood: Great • Sleep: 8h</p>
                </div>
              </div>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
