import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, Loader2, Bell, Moon, User } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils';

interface PreferencesViewProps {
  onBack: () => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [sleepGoal, setSleepGoal] = useState(8);
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: user.id, full_name: user.user_metadata?.full_name || '' }])
              .select()
              .single();
            
            if (createError) throw createError;
            if (newProfile) {
              setFullName(newProfile.full_name || '');
              setSleepGoal(newProfile.sleep_goal || 8);
              setNotifications(newProfile.notifications_enabled);
            }
          } else {
            throw error;
          }
        } else if (data) {
          setFullName(data.full_name || '');
          setSleepGoal(data.sleep_goal || 8);
          setNotifications(data.notifications_enabled);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          sleep_goal: sleepGoal,
          notifications_enabled: notifications,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-lg mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Account Preferences</h2>
          <p className="text-stone-500">Personalize your Lumina experience</p>
        </div>
      </header>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-400">
              <User className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Personal Info</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Full Name</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-50">
            <div className="flex items-center gap-2 text-stone-400">
              <Moon className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Health Goals</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-stone-700">Daily Sleep Goal</label>
                <span className="text-lg font-bold text-stone-900">{sleepGoal}h</span>
              </div>
              <input 
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between px-1">
                <span className="text-[10px] font-bold text-stone-400">4h</span>
                <span className="text-[10px] font-bold text-stone-400">12h</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-50">
            <div className="flex items-center gap-2 text-stone-400">
              <Bell className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Notifications</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-700">Daily Reminders</p>
                <p className="text-xs text-stone-500">Get a nudge to log your day</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  notifications ? "bg-emerald-500" : "bg-stone-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  notifications ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        {message && (
          <p className={cn(
            "text-center text-sm font-medium",
            message.type === 'success' ? "text-emerald-600" : "text-red-500"
          )}>
            {message.text}
          </p>
        )}

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
