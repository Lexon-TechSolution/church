
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { sendSMS } from '../services/notificationService';
import { UserPlus, Search, Phone, Mail, Trash2, MapPin, ChevronRight } from 'lucide-react';
import { Member } from '../types';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', tribe: '', location: '' });

  const fetchMembers = async () => {
    const { data } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (data) setMembers(data);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Je, una uhakika unataka kufuta muumini huyu?")) {
      await supabase.from('members').delete().eq('id', id);
      fetchMembers();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('members').insert([{ ...formData, join_date: new Date().toISOString() }]);
      setIsModalOpen(false);
      setFormData({ full_name: '', phone: '', email: '', tribe: '', location: '' });
      fetchMembers();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  const filteredMembers = members.filter(m => m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="Tafuta Muumini kwa jina..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><UserPlus size={18} /> Sajili Muumini</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all">
            <button onClick={() => handleDelete(m.id)} className="absolute top-4 right-4 p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">{m.full_name.charAt(0)}</div>
               <div>
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{m.full_name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.location || 'Location Not Set'}</p>
               </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100"><Phone size={14} className="text-blue-600" /> {m.phone}</div>
              {m.email && <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-2.5 rounded-xl border border-slate-100"><Mail size={14} className="text-blue-600" /> {m.email}</div>}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase">
              <span>Jiunga: {new Date(m.join_date).toLocaleDateString()}</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded">{m.tribe || 'Member'}</span>
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-100 rounded-[2.5rem]">Hakuna muumini aliyepatikana.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Sajili Muumini Mpya</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Jina Kamili</label>
                 <input required type="text" placeholder="David John" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Simu</label>
                   <input required type="tel" placeholder="07XXXXXXXX" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Location</label>
                   <input placeholder="Mfano: Kimara" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-xl shadow-xl mt-4 uppercase text-[10px] tracking-widest">{loading ? 'Processing...' : 'Kamilisha Usajili'}</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px]">Ghairi</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
