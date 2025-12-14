import React, { useState } from 'react';
import { User, Poll, PollOption } from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { Plus, Trash2, CheckCircle, BarChart2, X, Edit2 } from 'lucide-react';
import { hasUserVoted, recordUserVote } from '../services/storageService';

interface PollFeaturesProps {
  user: User;
  polls: Poll[];
  onAdd: (poll: Poll) => void;
  onUpdate: (poll: Poll) => void;
  onDelete: (id: string) => void;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollFeatures: React.FC<PollFeaturesProps> = ({ user, polls, onAdd, onUpdate, onDelete, onVote }) => {
  const isAdmin = user.role === 'admin';
  const [isEditing, setIsEditing] = useState(false); // Controls form visibility
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form State
  const [question, setQuestion] = useState('');
  // Track options with IDs to preserve votes when editing
  const [options, setOptions] = useState<{id?: string, text: string, votes: number}[]>([
    { text: '', votes: 0 }, 
    { text: '', votes: 0 }
  ]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setQuestion('');
    setOptions([{ text: '', votes: 0 }, { text: '', votes: 0 }]);
  };

  const startCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (poll: Poll) => {
    setEditingId(poll.id);
    setQuestion(poll.question);
    // Deep copy options to avoid mutating original poll state directly
    setOptions(poll.options.map(o => ({ ...o })));
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.text.trim() !== '');
    if (validOptions.length < 2) return alert("Please provide at least 2 options.");

    const poll: Poll = {
      id: editingId || Date.now().toString(),
      question,
      isActive: true,
      options: validOptions.map((opt, idx) => ({
        // If it's an existing option (has ID), keep it. If new, generate ID.
        id: opt.id || `opt-${Date.now()}-${idx}`,
        text: opt.text,
        votes: opt.votes || 0
      }))
    };

    if (editingId) {
      onUpdate(poll);
    } else {
      onAdd(poll);
    }
    resetForm();
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (hasUserVoted(pollId)) return;
    onVote(pollId, optionId);
    recordUserVote(pollId, optionId);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-jain-800">Community Polls</h2>
        {isAdmin && !isEditing && (
          <button 
            onClick={startCreate}
            className="bg-jain-600 text-white px-4 py-2 rounded-full flex items-center shadow-md hover:bg-jain-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Poll
          </button>
        )}
      </div>

      {/* Create/Edit Poll Form (Admin Only) */}
      {isAdmin && isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-jain-100 animate-slide-down">
          <div className="flex justify-between mb-4">
             <h3 className="font-bold text-lg">{editingId ? 'Edit Poll' : 'New Poll'}</h3>
             <button onClick={resetForm}><X className="text-gray-400 hover:text-red-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required
              placeholder="Question?" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-jain-400 outline-none font-medium focus:bg-white transition-colors"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Options</label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    required
                    placeholder={`Option ${idx + 1}`}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-jain-400 focus:ring-2 focus:ring-jain-400 outline-none text-sm focus:bg-white transition-colors"
                    value={opt.text}
                    onChange={e => {
                      const next = [...options];
                      next[idx] = { ...next[idx], text: e.target.value };
                      setOptions(next);
                    }}
                  />
                  {/* Allow removing options if more than 2 */}
                  {options.length > 2 && (
                    <button 
                      type="button"
                      onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                 type="button" 
                 onClick={() => setOptions([...options, { text: '', votes: 0 }])}
                 className="text-sm text-jain-600 font-semibold hover:underline"
              >
                + Add Option
              </button>
            </div>
            <button 
              type="submit" 
              className="w-full bg-jain-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-jain-700"
            >
              {editingId ? 'Update Poll' : 'Publish Poll'}
            </button>
          </form>
        </div>
      )}

      {/* Poll List */}
      <div className="grid grid-cols-1 gap-6">
        {polls.map(poll => {
          const totalVotes = poll.options.reduce((a, b) => a + b.votes, 0);
          const userVoted = hasUserVoted(poll.id);

          return (
            <div key={poll.id} className="bg-white p-6 rounded-2xl shadow-sm border border-jain-100 relative overflow-hidden">
               {isAdmin && (
                 <div className="absolute top-4 right-4 flex gap-2 z-20">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       startEdit(poll);
                     }}
                     className="text-gray-300 hover:text-blue-600 transition-colors p-1"
                     title="Edit Poll"
                   >
                     <Edit2 className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(poll.id);
                     }}
                     className="text-gray-300 hover:text-red-500 transition-colors p-1"
                     title="Delete Poll"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
               )}
               
               <h3 className="text-xl font-bold text-gray-800 mb-4 pr-16">{poll.question}</h3>
               
               <div className="space-y-3">
                 {poll.options.map(option => {
                   const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                   
                   return (
                     <div 
                       key={option.id}
                       onClick={() => !userVoted && handleVote(poll.id, option.id)}
                       className={`relative group rounded-xl border-2 overflow-hidden transition-all ${
                         userVoted 
                           ? 'border-transparent bg-gray-50 cursor-default' 
                           : 'border-gray-100 hover:border-jain-300 cursor-pointer hover:bg-orange-50'
                       }`}
                     >
                        {/* Progress Bar Background */}
                        {userVoted && (
                          <div 
                            className="absolute top-0 left-0 bottom-0 bg-jain-100 transition-all duration-1000 ease-out"
                            style={{ width: `${percent}%` }}
                          />
                        )}
                        
                        <div className="relative p-3 flex justify-between items-center z-10">
                           <span className={`font-medium ${userVoted ? 'text-gray-700' : 'text-gray-600 group-hover:text-jain-800'}`}>
                             {option.text}
                           </span>
                           {userVoted && (
                             <span className="text-sm font-bold text-jain-700">{percent}%</span>
                           )}
                        </div>
                     </div>
                   );
                 })}
               </div>
               
               <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center"><BarChart2 className="w-3 h-3 mr-1"/> {totalVotes} Votes</span>
                  {userVoted && <span className="flex items-center text-green-600"><CheckCircle className="w-3 h-3 mr-1"/> Voted</span>}
               </div>
            </div>
          );
        })}
        {polls.length === 0 && (
           <div className="text-center py-10 text-gray-400">
             No active polls.
           </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        title="Delete Poll?"
        message="Are you sure you want to delete this poll? All voting data will be permanently lost."
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};