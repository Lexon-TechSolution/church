
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Visitors from './pages/Visitors';
import Finance from './pages/Finance';
import Events from './pages/Events';
import Leadership from './pages/Leaders';
import Login from './pages/Login';
import PublicLanding from './pages/PublicLanding';
import Settings from './pages/Settings';
import { UserProfile, UserRole } from './types';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activePath, setActivePath] = useState('dashboard');
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          setView('app');
        } else {
          // If no profile exists, fallback to basic session
          setUser({ id: session.user.id, username: session.user.email || 'Admin', role: 'admin' });
          setView('app');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('landing');
    setActivePath('dashboard');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-6">
      <div className="relative">
         <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
         <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center">
        <p className="text-slate-900 font-black uppercase tracking-widest text-lg">GraceFlow</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">Inapakia Ofisi...</p>
      </div>
    </div>
  );

  if (view === 'landing') {
    return <PublicLanding onLoginClick={() => setView('login')} />;
  }

  if (view === 'login' && !user) {
    return (
      <div className="relative">
        <button 
          onClick={() => setView('landing')}
          className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xl hover:bg-white transition-all active:scale-95"
        >
          ← Nyumbani
        </button>
        <Login onLoginSuccess={(u) => { setUser(u); setView('app'); }} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activePath) {
      case 'dashboard': return <Dashboard userRole={user?.role || 'admin'} />;
      case 'members': return <Members />;
      case 'visitors': return <Visitors />;
      case 'finance': return <Finance />;
      case 'events': return <Events />;
      case 'leadership': return <Leadership />;
      case 'settings': return <Settings />;
      default: return <Dashboard userRole={user?.role || 'admin'} />;
    }
  };

  return (
    <Layout 
      userRole={user?.role || 'reception'} 
      activePath={activePath} 
      onNavigate={setActivePath} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
