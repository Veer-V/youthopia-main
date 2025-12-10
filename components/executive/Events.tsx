
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { useData } from '../../contexts/DataContext';

const Events: React.FC = () => {
  const { events, addEvent, deleteEvent } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Intercollegiate', date: '', loc: '' });

  const handleDelete = (id: string) => {
     if (confirm("Delete this event? This will cancel all registrations associated with it.")) {
        deleteEvent(id);
     }
  };

  const handleAdd = () => {
     const newId = (events.length + 100).toString();
     addEvent({
        id: newId, 
        title: newEvent.title, 
        category: newEvent.category, 
        date: newEvent.date, 
        loc: newEvent.loc,
        time: 'TBA',
        imageColor: 'from-gray-700 to-gray-900',
        quote: 'New Event',
        description: 'Details coming soon.',
        rules: [],
        image: ''
     });
     setShowAddModal(false);
     setNewEvent({ title: '', category: 'Intercollegiate', date: '', loc: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Event Management</h2>
         <Button variant="amber" onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={18} /> Create Event
         </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
                {events.map(evt => (
                <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-yellow-500/50 transition-colors"
                >
                    <div className={`h-32 bg-gradient-to-r ${evt.imageColor || 'from-slate-700 to-slate-900'} relative`}>
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 backdrop-blur-md">
                            <Edit2 size={14} />
                            </button>
                            <button 
                            onClick={() => handleDelete(evt.id)}
                            className="p-2 bg-red-500/50 text-white rounded-lg hover:bg-red-600/70 backdrop-blur-md"
                            >
                            <Trash2 size={14} />
                            </button>
                        </div>
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                            {evt.category}
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-white mb-2 line-clamp-1">{evt.title}</h3>
                        <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex items-center gap-2"><Calendar size={12} /> {evt.date}</div>
                            <div className="flex items-center gap-2"><MapPin size={12} /> {evt.loc}</div>
                        </div>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
        </div>
      ) : (
          <div className="text-center py-20 text-slate-500 border border-white/5 rounded-2xl bg-[#111]">
            No events found. Create one to get started.
          </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-md">
               <h3 className="text-xl font-bold text-white mb-6">Create New Event</h3>
               <div className="space-y-4">
                  <Input 
                     variant="dark"
                     placeholder="Event Title"
                     value={newEvent.title}
                     onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <Input 
                        variant="dark"
                        placeholder="Date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                     />
                     <Input 
                        variant="dark"
                        placeholder="Location"
                        value={newEvent.loc}
                        onChange={(e) => setNewEvent({...newEvent, loc: e.target.value})}
                     />
                  </div>
                  <Input 
                     as="select"
                     variant="dark"
                     options={['Intercollegiate', 'Engagement', 'Workshop']}
                     value={newEvent.category}
                     onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  />
                  <div className="flex gap-4 pt-4">
                     <Button variant="outline" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
                     <Button variant="amber" fullWidth onClick={handleAdd}>Save Event</Button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Events;
