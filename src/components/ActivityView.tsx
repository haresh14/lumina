import React, { useState } from 'react';
import { Calendar, Filter, Download, X } from 'lucide-react';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { cn } from '../utils';

const activities = [
  { id: 1, date: '2026-02-24', mood: 'Great', energy: 5, sleep: 8, symptoms: ['None'] },
  { id: 2, date: '2026-02-23', mood: 'Good', energy: 4, sleep: 7.5, symptoms: ['Headache'] },
  { id: 3, date: '2026-02-22', mood: 'Okay', energy: 3, sleep: 6, symptoms: ['Fatigue'] },
  { id: 4, date: '2026-02-21', mood: 'Bad', energy: 2, sleep: 5.5, symptoms: ['Anxiety'] },
  { id: 5, date: '2026-02-20', mood: 'Good', energy: 4, sleep: 7, symptoms: ['None'] },
];

export const ActivityView: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredActivities = activities.filter((activity) => {
    if (!startDate && !endDate) return true;
    
    const activityDate = parseISO(activity.date);
    const start = startDate ? startOfDay(parseISO(startDate)) : new Date(0);
    const end = endDate ? endOfDay(parseISO(endDate)) : new Date(8640000000000000);

    return isWithinInterval(activityDate, { start, end });
  });

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-6 pb-32 space-y-8 max-w-lg mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">History</h2>
          <p className="text-stone-500">Your past logs</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-xl transition-all",
              showFilters || startDate || endDate ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600"
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showFilters && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Filter by Date</h3>
            {(startDate || endDate) && (
              <button 
                onClick={clearFilters}
                className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">From</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">To</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span className="text-sm font-bold text-stone-900">
                    {format(parseISO(activity.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  activity.mood === 'Great' ? "bg-blue-100 text-blue-600" :
                  activity.mood === 'Good' ? "bg-emerald-100 text-emerald-600" :
                  activity.mood === 'Okay' ? "bg-yellow-100 text-yellow-600" :
                  "bg-red-100 text-red-600"
                )}>
                  {activity.mood}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2 border-y border-stone-50">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Energy</p>
                  <p className="font-bold text-stone-900">{activity.energy}/5</p>
                </div>
                <div className="text-center border-x border-stone-50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Sleep</p>
                  <p className="font-bold text-stone-900">{activity.sleep}h</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Symptoms</p>
                  <p className="font-bold text-stone-900">{activity.symptoms.length}</p>
                </div>
              </div>

              {activity.symptoms[0] !== 'None' && (
                <div className="flex flex-wrap gap-2">
                  {activity.symptoms.map(s => (
                    <span key={s} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-200">
            <p className="text-stone-400 font-medium">No logs found for this period.</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-emerald-600 font-bold text-sm uppercase tracking-widest"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
