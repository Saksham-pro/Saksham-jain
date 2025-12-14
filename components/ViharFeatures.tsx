import React, { useState } from 'react';
import { User, Vihar } from '../types';
import { enhanceViharDescription } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';
import { Plus, Trash2, Edit2, MapPin, Calendar, Wand2, X, Check } from 'lucide-react';

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
      onUpdate({ ...form, id: editingId });
    } else {
      onAdd({ ...form, id: Date.now().toString() });
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-jain-800">Vihar Yatra</h2>
        {isAdmin && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-jain-600 text-white px-4 py-2 rounded-full flex items-center shadow-md hover:bg-jain-700 transition-colors"
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
                 placeholder="Vihar Title (e.g. Shikharji Yatra)" 
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-jain-400 outline-none focus:bg-white transition-colors"
                 value={form.title}
                 onChange={e => setForm({...form, title: e.target.value})}
               />
               <select 
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-jain-400 outline-none focus:bg-white transition-colors"
                 value={form.status}
                 onChange={e => setForm({...form, status: e.target.value as any})}
               >
                 <option value="planned">Planned</option>
                 <option value="ongoing">Ongoing</option>
                 <option value="completed">Completed</option>
               </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                 <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                 <input 
                   required
                   placeholder="From Location" 
                   className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white transition-colors"
                   value={form.from}
                   onChange={e => setForm({...form, from: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                 <input 
                   required
                   placeholder="To Location" 
                   className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white transition-colors"
                   value={form.to}
                   onChange={e => setForm({...form, to: e.target.value})}
                 />
              </div>
            </div>

            <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="date"
                  required
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white transition-colors"
                  value={form.startDate}
                  onChange={e => setForm({...form, startDate: e.target.value})}
                />
            </div>

            <div className="relative">
               <textarea 
                 placeholder="Description of the journey..." 
                 className="w-full p-3 h-24 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-jain-400 focus:bg-white resize-none transition-colors"
                 value={form.description}
                 onChange={e => setForm({...form, description: e.target.value})}
               />
               <button 
                 type="button"
                 onClick={handleAIHelp}
                 disabled={loadingAI}
                 className="absolute bottom-3 right-3 text-xs bg-white text-jain-700 border border-jain-200 px-3 py-1 rounded-md flex items-center hover:bg-jain-50 transition-colors disabled:opacity-50 shadow-sm"
               >
                 {loadingAI ? <span className="animate-spin mr-1">⏳</span> : <Wand2 className="w-3 h-3 mr-1" />}
                 AI Enhance
               </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-jain-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-jain-700 transition-transform active:scale-95"
            >
              {editingId ? 'Update Vihar' : 'Create Vihar'}
            </button>
          </form>
        </div>
      )}

      {/* List View */}
      <div className="space-y-4">
         {vihars.map(vihar => (
           <div key={vihar.id} className="bg-white p-5 rounded-2xl shadow-sm border border-jain-100 flex flex-col md:flex-row md:items-center justify-between group hover:shadow-md transition-all">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{vihar.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                      vihar.status === 'ongoing' ? 'bg-green-100 text-green-700' : 
                      vihar.status === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {vihar.status}
                    </span>
                 </div>
                 <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" /> {vihar.startDate}
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {vihar.from} ➝ {vihar.to}</span>
                 </div>
                 <p className="text-gray-600 text-sm">{vihar.description}</p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4 md:mt-0 md:ml-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                   {vihar.status !== 'completed' && (
                     <button 
                       onClick={(e) => {
                          e.stopPropagation();
                          onUpdate({ ...vihar, status: 'completed' });
                       }}
                       className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                       title="Mark as Completed"
                     >
                       <Check className="w-4 h-4" />
                     </button>
                   )}
                   <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(vihar);
                     }}
                     className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                     title="Edit"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(vihar.id);
                     }}
                     className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                     title="Delete"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              )}
           </div>
         ))}
         {vihars.length === 0 && (
            <div className="text-center py-10 text-gray-400">
               No vihars found. Admin can add new ones.
            </div>
         )}
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        title="Delete Vihar?"
        message="Are you sure you want to remove this Vihar trip? This action cannot be undone."
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};