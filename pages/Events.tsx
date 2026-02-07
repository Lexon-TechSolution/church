
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';
import { Event } from '../types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'Service'
  });

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (data) setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('events').insert([formData]);
    if (!error) {
      setIsModalOpen(false);
      fetchEvents();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Events Calendar</h2>
          <p className="text-slate-500">Scheduled worships, meetings, and seminars</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-6 hover:shadow-lg transition-all">
            <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] h-fit">
              <span className="text-blue-600 font-bold text-2xl">{new Date(event.date).getDate()}</span>
              <span className="text-blue-500 text-xs font-semibold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${event.type === 'Meeting' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {event.type}
                </span>
                <button className="text-slate-400 hover:text-slate-600 text-xs">Edit</button>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> Main Sanctuary</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Event Title" className="w-full p-2 border rounded-lg" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full p-2 border rounded-lg" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
              <input required type="datetime-local" className="w-full p-2 border rounded-lg" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                <option value="Service">Service</option>
                <option value="Meeting">Meeting</option>
                <option value="Seminar">Seminar</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 p-2 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded-lg">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
