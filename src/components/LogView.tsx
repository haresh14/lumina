import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smile, Frown, Meh, Sun, Cloud, Moon, Zap, Battery, BatteryLow, Check } from 'lucide-react';
import { cn } from '../utils';
import { Mood } from '../types';

interface LogViewProps {
  onComplete: () => void;
}

export const LogView: React.FC<LogViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const moods: { value: Mood; icon: any; label: string; color: string }[] = [
    { value: 1, icon: Frown, label: 'Awful', color: 'text-red-500' },
    { value: 2, icon: Meh, label: 'Bad', color: 'text-orange-500' },
    { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-emerald-500' },
    { value: 5, icon: Sun, label: 'Great', color: 'text-blue-500' },
  ];

  const interventions = [
    'Medication', 'Exercise', 'Therapy', 'Meditation', 'Hydration', 'Healthy Meal', 'Socializing', 'Reading'
  ];

  const toggleIntervention = (item: string) => {
    setSelectedInterventions(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    // In a real app, save to Supabase here
    onComplete();
  };

  return (
    <div className="p-6 pb-32 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-stone-900">Daily Log</h2>
        <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Step {step}/5</span>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h3 className="text-xl font-medium text-stone-800">How are you feeling?</h3>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => { setMood(m.value); setStep(2); }}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all",
                  mood === m.value ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-400"
                )}
              >
                <m.icon className={cn("w-8 h-8", mood === m.value ? "text-white" : m.color)} />
                <span className="text-[10px] font-bold uppercase">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h3 className="text-xl font-medium text-stone-800">Energy & Sleep</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-stone-800">Energy Level</h3>
              <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">{energy}/5</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { v: 1, label: 'Exhausted', desc: 'Barely keeping eyes open', icon: BatteryLow, color: 'text-red-500', bg: 'bg-red-50' },
                { v: 2, label: 'Low', desc: 'Feeling sluggish and tired', icon: Battery, color: 'text-orange-500', bg: 'bg-orange-50' },
                { v: 3, label: 'Moderate', desc: 'Stable but not vibrant', icon: Battery, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { v: 4, label: 'High', desc: 'Productive and alert', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { v: 5, label: 'Peak', desc: 'Limitless energy and focus', icon: Sun, color: 'text-blue-500', bg: 'bg-blue-50' },
              ].map((item) => (
                <button
                  key={item.v}
                  onClick={() => setEnergy(item.v)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all border-2 text-left group",
                    energy === item.v 
                      ? "bg-stone-900 border-stone-900 shadow-lg shadow-stone-900/10" 
                      : "bg-white border-stone-100 hover:border-stone-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    energy === item.v ? "bg-white/10 text-white" : `${item.bg} ${item.color}`
                  )}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-bold transition-colors",
                      energy === item.v ? "text-white" : "text-stone-900"
                    )}>{item.label}</p>
                    <p className={cn(
                      "text-xs transition-colors",
                      energy === item.v ? "text-stone-400" : "text-stone-500"
                    )}>{item.desc}</p>
                  </div>
                  {energy === item.v && (
                    <motion.div 
                      layoutId="energy-check"
                      className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-stone-800">Sleep Duration</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-stone-900">{sleep}</span>
                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">hours</span>
              </div>
            </div>
            
            <div className="relative pt-4 pb-8">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
              <div className="flex justify-between mt-4 px-1">
                {[0, 4, 8, 12].map((val) => (
                  <span key={val} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{val}h</span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm"
          >
            Next
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h3 className="text-xl font-medium text-stone-800">Interventions</h3>
          <p className="text-stone-500 text-sm">What did you do today to support your health?</p>
          
          <div className="flex flex-wrap gap-2">
            {interventions.map((item) => (
              <button
                key={item}
                onClick={() => toggleIntervention(item)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  selectedInterventions.includes(item)
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/10"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm"
          >
            Next
          </button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h3 className="text-xl font-medium text-stone-800">Notes</h3>
          <p className="text-stone-500 text-sm">Any other observations or thoughts for today?</p>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? Any specific triggers or wins?"
            className="w-full h-40 p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none text-stone-700"
          />

          <button
            onClick={() => setStep(5)}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm"
          >
            Next
          </button>
        </motion.div>
      )}

      {step === 5 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <h3 className="text-xl font-medium text-stone-800">Quick Summary</h3>
          <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Mood</span>
              <span className="font-bold text-stone-900">{moods.find(m => m.value === mood)?.label}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Energy</span>
              <span className="font-bold text-stone-900">{energy}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Sleep</span>
              <span className="font-bold text-stone-900">{sleep}h</span>
            </div>
            {selectedInterventions.length > 0 && (
              <div className="pt-4 border-t border-stone-50">
                <span className="text-stone-500 block mb-2">Interventions</span>
                <div className="flex flex-wrap gap-1">
                  {selectedInterventions.map(i => (
                    <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {notes && (
              <div className="pt-4 border-t border-stone-50">
                <span className="text-stone-500 block mb-2">Notes</span>
                <p className="text-sm text-stone-700 italic line-clamp-3">"{notes}"</p>
              </div>
            )}
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Complete Log
          </button>
        </motion.div>
      )}
    </div>
  );
};
