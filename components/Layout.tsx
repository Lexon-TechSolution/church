
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Landmark,
  Heart
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'pastor', 'accountant', 'reception'], path: 'dashboard' },
  { label: 'Waumini', icon: <Users size={20} />, roles: ['admin', 'pastor', 'reception'], path: 'members' },
  { label: 'Wageni', icon: <UserPlus size={20} />, roles: ['admin', 'reception', 'pastor'], path: 'visitors' },
  { label: 'Fedha & Mali', icon: <DollarSign size={20} />, roles: ['admin', 'accountant'], path: 'finance' },
  { label: 'Ratiba/Events', icon: <Calendar size={20} />, roles: ['admin', 'pastor', 'reception'], path: 'events' },
  { label: 'Uongozi', icon: <UserCheck size={20} />, roles: ['admin', 'pastor'], path: 'leadership' },
  { label: 'Mipangilio', icon: <Settings size={20} />, roles: ['admin', 'pastor', 'accountant'], path: 'settings' },
];

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, activePath, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const officeName = userRole === 'pastor' ? "Ofisi ya Mtumishi" : userRole === 'accountant' ? "Ofisi ya Mhasibu" : "Admin Portal";
  const officeIcon = userRole === 'pastor' ? <Heart className="text-blue-600" size={24} /> : <Landmark className="text-blue-600" size={24} />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">{officeIcon}</div>
            <div className="flex flex-col">
              <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">GraceFlow</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ERP Systems</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Ofisi ya {userRole}</div>
          {sidebarItems.map((item) => {
            if (!item.roles.includes(userRole)) return null;
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { onNavigate(item.path); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}>{item.icon}</span>
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all"
          >
            <LogOut size={20} />
            <span>Toka Ofisini</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{officeName}</h2>
              <p className="text-[10px] font-bold text-slate-400 capitalize">{activePath} Panel</p>
            </div>
          </div>
          
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
            <ShieldCheck size={20} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
