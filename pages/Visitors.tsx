
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { sendSMS } from '../services/notificationService';
// Fix: Added Phone to the lucide-react imports
import { MessageSquare, UserPlus, MapPin, ClipboardList, Mail, MapPinned, Calendar, Trash2, Phone } from 'lucide-react';
import { Visitor } from '../types';

const Visitors: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    reason: '',
    email: '',
    origin: '',
    visit_date: new Date().toISOString().split('T')[0]
  });

  const fetchVisitors = async () => {
    const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false });
    if (data) setVisitors(data);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Je, una uhakika unataka kufuta taarifa za mgeni huyu?")) {
      const { error } = await supabase.from('visitors').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchVisitors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('visitors').insert([formData]);
      if (error) throw error;
      
      await sendSMS({
        to: formData.phone,
        message: `Habari ${formData.full_name}, asante kwa kututembelea leo tarehe ${new Date(formData.visit_date).toLocaleDateString()}. Tungependa kukuona tena jumapili ijayo. Ubarikiwe!`
      });

      setIsModalOpen(false);
      setFormData({ 
        full_name: '', 
        phone: '', 
        location: '', 
        reason: '', 
        email: '', 
        origin: '', 
        visit_date: new Date().toISOString().split('T')[0] 
      });
      fetchVisitors();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Wageni wa Kanisa</h2>
          <p className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest">Daftari la Wageni & Ufuatiliaji.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
        >
          <UserPlus size={18} /> Sajili Mgeni Mpya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visitors.map((v) => (
          <div key={v.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all flex flex-col justify-between">
            <button 
              onClick={() => handleDelete(v.id)} 
              className="absolute top-4 right-4 p-2 text-slate-200 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-lg">
                  {v.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{v.full_name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} /> Tarehe: {new Date(v.visit_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Phone size={14} className="text-blue-600" /> {v.phone}
                </p>
                {v.email && (
                  <p className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Mail size={14} className="text-blue-600" /> {v.email}
                  </p>
                )}
                <p className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPinned size={14} className="text-blue-600" /> Alikotoka: {v.origin || 'Bila Taarifa'}
                </p>
                <p className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin size={14} className="text-blue-600" /> Makazi: {v.location || 'Bila Eneo'}
                </p>
                {v.reason && (
                  <p className="flex items-start gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest p-2.5 leading-relaxed">
                    <ClipboardList size={14} className="text-blue-600 shrink-0" /> Sababu: {v.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase">
              <span className={`px-2 py-1 rounded ${v.follow_up_sent ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {v.follow_up_sent ? 'SMS Imeshatumwa' : 'Inasubiri Ufuatiliaji'}
              </span>
              <button className="text-blue-600 hover:text-blue-800">Fuatilia</button>
            </div>
          </div>
        ))}
        {visitors.length === 0 && <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-100 rounded-[2.5rem]">Hakuna wageni waliosajiliwa bado.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sajili Mgeni Mpya</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-black text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Jina Kamili</label>
                <input required type="text" placeholder="David John" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Namba ya Simu</label>
                  <input required type="tel" placeholder="07XXXXXXXX" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email (Optional)</label>
                  <input type="email" placeholder="name@mail.com" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alikotoka (Origin)</label>
                  <input required type="text" placeholder="Mfano: Kanisa la ABC" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.origin} onChange={e=>setFormData({...formData, origin: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Eneo la Makazi (Location)</label>
                  <input required type="text" placeholder="Mfano: Kimara" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tarehe ya Kutembelea</label>
                <input required type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.visit_date} onChange={e=>setFormData({...formData, visit_date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sababu ya Kutembelea / Maombi</label>
                <textarea rows={2} placeholder="Maelezo mafupi..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.reason} onChange={e=>setFormData({...formData, reason: e.target.value})} />
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px]">Ghairi</button>
                <button type="submit" disabled={loading} className="flex-1 py-5 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] shadow-xl">{loading ? 'Processing...' : 'Sajili & Tuma SMS'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visitors;
