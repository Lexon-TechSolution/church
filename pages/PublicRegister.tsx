
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';

const PublicRegister: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    location: '',
    group_name: 'Member',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('members').insert([{
        ...formData,
        join_date: new Date().toISOString()
      }]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Usajili Umekamilika!</h2>
          <p className="text-slate-500 mb-8">Asante {formData.full_name} kwa kujiunga na familia yetu. Taarifa zako zimepokelewa.</p>
          <button onClick={onBack} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Rudi Nyumbani</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-blue-600 md:w-1/3 p-8 text-white flex flex-col justify-center">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={18} /> Rudi
          </button>
          <h2 className="text-3xl font-bold mb-4">Jiunge Nasi</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Jisajili leo ili uweze kutambulika rasmi katika kanisa letu na upokee taarifa za huduma na matukio.
          </p>
        </div>
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Jina Kamili</label>
                <input required type="text" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mfano: Juma Ramadhani" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Namba ya Simu</label>
                <input required type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0712XXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="name@email.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Makazi (Location)</label>
                <input required type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mfano: Kimara, Dar" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kikundi/Status</label>
                <select value={formData.group_name} onChange={e=>setFormData({...formData, group_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Member">Muumini</option>
                  <option value="Choir">Kwaya</option>
                  <option value="Youth">Vijana</option>
                  <option value="Women">Wanawake</option>
                  <option value="Elder">Wazee</option>
                </select>
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
              {loading ? 'Inatuma...' : <><UserPlus size={20} /> Kamilisha Usajili</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicRegister;
