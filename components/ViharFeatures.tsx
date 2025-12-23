import React, { useState } from 'react';
import { User, Vihar } from '../types';
import { enhanceViharDescription } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';
import { joinVihar, leaveVihar } from '../services/storageService';
import { Plus, Trash2, Edit2, MapPin, Calendar, Wand2, X, Check, Users, UserCheck, UserMinus } from 'lucide-react';

interface ViharFeaturesProps {
  user: User;
  vihars: Vihar[];
  onAdd: (vihar: Vihar) => void;
  onUpdate: (vihar: Vihar) => void;
  onDelete: (id: string) => void;
}

export const ViharFeatures: React.FC<ViharFeaturesProps> = ({ user, vihars, onAdd, onUpdate, onDelete }) => {
  const isAdmin = user.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewParticipantsId, setViewParticipantsId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    from: '',
    to: '',
    description: '',
    startDate: '',
    status: 'planned' as Vihar['status']
  });

  const resetForm = () => {
    setForm({ title: '', from: '', to: '', description: '', startDate: '', status: 'planned' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (vihar: Vihar) => {
    setForm({
      title: vihar.title,
      from: vihar.from,
      to: vihar.to,
      description: vihar.description,
      startDate: vihar.startDate,
      status: vihar.status
    });
    setEditingId(vihar.id);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...form, id: editingId, participants: vihars.find(v => v.id === editingId)?.participants || [] });
    } else {
      onAdd({ ...form, id: Date.now().toString(), participants: [] });
    }
    resetForm();
  };

  const handleAIHelp = async () => {
    if (!form.title || !form.from || !form.to) {
        alert("Please fill in Title, From, and To fields first.");
        return;
    }
    setLoadingAI(true);
    const enhanced = await enhanceViharDescription(form.title, form.from, form.to);
    setForm(prev => ({ ...prev, description: enhanced }));
    setLoadingAI(false);
  };

  const handleJoin = (viharId: string) => {
    joinVihar(viharId, user.name); // Using user name for the "Who is going" feature
    // Parent state will refresh automatically if storage updates triggers it, 
    // but here we manually trigger a reload of vihars in parent by calling onUpdate with current data
    const vihar = vihars.find(v => v.id === viharId);
    if (vihar) {
      onUpdate({ ...vihar, participants: [...(vihar.participants || []), user.name] });
    }
  };

  const handleLeave = (viharId: string) => {
    leaveVihar(viharId, user.name);
    const vihar = vihars.find(v => v.id === viharId);
    if (vihar) {
      onUpdate({ ...vihar, participants: (vihar.participants || []).filter(name => name !== user.name) });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-jain-800">Vihar Yatra</h2>
        {isAdmin && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-viharGreen text-white px-4 py-2 rounded-full flex items-center shadow-md hover:bg-viharGreen/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> New Vihar
          </button>
        )}
      </div>

      {/* Editor Panel (Admin Only) */}
      {isAdmin && isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-jain-100 animate-slide-down">
          <div className="flex justify-between mb-4">
             <h3 className="font-bold text-lg">{editingId ? 'Edit Vihar' : 'Plan New Vihar'}</h3>
             <button onClick={resetForm}><X className="text-gray-400 hover:text-red-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input 
                 required
                 placeholder="Vihar Title" 
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-viharGreen/20 outline-none focus:bg-white transition-colors"
                 value={form.title}
                 onChange={e => setForm({...form, title: e.target.value})}
               />
               <select 
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-viharGreen/20 outline-none focus:bg-white transition-colors"
                 value={form.status}
                 onChange={e => setForm({...form, status: e.target.value as any})}
               >
                 <option value="planned">Planned</option>
                 <option value="ongoing">Ongoing</option>
                 <option value="completed">Completed</option>
               </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                placeholder="From" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white transition-colors"
                value={form.from}
                onChange={e => setForm({...form, from: e.target.value})}
              />
              <input 
                required
                placeholder="To" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white transition-colors"
                value={form.to}
                onChange={e => setForm({...form, to: e.target.value})}
              />
            </div>

            <input 
              type="date"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white transition-colors"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
            />

            <div className="relative">
               <textarea 
                 placeholder="Description..." 
                 className="w-full p-3 h-24 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-viharGreen/20 focus:bg-white resize-none transition-colors"
                 value={form.description}
                 onChange={e => setForm({...form, description: e.target.value})}
               />
               <button 
                 type="button"
                 onClick={handleAIHelp}
                 disabled={loadingAI}
                 className="absolute bottom-3 right-3 text-xs bg-white text-viharGreen border border-jain-200 px-3 py-1 rounded-md flex items-center hover:bg-jain-50 transition-colors disabled:opacity-50"
               >
                 {loadingAI ? "⏳" : <Wand2 className="w-3 h-3 mr-1" />} AI Help
               </button>
            </div>

            <button type="submit" className="w-full bg-viharGreen text-white py-3 rounded-xl font-bold">
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* List View */}
      <div className="space-y-4">
         {vihars.map((vihar) => {
           const isGoing = vihar.participants?.includes(user.name);
           const participantCount = vihar.participants?.length || 0;

           return (
             <div key={vihar.id} className="bg-white p-5 rounded-2xl shadow-sm border border-jain-100 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-bold text-lg text-gray-800">{vihar.title}</h3>
                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                           vihar.status === 'ongoing' ? 'bg-green-100 text-viharGreen' : 
                           vihar.status === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                         }`}>
                           {vihar.status}
                         </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                         <Calendar className="w-4 h-4" /> {vihar.startDate}
                         <span className="text-gray-300">|</span>
                         <MapPin className="w-3 h-3 text-viharOrange"/> {vihar.from} ➝ {vihar.to}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{vihar.description}</p>
                      
                      <div className="flex items-center gap-3">
                         {!isAdmin && vihar.status !== 'completed' && (
                           <button 
                             onClick={() => isGoing ? handleLeave(vihar.id) : handleJoin(vihar.id)}
                             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                               isGoing 
                                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                                : 'bg-viharGreen text-white shadow-lg shadow-viharGreen/20 hover:scale-105 active:scale-95'
                             }`}
                           >
                             {isGoing ? <><UserMinus className="w-4 h-4" /> Not Going</> : <><UserCheck className="w-4 h-4" /> Count Me In</>}
                           </button>
                         )}
                         <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                            <Users className="w-4 h-4 text-viharGreen" />
                            {participantCount} Going
                         </div>
                         {isAdmin && participantCount > 0 && (
                           <button 
                             onClick={() => setViewParticipantsId(viewParticipantsId === vihar.id ? null : vihar.id)}
                             className="text-xs font-bold text-viharOrange hover:underline"
                           >
                             {viewParticipantsId === vihar.id ? 'Hide List' : 'View Participants'}
                           </button>
                         )}
                      </div>

                      {/* Participant List (Admin) */}
                      {isAdmin && viewParticipantsId === vihar.id && (
                        <div className="mt-4 p-4 bg-jain-50 rounded-xl border border-jain-100 animate-slide-down">
                           <h4 className="text-xs font-black text-viharGreen uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Users className="w-3 h-3" /> List of Yatris
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {vihar.participants?.map((name, i) => (
                                <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 border border-gray-100 shadow-sm">
                                  {name}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>

                   {isAdmin && (
                     <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                        <button onClick={() => handleEdit(vihar)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(vihar.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   )}
                </div>
             </div>
           );
         })}
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        title="Delete Vihar?"
        message="Are you sure you want to remove this Vihar? It will be permanently deleted and won't appear again."
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};