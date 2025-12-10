
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Search, Filter, Edit, Trash2, Plus, X, Download, Eye, CheckCircle2, Info } from 'lucide-react';
import Input from '../Input';
import Button from '../Button';
import { useData } from '../../contexts/DataContext';
import { UserData } from '../../types';

const UsersEvents: React.FC = () => {
  const { users, events, addUser, deleteUser, addEvent, deleteEvent, registrations, completedEvents } = useData();
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Activity View State
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<UserData | null>(null);
  
  // Form States
  const [newUser, setNewUser] = useState({ name: '', email: '', school: '', class: '', stream: '' });
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Intercollegiate', date: '', loc: '' });

  // --- ACTIONS ---

  const handleExportCSV = () => {
    if (users.length === 0) {
        alert("No user data to export.");
        return;
    }
    const headers = ["ID,Name,School,Class,Stream,Bonus"];
    const rows = users.map(u => `${u.email},${u.name},${u.school},${u.class},${u.stream},${u.bonus}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_database.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const handleAddUser = () => {
    addUser({
        email: newUser.email || `student${users.length+1}@example.com`,
        name: newUser.name,
        school: newUser.school,
        class: newUser.class,
        stream: newUser.stream,
        phone: '0000000000',
        age: '18',
        gender: 'Other',
        role: 'student',
        bonus: 0
    });
    setShowUserModal(false);
    setNewUser({ name: '', email: '', school: '', class: '', stream: '' });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Delete this event?")) {
      deleteEvent(id);
    }
  };

  const handleAddEvent = () => {
    const id = (events.length + 100).toString();
    addEvent({
        id,
        title: newEvent.title,
        category: newEvent.category,
        date: newEvent.date,
        loc: newEvent.loc,
        time: 'TBA',
        imageColor: 'from-gray-500 to-gray-600',
        quote: 'New Event',
        description: 'Details coming soon.',
        rules: [],
        image: ''
    });
    setShowEventModal(false);
    setNewEvent({ title: '', category: 'Intercollegiate', date: '', loc: '' });
  };

  const getUserActivities = (email: string) => {
      const regIds = registrations[email] || [];
      const compIds = completedEvents[email] || [];
      return regIds.map(id => {
          const evt = events.find(e => e.id === id);
          if (!evt) return null;
          return {
              ...evt,
              status: compIds.includes(id) ? 'Completed' : 'Registered'
          };
      }).filter(Boolean);
  };

  // --- FILTERING ---

  const filteredUsers = users.filter(user => 
    user.role === 'student' && (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetSearch = () => setSearchQuery('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Database Management</h2>
        
        {/* Tabs */}
        <div className="bg-slate-100 p-1 rounded-full flex">
           <button 
             onClick={() => { setActiveTab('users'); resetSearch(); }}
             className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
           >
             Students
           </button>
           <button 
             onClick={() => { setActiveTab('events'); resetSearch(); }}
             className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
           >
             Events
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="flex-1">
             <Input 
                variant="light" 
                placeholder={activeTab === 'users' ? "Search student by name or email..." : "Search events by name or category..."}
                icon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
         </div>
         <div className="flex gap-2">
            <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-brand-purple hover:border-brand-purple transition-colors">
                <Filter size={20} />
            </button>
            {activeTab === 'users' && (
                <Button variant="white" onClick={handleExportCSV} className="gap-2 border-slate-200 text-slate-600">
                    <Download size={18} /> Export CSV
                </Button>
            )}
            <Button 
                variant="secondary" 
                onClick={() => activeTab === 'users' ? setShowUserModal(true) : setShowEventModal(true)}
                className="gap-2"
            >
                <Plus size={18} /> {activeTab === 'users' ? 'Add Student' : 'Add Event'}
            </Button>
         </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
         {activeTab === 'users' ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                   <tr>
                      <th className="p-4 pl-6">ID / Email</th>
                      <th className="p-4">Name</th>
                      <th className="p-4 hidden md:table-cell">School</th>
                      <th className="p-4 hidden md:table-cell">Activity</th>
                      <th className="p-4">Bonus</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   <AnimatePresence>
                   {filteredUsers.length > 0 ? filteredUsers.map(user => {
                       const acts = getUserActivities(user.email);
                       return (
                      <motion.tr 
                          key={user.email} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="hover:bg-slate-50 transition-colors"
                      >
                         <td className="p-4 pl-6 font-mono text-slate-400 truncate max-w-[150px]" title={user.email}>{user.email}</td>
                         <td className="p-4 font-bold text-slate-800">{user.name}</td>
                         <td className="p-4 hidden md:table-cell text-slate-600">{user.school}</td>
                         <td className="p-4 hidden md:table-cell">
                            <button onClick={() => setSelectedUserForActivity(user)} className="text-brand-purple hover:underline text-xs font-bold flex items-center gap-1">
                               <Eye size={12} /> {acts.length} Events
                            </button>
                         </td>
                         <td className="p-4 font-bold text-brand-purple">{user.bonus}</td>
                         <td className="p-4 text-right pr-6 flex justify-end gap-2">
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteUser(user.email)} className="p-2 hover:bg-red-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                         </td>
                      </motion.tr>
                   )}) : (
                      <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">No students found matching "{searchQuery}"</td>
                      </tr>
                   )}
                   </AnimatePresence>
                </tbody>
             </table>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                   <tr>
                      <th className="p-4 pl-6">Event Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 hidden md:table-cell">Date/Time</th>
                      <th className="p-4 hidden md:table-cell">Capacity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   <AnimatePresence>
                   {filteredEvents.length > 0 ? filteredEvents.map(event => (
                      <motion.tr 
                          key={event.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="hover:bg-slate-50 transition-colors"
                      >
                         <td className="p-4 pl-6 font-bold text-slate-800">{event.title}</td>
                         <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${event.category === 'Intercollegiate' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                               {event.category}
                            </span>
                         </td>
                         <td className="p-4 hidden md:table-cell text-slate-500">{event.date}, {event.time}</td>
                         <td className="p-4 hidden md:table-cell text-slate-600">--</td>
                         <td className="p-4">
                            <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                               <div className="w-2 h-2 rounded-full bg-green-500" /> Active
                            </span>
                         </td>
                         <td className="p-4 text-right pr-6 flex justify-end gap-2">
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                         </td>
                      </motion.tr>
                   )) : (
                      <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">No events found matching "{searchQuery}"</td>
                      </tr>
                   )}
                   </AnimatePresence>
                </tbody>
             </table>
           </div>
         )}
      </motion.div>

      {/* --- ADD USER MODAL --- */}
      {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Add New Student</h3>
                    <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                 </div>
                 <div className="space-y-4">
                    <Input variant="light" placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    <Input variant="light" placeholder="Email Address" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    <Input variant="light" placeholder="School/College" value={newUser.school} onChange={e => setNewUser({...newUser, school: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input variant="light" placeholder="Class" value={newUser.class} onChange={e => setNewUser({...newUser, class: e.target.value})} />
                        <Input variant="light" placeholder="Stream" value={newUser.stream} onChange={e => setNewUser({...newUser, stream: e.target.value})} />
                    </div>
                    <Button fullWidth onClick={handleAddUser} className="mt-4">Create Student</Button>
                 </div>
             </div>
          </div>
      )}

      {/* --- ACTIVITY LOG MODAL --- */}
      {selectedUserForActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col">
                 <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{selectedUserForActivity.name}</h3>
                        <p className="text-xs text-slate-400">Activity Log</p>
                    </div>
                    <button onClick={() => setSelectedUserForActivity(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                 </div>
                 
                 <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                    {getUserActivities(selectedUserForActivity.email).length > 0 ? (
                        getUserActivities(selectedUserForActivity.email).map((evt: any) => (
                           <div key={evt.id} className={`p-3 rounded-xl border flex justify-between items-center ${evt.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                              <div>
                                 <div className="font-bold text-slate-800 text-sm">{evt.title}</div>
                                 <div className="text-xs text-slate-500">{evt.category}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${evt.status === 'Completed' ? 'bg-green-200 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                 {evt.status === 'Completed' ? <CheckCircle2 size={12} /> : <Info size={12} />}
                                 {evt.status}
                              </span>
                           </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 italic">No activities recorded.</div>
                    )}
                 </div>
             </div>
          </div>
      )}

      {/* --- ADD EVENT MODAL --- */}
      {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Create Event</h3>
                    <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                 </div>
                 <div className="space-y-4">
                    <Input variant="light" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                    <Input variant="light" as="select" options={['Intercollegiate', 'Engagement', 'Workshop']} value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input variant="light" placeholder="Date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                        <Input variant="light" placeholder="Location" value={newEvent.loc} onChange={e => setNewEvent({...newEvent, loc: e.target.value})} />
                    </div>
                    <Button fullWidth onClick={handleAddEvent} className="mt-4">Publish Event</Button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default UsersEvents;
