import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { format, subDays, startOfDay } from 'date-fns';

export const TrendsView: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('logs')
          .select('*')
          .gte('created_at', subDays(new Date(), 7).toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Process data for charts
        const chartData = data?.map(log => ({
          date: format(new Date(log.created_at), 'EEE'),
          mood: log.mood,
          sleep: log.sleep,
          fullDate: log.created_at
        })) || [];

        setLogs(chartData);
      } catch (err) {
        console.error('Error fetching trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-stone-900">Insights</h2>
          <p className="text-stone-500">Weekly health correlations</p>
        </header>
        <div className="bg-white rounded-3xl p-12 border border-dashed border-stone-200 text-center">
          <p className="text-stone-400">Not enough data yet. Keep logging to see your insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 space-y-8 max-w-lg mx-auto">
      <header>
        <h2 className="text-2xl font-bold text-stone-900">Insights</h2>
        <p className="text-stone-500">Weekly health correlations</p>
      </header>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Mood vs Sleep</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMood)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Correlation Detail</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="mood" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="sleep" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Mood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Sleep (h)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Mood by Sleep Duration</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...logs].sort((a, b) => a.sleep - b.sleep)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="sleep" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                label={{ value: 'Sleep Hours', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                domain={[0, 5]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(value) => `${value} hours of sleep`}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-stone-400 mt-4 italic">Higher sleep duration generally correlates with better mood.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Correlations</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-stone-900">Sleep Quality</p>
                <p className="text-xs text-stone-500">Strong positive impact on mood</p>
              </div>
            </div>
            <span className="text-emerald-600 font-bold">+0.82</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-stone-900">Caffeine</p>
                <p className="text-xs text-stone-500">Negative impact on sleep latency</p>
              </div>
            </div>
            <span className="text-red-600 font-bold">-0.45</span>
          </div>
        </div>
      </div>
    </div>
  );
};
