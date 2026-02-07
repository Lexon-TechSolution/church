
import React, { useEffect, useState } from 'react';
import { supabase, isMock } from '../services/supabase';
import { sendSMS } from '../services/notificationService';
import { 
  Users, UserCheck, Calendar, TrendingUp, TrendingDown, 
  Wallet, ShieldCheck, Home, CheckCircle, XCircle, Clock,
  FileText, Download, Send, MessageSquare, Trash2, ChevronRight
} from 'lucide-react';
import { UserRole, Transaction, Member } from '../types';

interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [stats, setStats] = useState({ members: 0, visitors: 0, income: 0, expenses: 0, events: 0, assets: 0 });
  const [pendingApprovals, setPendingApprovals] = useState<Transaction[]>([]);
  const [recentLedger, setRecentLedger] = useState<Transaction[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [bulkMessage, setBulkMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  const fetchDashboardData = async () => {
    const { count: mCount, data: mData } = await supabase.from('members').select('*', { count: 'exact' });
    const { count: vCount } = await supabase.from('visitors').select('*', { count: 'exact', head: true });
    const { data: assets } = await supabase.from('assets').select('value');
    const { data: trans } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    
    if (mData) setAllMembers(mData);

    let inc = 0; let exp = 0;
    if (trans) {
      trans.forEach(t => {
        if (t.type === 'income') inc += t.amount;
        else if (t.status !== 'rejected') exp += t.amount;
      });
      setRecentLedger(trans.slice(0, 5));
      setPendingApprovals(trans.filter(t => t.type === 'expense' && t.status === 'pending'));
    }
    
    let assetVal = 0;
    if (assets) assets.forEach(a => assetVal += (a.value || 0));

    setStats({ members: mCount || 0, visitors: vCount || 0, events: 0, income: inc, expenses: exp, assets: assetVal });
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('transactions').update({ status }).eq('id', id);
    fetchDashboardData();
  };

  const handleBulkSms = async () => {
    if (!bulkMessage) return;
    setSendingSms(true);
    let count = 0;
    for (const m of allMembers) {
      if (m.phone) {
        await sendSMS({ to: m.phone, message: bulkMessage });
        count++;
      }
    }
    alert(`SMS imetumwa kwa waumini ${count} kwa mafanikio!`);
    setBulkMessage('');
    setSendingSms(false);
  };

  const downloadReport = (type: 'mini' | 'weekly') => {
    const dataToExport = recentLedger;
    const csvContent = "data:text/csv;charset=utf-8,Date,Description,Category,Type,Amount,Status\n"
      + dataToExport.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount},${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (userRole === 'pastor') {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Ofisi ya Mtumishi</h2>
            <p className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest">Dashboard ya Usimamizi Mkuu.</p>
          </div>
          <div className="flex flex-wrap gap-2">
             <button onClick={() => downloadReport('mini')} className="flex-1 md:flex-none items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex justify-center"><FileText size={14} /> Mini Statement</button>
             <button onClick={() => downloadReport('weekly')} className="flex-1 md:flex-none items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex justify-center"><Download size={14} /> Weekly Finance</button>
          </div>
        </div>

        {/* Competitive Advantage: Bulk SMS Hub */}
        <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <MessageSquare size={24} className="text-blue-400" />
                 <h3 className="text-xl font-black uppercase tracking-tighter">Bulk SMS Hub</h3>
              </div>
              <p className="text-blue-200 text-xs font-bold max-w-md">Tuma matangazo ya ibada au dharura kwa waumini wote <b>{stats.members}</b> mara moja.</p>
              <div className="flex gap-2">
                <input 
                  value={bulkMessage}
                  onChange={e => setBulkMessage(e.target.value)}
                  placeholder="Andika ujumbe wa SMS hapa..." 
                  className="flex-1 bg-white/10 border-none outline-none px-4 py-3 rounded-xl font-bold text-sm text-white placeholder:text-white/30"
                />
                <button 
                  onClick={handleBulkSms}
                  disabled={sendingSms || !bulkMessage}
                  className="bg-white text-blue-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingSms ? '...' : <><Send size={14} /> Tuma</>}
                </button>
              </div>
           </div>
           <TrendingUp className="absolute right-[-30px] bottom-[-30px] text-white/5 scale-150" size={180} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <StatCard title="Waumini" value={stats.members} icon={<Users size={24} />} color="blue" label="Ukuaji wa Kanisa" />
          <StatCard title="Total Mapato" value={`TSh ${stats.income.toLocaleString()}`} icon={<TrendingUp size={24} />} color="emerald" label="Mizania Kuu" />
          <StatCard title="Asset Value" value={`TSh ${stats.assets.toLocaleString()}`} icon={<Home size={24} />} color="purple" label="Thamani ya Ofisi" />
        </div>

        {pendingApprovals.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 p-6 md:p-8 rounded-[2.5rem]">
            <h3 className="font-black text-amber-900 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2"><Clock size={16} /> Malipo Yanayosubiri Idhini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApprovals.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{req.description}</p>
                    <p className="text-lg font-black text-blue-600 mt-1">TSh {req.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproval(req.id, 'rejected')} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase">Kataa</button>
                    <button onClick={() => handleApproval(req.id, 'approved')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase">Idhinisha</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Office Finance Ledger</p>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter">TSh {(stats.income - stats.expenses).toLocaleString()}</h3>
          <div className="flex gap-4 mt-8">
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10"><p className="text-[8px] font-black text-slate-400 uppercase">Mapato</p><p className="text-sm font-black text-emerald-400">+{stats.income.toLocaleString()}</p></div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10"><p className="text-[8px] font-black text-slate-400 uppercase">Matumizi</p><p className="text-sm font-black text-rose-400">-{stats.expenses.toLocaleString()}</p></div>
          </div>
        </div>
        <Wallet className="absolute right-[-20px] bottom-[-20px] text-white/5" size={160} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center">
           <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Recent Activity</h3>
           <ChevronRight size={20} className="text-slate-300" />
        </div>
        <div className="p-4 space-y-3">
           {recentLedger.map(tx => (
             <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{tx.description}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.amount.toLocaleString()}</p>
                   <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white border border-slate-100 rounded mt-1 inline-block">{tx.status || 'Success'}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, label }: any) => {
  const colors: any = { blue: 'bg-blue-50 text-blue-600 border-blue-100', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100', purple: 'bg-purple-50 text-purple-600 border-purple-100' };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>{icon}</div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-xl font-black text-slate-900 tracking-tighter">{value}</h4>
      <p className="text-[8px] font-black text-slate-300 mt-4 uppercase tracking-widest pt-3 border-t border-slate-50">{label}</p>
    </div>
  );
};

export default Dashboard;
