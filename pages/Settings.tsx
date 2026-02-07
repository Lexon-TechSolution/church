
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Shield, Key, User, Save, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [username, setUsername] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.auth.updateUser({ 
        data: { full_name: username } 
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Username imesasishwa kikamilifu.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Nenosiri jipya hailingani.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Nenosiri limebadilishwa kikamilifu.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-100">
          <Shield size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Usalama wa Ofisi</h2>
          <p className="text-sm text-slate-500 font-medium">Badilisha jina la mtumiaji au nenosiri hapa.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          <AlertCircle size={18} /> {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Username Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-800">Taarifa za Profaili</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jina la Onyesho (Username)</label>
              <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Weka jina jipya..." />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
              <Save size={18} /> {loading ? 'Inahifadhi...' : 'Sasisha Username'}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Key className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-800">Badilisha Nenosiri (Password)</h3>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nenosiri Jipya</label>
              <input required type="password" value={passwords.new} onChange={e=>setPasswords({...passwords, new: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thibitisha Nenosiri</label>
              <input required type="password" value={passwords.confirm} onChange={e=>setPasswords({...passwords, confirm: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="••••••••" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              <Key size={18} /> {loading ? 'Inabadilisha...' : 'Hifadhi Nenosiri Jipya'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
