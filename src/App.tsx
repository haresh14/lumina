import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthView } from './components/AuthView';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { LogView } from './components/LogView';
import { TrendsView } from './components/TrendsView';
import { ActivityView } from './components/ActivityView';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'log':
        return <LogView onComplete={() => setActiveTab('home')} />;
      case 'trends':
        return <TrendsView />;
      case 'activity':
        return <ActivityView />;
      case 'profile':
        return (
          <div className="p-8 max-w-lg mx-auto space-y-8">
            <header>
              <h2 className="text-2xl font-bold text-stone-900">Settings</h2>
              <p className="text-stone-500">Manage your Lumina account</p>
            </header>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-200 rounded-full overflow-hidden">
                  <img src="https://picsum.photos/seed/alex/200/200" alt="Avatar" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold text-lg text-stone-900">{user.email}</p>
                  <p className="text-sm text-stone-500">Member since Feb 2026</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-stone-100 space-y-4">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors font-medium text-stone-700">Account Preferences</button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors font-medium text-stone-700">Notification Settings</button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors font-medium text-stone-700">Export Data (CSV)</button>
              </div>
            </div>

            <button 
              onClick={() => signOut()}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold uppercase tracking-widest text-sm border border-red-100"
            >
              Sign Out
            </button>
          </div>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
