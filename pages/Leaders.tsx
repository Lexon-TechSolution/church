
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { User, Phone, Plus } from 'lucide-react';
import { Leader } from '../types';

const Leaders: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', phone: '' });

  const fetchLeaders = async () => {
    const { data } = await supabase.from('leaders').select('*');
    if (data) setLeaders(data);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('leaders').insert([formData]);
    setIsModalOpen(false);
    fetchLeaders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Leadership Council</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Add Leader
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map(leader => (
          <div key={leader.id} className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
              <User size={40} />
            </div>
            <h4 className="font-bold text-slate-900">{leader.name}</h4>
            <p className="text-blue-600 text-sm font-medium mb-3">{leader.title}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Phone size={12} /> {leader.phone}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold mb-4">New Leader Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Name" className="w-full p-2 border rounded-lg" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Title (e.g. Mchungaji, Mwenyekiti)" className="w-full p-2 border rounded-lg" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              <input required placeholder="Phone" className="w-full p-2 border rounded-lg" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 p-2 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaders;
