
import React, { useState, useEffect } from 'react';
import { supabase, isMock } from '../services/supabase';
import { sendSMS, sendWelcomeEmail } from '../services/notificationService';
import { UserPlus, BookOpen, CheckCircle, Calendar, MapPin, ArrowRight, Mail, Phone, Clock, Menu, X } from 'lucide-react';

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1544427928-c49cdfebf49c?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&q=80&w=1200",
];

interface PublicLandingProps {
  onLoginClick: () => void;
}

const PublicLanding: React.FC<PublicLandingProps> = ({ onLoginClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'member' | 'visitor'>('member');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [memberForm, setMemberForm] = useState({ 
    full_name: '', 
    phone: '', 
    email: '', 
    birth_date: new Date().toISOString().split('T')[0], 
    location: '', 
    group_name: 'Member' 
  });

  const [visitorForm, setVisitorForm] = useState({ 
    full_name: '', 
    phone: '', 
    origin: '', 
    email: '', 
    visit_date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isMock) {
        const { error } = await supabase.from('members').insert([{ ...memberForm, join_date: new Date().toISOString() }]);
        if (error) throw error;
      }
      await sendSMS({ to: memberForm.phone, message: `Bwana Yesu Asifiwe ${memberForm.full_name}! Usajili wako umekamilika tarehe ${new Date().toLocaleDateString()}. Karibu GraceFlow Church!` });
      setSuccess(true);
    } catch (err: any) { alert("Hitilafu: " + err.message); }
    finally { setLoading(false); }
  };

  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isMock) {
        const { error } = await supabase.from('visitors').insert([visitorForm]);
        if (error) throw error;
      }
      await sendSMS({ to: visitorForm.phone, message: `Karibu ${visitorForm.full_name}, asante kwa kututembelea GraceFlow leo. Tunakubariki!` });
      setSuccess(true);
    } catch (err: any) { alert("Hitilafu: " + err.message); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl max-w-md w-full animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><CheckCircle size={48} /></div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Imekamilika!</h2>
          <p className="text-slate-500 font-bold mb-8 leading-relaxed">Hongera! Taarifa zako zimepokelewa. SMS ya uthibitisho itatumwa hivi punde.</p>
          <button onClick={() => setSuccess(false)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">Rudi Nyumbani</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-x-hidden bg-white">
      <div className="absolute inset-0 z-0">
        {SLIDE_IMAGES.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[3000ms] ${idx === currentSlide ? 'opacity-30' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-white to-white"></div>
      </div>

      <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Grace<span className="text-blue-600">Flow</span></span>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Church ERP Systems</span>
        </div>
        <button onClick={onLoginClick} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Staff Login</button>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 max-w-7xl mx-auto w-full gap-12 lg:flex-row">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">Ungana Nasi <br /><span className="text-blue-600">Kiroho.</span></h1>
          <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">Jisajili kama muumini au mgeni ili uweze kutambulika na kupokea mwongozo wa huduma zetu moja kwa moja kwenye simu yako.</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100"><MapPin className="text-blue-600" size={18} /><span className="text-[10px] font-black uppercase">Dar es Salaam</span></div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100"><Clock className="text-blue-600" size={18} /><span className="text-[10px] font-black uppercase">02:00 Am Ibada</span></div>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-50 overflow-hidden">
            <div className="flex bg-slate-50 p-2">
              <button onClick={() => setActiveTab('member')} className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'member' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>Muumini</button>
              <button onClick={() => setActiveTab('visitor')} className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'visitor' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>Mgeni</button>
            </div>
            <div className="p-6 md:p-10">
              {activeTab === 'member' ? (
                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Jina Kamili</label>
                    <input required type="text" value={memberForm.full_name} onChange={e=>setMemberForm({...memberForm, full_name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="David John" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Simu</label>
                      <input required type="tel" value={memberForm.phone} onChange={e=>setMemberForm({...memberForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="07XXXXXXXX" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                      <input type="email" value={memberForm.email} onChange={e=>setMemberForm({...memberForm, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="name@mail.com" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Tarehe ya Kuzaliwa</label>
                    <input required type="date" value={memberForm.birth_date} onChange={e=>setMemberForm({...memberForm, birth_date: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl mt-2 uppercase text-[10px] tracking-widest">{loading ? 'Inasajili...' : 'Kamilisha Usajili'}</button>
                </form>
              ) : (
                <form onSubmit={handleVisitorSubmit} className="space-y-4">
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Jina la Mgeni</label>
                  <input required type="text" value={visitorForm.full_name} onChange={e=>setVisitorForm({...visitorForm, full_name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" /></div>
                  <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Simu</label>
                  <input required type="tel" value={visitorForm.phone} onChange={e=>setVisitorForm({...visitorForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" /></div>
                  <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl mt-2 uppercase text-[10px] tracking-widest">Rekodi Ugeni</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicLanding;
