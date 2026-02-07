
import React, { useState, useEffect } from 'react';
import { supabase, isMock } from '../services/supabase';
import { 
  Plus, Minus, Download, Wallet, Home, HandHeart, History,
  TrendingUp, TrendingDown, Clock, ShieldCheck, Trash2, Box, ChevronRight
} from 'lucide-react';
import { Transaction, Asset, Pledge } from '../types';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'assets' | 'pledges'>('ledger');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  
  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  
  const [txForm, setTxForm] = useState({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [assetForm, setAssetForm] = useState({ name: '', category: 'Equipment' as Asset['category'], value: '', condition: 'Good', purchased_date: new Date().toISOString().split('T')[0] });
  const [pledgeForm, setPledgeForm] = useState({ member_name: '', purpose: '', target_amount: '', due_date: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'ledger') {
      const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      if (data) setTransactions(data);
    } else if (activeTab === 'assets') {
      const { data } = await supabase.from('assets').select('*');
      if (data) setAssets(data);
    } else if (activeTab === 'pledges') {
      const { data } = await supabase.from('pledges').select('*');
      if (data) setPledges(data);
    }
  };

  const handleDeleteTx = async (id: string) => {
    if (confirm("Hakika unataka kufuta muamala huu?")) {
      await supabase.from('transactions').delete().eq('id', id);
      fetchData();
    }
  };

  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txForm.amount);
    const status = txType === 'expense' && amountNum > 500000 ? 'pending' : 'approved';
    await supabase.from('transactions').insert([{ type: txType, category: txForm.category, amount: amountNum, description: txForm.description, date: txForm.date, status: txType === 'income' ? 'approved' : status }]);
    setIsTxModalOpen(false);
    fetchData();
  };

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueNum = parseFloat(assetForm.value);
    await supabase.from('assets').insert([{ name: assetForm.name, category: assetForm.category, value: valueNum, condition: assetForm.condition, purchased_date: assetForm.purchased_date }]);
    setIsAssetModalOpen(false);
    fetchData();
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(pledgeForm.target_amount);
    try {
      await supabase.from('pledges').insert([{ 
        member_name: pledgeForm.member_name, 
        purpose: pledgeForm.purpose, 
        target_amount: targetNum, 
        paid_amount: 0, 
        due_date: pledgeForm.due_date, 
        status: 'pending' 
      }]);
      setIsPledgeModalOpen(false);
      setPledgeForm({ member_name: '', purpose: '', target_amount: '', due_date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status !== 'rejected').reduce((a, b) => a + b.amount, 0);
  const totalAssetValue = assets.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Mobile-Friendly Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 w-full overflow-x-auto gap-1">
        <button onClick={() => setActiveTab('ledger')} className={`flex-1 min-w-[120px] py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'ledger' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <History size={14} /> Ledger
        </button>
        <button onClick={() => setActiveTab('assets')} className={`flex-1 min-w-[120px] py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'assets' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <Box size={14} /> Assets
        </button>
        <button onClick={() => setActiveTab('pledges')} className={`flex-1 min-w-[120px] py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'pledges' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
          <HandHeart size={14} /> Ahadi
        </button>
      </div>

      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Mizania Salio</p>
                <h3 className="text-4xl font-black tracking-tighter">TSh {(totalIncome - totalExpense).toLocaleString()}</h3>
                <div className="flex gap-2 mt-8">
                  <button onClick={() => { setTxType('income'); setIsTxModalOpen(true); }} className="flex-1 bg-blue-600 py-4 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2">
                    <Plus size={16} /> Mapato
                  </button>
                  <button onClick={() => { setTxType('expense'); setIsTxModalOpen(true); }} className="flex-1 bg-white/10 border border-white/20 py-4 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2">
                    <Minus size={16} /> Malipo
                  </button>
                </div>
             </div>
             <Wallet className="absolute right-[-20px] bottom-[-20px] text-white/5" size={160} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-3xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase">Total Mapato</p><p className="text-lg font-black text-emerald-600 mt-1">+{totalIncome.toLocaleString()}</p></div>
             <div className="bg-white p-6 rounded-3xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase">Total Matumizi</p><p className="text-lg font-black text-rose-600 mt-1">-{totalExpense.toLocaleString()}</p></div>
          </div>

          <div className="space-y-3">
             {transactions.map(t => (
               <div key={t.id} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.description}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.amount.toLocaleString()}</p>
                     <button onClick={() => handleDeleteTx(t.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                 <h3 className="text-xl font-black uppercase text-slate-900">Asset Evaluation</h3>
                 <p className="text-slate-400 text-[10px] font-bold mt-1">Thamani ya Mali: TSh {totalAssetValue.toLocaleString()}</p>
              </div>
              <button onClick={() => setIsAssetModalOpen(true)} className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Plus size={16} /> Sajili Mali</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => (
                <div key={asset.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 relative group border-b-4 border-b-blue-600">
                   <button onClick={() => supabase.from('assets').delete().eq('id', asset.id).then(() => fetchData())} className="absolute top-4 right-4 text-slate-200 hover:text-red-500"><Trash2 size={16} /></button>
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Home size={20} /></div>
                   <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1">{asset.name}</h4>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hali: {asset.condition}</p>
                   <p className="text-xl font-black text-slate-900 mt-4">TSh {asset.value.toLocaleString()}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'pledges' && (
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-center md:text-left">
                 <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">Ahadi & Michango</h3>
                 <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Fuatilia michango na ahadi za ujenzi.</p>
              </div>
              {/* FIX: Kitufe cha kuweka ahadi ambacho hakikufanya kazi */}
              <button 
                onClick={() => setIsPledgeModalOpen(true)} 
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Plus size={18} /> Rekodi Ahadi Mpya
              </button>
           </div>
           <div className="space-y-3">
              {pledges.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group shadow-sm">
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.member_name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{p.purpose}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-blue-600">TSh {p.target_amount.toLocaleString()}</p>
                      <p className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-50 text-slate-400 rounded mt-1">{p.status}</p>
                   </div>
                   <button onClick={() => supabase.from('pledges').delete().eq('id', p.id).then(() => fetchData())} className="ml-4 text-slate-200 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
              {pledges.length === 0 && <div className="py-12 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic border-2 border-dashed border-slate-100 rounded-[2rem]">Hakuna ahadi bado.</div>}
           </div>
        </div>
      )}

      {/* MODALS SECTION - FIXED LOGIC */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Rekodi {txType === 'income' ? 'Mapato' : 'Malipo'}</h3>
            <form onSubmit={handleTxSubmit} className="space-y-4">
              <select required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={txForm.category} onChange={e=>setTxForm({...txForm, category: e.target.value})}>
                <option value="">Chagua Kundi...</option>
                <option value="Sadaka">Sadaka</option>
                <option value="Fungu la Kumi">Fungu la Kumi</option>
                <option value="Mishahara">Mishahara</option>
                <option value="Ujenzi">Ujenzi</option>
              </select>
              <input required type="number" placeholder="Kiasi (TSh)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-black text-lg text-blue-600" value={txForm.amount} onChange={e=>setTxForm({...txForm, amount: e.target.value})} />
              <input required type="text" placeholder="Maelezo..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={txForm.description} onChange={e=>setTxForm({...txForm, description: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setIsTxModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px]">Ghairi</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] shadow-xl">Hifadhi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLEDGE MODAL - FIXED */}
      {isPledgeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Rekodi Ahadi Mpya</h3>
            <form onSubmit={handlePledgeSubmit} className="space-y-4">
              <input required type="text" placeholder="Jina la Muumini" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={pledgeForm.member_name} onChange={e=>setPledgeForm({...pledgeForm, member_name: e.target.value})} />
              <input required type="text" placeholder="Kusudi la Ahadi (Mfano: Ujenzi)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={pledgeForm.purpose} onChange={e=>setPledgeForm({...pledgeForm, purpose: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Lengo (TSh)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-black text-blue-600" value={pledgeForm.target_amount} onChange={e=>setPledgeForm({...pledgeForm, target_amount: e.target.value})} />
                <input required type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={pledgeForm.due_date} onChange={e=>setPledgeForm({...pledgeForm, due_date: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setIsPledgeModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px]">Ghairi</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] shadow-xl">Hifadhi Ahadi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSET MODAL */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-8 border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Sajili Mali Mpya</h3>
            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <input required type="text" placeholder="Jina la Mali" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={assetForm.name} onChange={e=>setAssetForm({...assetForm, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={assetForm.category} onChange={e=>setAssetForm({...assetForm, category: e.target.value as any})}>
                  <option value="Land">Kiwanja</option>
                  <option value="Building">Jengo</option>
                  <option value="Equipment">Vifaa</option>
                </select>
                <input required type="number" placeholder="Thamani (TSh)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-black text-blue-600" value={assetForm.value} onChange={e=>setAssetForm({...assetForm, value: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setIsAssetModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px]">Ghairi</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] shadow-xl shadow-slate-200">Sajili</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
