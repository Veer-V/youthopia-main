
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Megaphone, Lock, RefreshCcw, Bell, Calendar, Key, CheckCircle2, X, Search, Trophy, UserCheck, Terminal, Phone, BookOpen, GraduationCap, MessageSquare } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { useData } from '../../contexts/DataContext';
import { EventController } from "../../controllers/eventController";

interface EnrolledStudent {
   id: string; // Email is used as ID
   name: string;
   phone: string;
   school: string;
   details: string; // Class & Stream
   status: 'Registered' | 'Attended' | 'Completed';
   feedback?: string;
}

const MasterControl: React.FC = () => {
   const { events, users, user, registrations, completedEvents, updateUserBonus, markEventCompleted, feedbacks } = useData();
   const [activeTab, setActiveTab] = useState<'global' | 'events'>('events');

   const [systemState, setSystemState] = useState({
      registrationsOpen: true,
      maintenanceMode: false,
      liveFeed: true,
   });

   // System Logs
   const [logs, setLogs] = useState<string[]>([]);
   const logsEndRef = useRef<HTMLDivElement>(null);

   const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${time}] SYSTEM: ${msg}`]);
   };

   useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [logs]);

   // Event Control States
   const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
   const [passcodeInput, setPasscodeInput] = useState('');
   const [isAuthorized, setIsAuthorized] = useState(false);
   const [authError, setAuthError] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [studentSearchQuery, setStudentSearchQuery] = useState('');
   const [currentStudents, setCurrentStudents] = useState<EnrolledStudent[]>([]);

   // Fetch real students registered for the event
   const getRegisteredStudents = (evtId: string): EnrolledStudent[] => {
      const targetEvent = events.find(e => e.id === evtId || e._id === evtId);
      if (!targetEvent || !targetEvent.registered) return [];

      // targetEvent.registered is an array of strings (Yids, IDs, or Emails)
      const registeredIds = targetEvent.registered;

      const enrolledStudents: EnrolledStudent[] = [];
      const processedEmails = new Set<string>();

      registeredIds.forEach(regId => {
         // Find user by any matching identifier
         const user = users.find(u =>
            (u.Yid && u.Yid === regId) ||
            (u.id && u.id === regId) ||
            (u._id === regId) ||
            (u.email === regId)
         );

         if (user && user.email && !processedEmails.has(user.email)) {
            processedEmails.add(user.email);

            // Check completion status
            // We check both the event's completed list AND the user's completed history
            const eventCompletedList = targetEvent.completed || [];
            const isCompleted = (completedEvents[user.email] && completedEvents[user.email].includes(evtId)) ||
               (user.Yid && eventCompletedList.includes(user.Yid)) ||
               (user.id && eventCompletedList.includes(user.id)) ||
               (user._id && eventCompletedList.includes(user._id)) ||
               eventCompletedList.includes(user.email);

            // Find feedback
            const userFeedback = feedbacks.find(f => f.eventId === evtId && f.userEmail === user.email);

            enrolledStudents.push({
               id: user.email,
               name: user.name,
               phone: user.phone || 'N/A',
               school: user.institute || 'N/A',
               details: `${user.class || ''} - ${user.stream || ''}`,
               status: isCompleted ? 'Completed' : 'Registered',
               feedback: userFeedback ? userFeedback.emoji : undefined
            });
         }
      });

      return enrolledStudents;
   };

   // Deterministic Passcode Generator
   const generatePasscode = (id: string) => {
      let hash = 0;
      const str = id + "YOUTHOPIA2025";
      for (let i = 0; i < str.length; i++) {
         hash = ((hash << 5) - hash) + str.charCodeAt(i);
         hash |= 0;
      }
      return (Math.abs(hash).toString(36).toUpperCase() + "9X7P2M5N").substring(0, 10);
   };

   const listAllPasscodes = () => {
      addLog("=== EVENT PASSCODES ===");
      events.forEach(e => {
         addLog(`${e.title}: ${generatePasscode(e.id)}`);
      });
      addLog("=======================");
   };

   const toggleState = (key: keyof typeof systemState) => {
      const newState = !systemState[key];
      setSystemState(prev => ({ ...prev, [key]: newState }));
      addLog(`Changed ${String(key)} to ${newState ? 'ENABLED' : 'DISABLED'}`);
   };

   const handleEventClick = (id: string) => {
      setSelectedEventId(id);
      setPasscodeInput('');
      setIsAuthorized(false);
      setAuthError(false);
   };

   const handleAuthSubmit = () => {
      if (passcodeInput === generatePasscode(selectedEventId!) || passcodeInput === selectedEventId) { // Fallback to ID for safety if needed, can remove later
         setIsAuthorized(true);
         setCurrentStudents(getRegisteredStudents(selectedEventId!));
         setAuthError(false);
         addLog(`Admin authorized access for Event ID ${selectedEventId}`);
      } else {
         setAuthError(true);
         addLog(`Failed authorization attempt for Event ID ${selectedEventId}`);
      }
   };

   const closePanel = () => {
      setSelectedEventId(null);
      setIsAuthorized(false);
      setPasscodeInput('');
   };

   const grantBonus = async (studentEmail: string) => {
      // 1. Find user and event details
      const user = users.find(u => u.email === studentEmail);
      const evt = events.find(e => e.id === selectedEventId);

      if (!user || !evt || !selectedEventId) {
         addLog(`Error: Could not find user or event details for ${studentEmail}`);
         return;
      }

      // 2. Construct Payload
      // Extract Team info if available in rawRegistered
      let teamObj = {};

      if (evt.rawRegistered && typeof evt.rawRegistered === 'object') {
         // Check if user is the Team Leader (Key in rawRegistered)
         if (user.Yid && evt.rawRegistered[user.Yid]) {
            const entry = evt.rawRegistered[user.Yid];
            if (entry.team) teamObj = entry.team;
         }
         // Check if user is a member in someone else's team
         else {
            Object.values(evt.rawRegistered).forEach((entry: any) => {
               if (entry.team && Array.isArray(entry.team)) {
                  const foundMember = entry.team.find((m: any) => m.Yid === user.Yid);
                  if (foundMember) {
                     // If found as member, we might want to send the whole team array or just their entry?
                     // User requested "object of team". This likely refers to the array of team members?
                     // Or the wrapper object? The request example says "team": {} object of team.
                     // If it's an array in backend, maybe the prompt meant "team": []? 
                     // Or maybe the team structure is { members: [...] }?
                     // Given previous "joinEvent" payload used "team: array", I will assume array.
                     // But prompt said "object". JavaScript arrays are objects. 
                     // If no team, send {}. 
                     // I'll stick to sending the team array/object found.
                     teamObj = entry.team;
                  }
               }
            });
         }
      }

      const payload = {
         Yid: user.Yid || '',
         name: user.name,
         _id: user.id || user._id || '',
         team: teamObj
      };

      // 3. Call Endpoint
      await EventController.completeEvent(selectedEventId, payload);

      // 4. Update Local UI
      setCurrentStudents(prev => prev.map(s =>
         s.id === studentEmail ? { ...s, status: 'Completed' } : s
      ));

      addLog(`Bonus grant request sent for ${studentEmail} (Event ${selectedEventId}).`);
   };

   const grantAllBonus = () => {
      // Execute sequentially or parallel? Parallel is faster.
      currentStudents.forEach(async (s) => {
         if (s.status !== 'Completed') {
            await grantBonus(s.id);
         }
      });
      addLog(`Bulk bonus grant initiated for Event ${selectedEventId}.`);
   };

   const handleBroadcast = () => {
      addLog("Broadcast message sent to all active sessions.");
   };

   const filteredEvents = events.filter(e => {
      // Filter by Event Assignment (for Admins)
      if (user?.role === 'admin' && user.event_assigned) {
         if (user.event_assigned !== 'all' && e.title !== user.event_assigned) {
            return false;
         }
      }

      // Filter by Search Query
      return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.category.toLowerCase().includes(searchQuery.toLowerCase());
   });

   return (
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h2 className="text-2xl font-bold text-slate-800">Master Control</h2>
               <p className="text-slate-500 text-sm">System configuration and event management.</p>
            </div>

            {/* Tab Switcher */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm gap-1">
               <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'events' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <Calendar size={16} /> Event Control
               </button>
               <button
                  onClick={listAllPasscodes}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 flex items-center gap-2"
                  title="List Admin Keys in System Log"
               >
                  <Key size={16} /> Keys
               </button>
               {/* <button
                  onClick={() => setActiveTab('global')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'global' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <Power size={16} /> Global Settings
               </button> */}
            </div>
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'global' ? (
               <motion.div
                  key="global"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
               >
                  {/* System Toggles */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Power size={20} className="text-slate-400" /> System Status
                     </h3>

                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                           <div className="font-bold text-slate-800">Event Registration</div>
                           <div className="text-xs text-slate-500">Allow students to register for events</div>
                        </div>
                        <button
                           onClick={() => toggleState('registrationsOpen')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${systemState.registrationsOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${systemState.registrationsOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                           <div className="font-bold text-slate-800">Maintenance Mode</div>
                           <div className="text-xs text-slate-500">Disable all user access immediately</div>
                        </div>
                        <button
                           onClick={() => toggleState('maintenanceMode')}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${systemState.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${systemState.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                     </div>
                  </div>

                  {/* Broadcast */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Megaphone size={20} className="text-brand-orange" /> Broadcast Message
                     </h3>
                     <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-purple outline-none resize-none flex-1 mb-4"
                        placeholder="Type an urgent message to send to all logged-in students..."
                        rows={4}
                     />
                     <div className="flex justify-end gap-3">
                        <Button variant="white" className="text-sm py-2">Preview</Button>
                        <Button variant="dark" className="text-sm py-2" onClick={handleBroadcast}>Send Broadcast</Button>
                     </div>
                  </div>

                  {/* Admin Access */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm md:col-span-2">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Lock size={20} className="text-brand-purple" /> Quick Actions
                     </h3>
                     <div className="flex flex-wrap gap-4">
                        <Button variant="outline" className="gap-2" onClick={() => addLog("Leaderboard cache reset initiated.")}>
                           <RefreshCcw size={16} /> Reset Leaderboard Cache
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => addLog("Test notification sent to admin group.")}>
                           <Bell size={16} /> Test Notification System
                        </Button>
                     </div>
                  </div>
               </motion.div>
            ) : (
               <motion.div
                  key="events"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
               >
                  {/* Search */}
                  <div className="max-w-md">
                     <Input
                        variant="light"
                        placeholder="Search events..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>

                  {/* Events Grid */}
                  {filteredEvents.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEvents.map(evt => (
                           <motion.div
                              key={evt.id}
                              whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)" }}
                              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer relative overflow-hidden group"
                              onClick={() => handleEventClick(evt.id)}
                           >
                              <div className={`absolute top-0 right-0 p-2 rounded-bl-xl text-white font-bold text-xs ${evt.category === 'Intercollegiate' ? 'bg-brand-purple' : 'bg-brand-pink'}`}>
                                 {evt.category}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-600 group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors">
                                 <Lock size={18} />
                              </div>
                              <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{evt.title}</h3>
                              <p className="text-xs text-slate-500">{evt.category}</p>
                           </motion.div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-10 text-slate-400">No events found.</div>
                  )}
               </motion.div>
            )}
         </AnimatePresence>

         {/* SYSTEM TERMINAL */}
         <div className="bg-[#1e293b] rounded-3xl border border-slate-700 p-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-slate-400 border-b border-slate-700 pb-2">
               <Terminal size={14} /> System Log
            </div>
            <div className="h-32 overflow-y-auto space-y-1 text-slate-300">
               {logs.length === 0 && <span className="opacity-50">System initialized. Waiting for actions...</span>}
               {logs.map((log, i) => (
                  <div key={i}>{log}</div>
               ))}
               <div ref={logsEndRef} />
            </div>
         </div>

         {/* Auth Modal & Panel Overlay */}
         <AnimatePresence>
            {selectedEventId && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                     onClick={closePanel}
                  />

                  {!isAuthorized ? (
                     /* 1. Passcode Entry Modal */
                     <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl"
                     >
                        <button onClick={closePanel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <div className="text-center mb-6">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                              <Key size={32} />
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">Event Access Locked</h3>
                           <p className="text-slate-500 text-sm mt-2">Enter the admin passcode for <br /> <span className="font-bold">{events.find(e => e.id === selectedEventId)?.title || selectedEventId}</span></p>
                        </div>

                        <div className="space-y-4">
                           <Input
                              type="password"
                              placeholder="Enter Passcode"
                              value={passcodeInput}
                              onChange={(e) => { setPasscodeInput(e.target.value); setAuthError(false); }}
                              className="text-center tracking-widest text-lg font-bold"
                              autoFocus
                           />
                           {authError && <p className="text-red-500 text-xs text-center font-bold">Incorrect Passcode. Hint: Ask Admin for Key.</p>}
                           <Button
                              fullWidth
                              variant="dark"
                              onClick={handleAuthSubmit}
                           >
                              Unlock Panel
                           </Button>
                        </div>
                     </motion.div>
                  ) : (
                     /* 2. Authorized Control Panel */
                     <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-3xl w-full max-w-5xl max-h-[80vh] flex flex-col relative z-10 shadow-2xl overflow-hidden"
                     >
                        {/* Panel Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                           <div>
                              <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">
                                 <CheckCircle2 size={16} className="text-green-500" /> Authorized Access
                              </div>
                              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                 {events.find(e => e.id === selectedEventId)?.title}
                                 <span className="bg-brand-purple text-white text-xs px-2 py-1 rounded-md">ID: {selectedEventId}</span>
                                 <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md ml-2">
                                    {events.find(e => e.id === selectedEventId)?.category}
                                 </span>
                                 <span className="bg-brand-pink text-white text-xs px-2 py-1 rounded-md ml-2">
                                    Participants: {currentStudents.length}
                                 </span>
                              </h2>
                           </div>
                           <button onClick={closePanel} className="bg-white p-2 rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-red-500 transition-colors">
                              <X size={20} />
                           </button>
                        </div>

                        {/* Panel Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                           {/* <div className="flex justify-between items-end mb-4">
                              <h3 className="font-bold text-slate-700">Enrolled Students ({currentStudents.length})</h3>
                              <Button variant="secondary" className="text-xs py-2 h-auto" onClick={grantAllBonus}>
                                 <Trophy size={14} className="mr-1" /> Grant All Bonus & Complete
                              </Button>
                           </div> */}

                           {/* Student Search */}
                           <div className="mb-4">
                              <Input
                                 variant="light"
                                 placeholder="Search students by name or email..."
                                 icon={<Search size={16} />}
                                 value={studentSearchQuery}
                                 onChange={(e) => setStudentSearchQuery(e.target.value)}
                              />
                           </div>

                           <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                              <table className="w-full text-left min-w-[600px]">
                                 <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                    <tr>
                                       <th className="p-3 pl-4">Name & Email</th>
                                       <th className="p-3 hidden md:table-cell">Contact</th>
                                       <th className="p-3 hidden md:table-cell">Details</th>
                                       <th className="p-3 text-center">Feedback</th>
                                       <th className="p-3">Status</th>
                                       <th className="p-3 text-right pr-4">Action</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100 text-sm">
                                    {currentStudents.filter(s =>
                                       s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                                       s.id.toLowerCase().includes(studentSearchQuery.toLowerCase())
                                    ).map(student => (
                                       <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                          <td className="p-3 pl-4">
                                             <div className="font-bold text-slate-800">{student.name}</div>
                                             <div className="text-xs text-slate-400 font-mono truncate max-w-[150px]">{student.id}</div>
                                          </td>
                                          <td className="p-3 hidden md:table-cell">
                                             <div className="flex items-center gap-1.5 text-slate-600">
                                                <Phone size={12} className="text-slate-400" /> {student.phone}
                                             </div>
                                          </td>
                                          <td className="p-3 hidden md:table-cell">
                                             <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                                                   <BookOpen size={12} className="text-slate-400" /> {student.school}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                   <GraduationCap size={12} className="text-slate-400" /> {student.details}
                                                </div>
                                             </div>
                                          </td>
                                          <td className="p-3 text-center">
                                             {student.feedback ? (
                                                <span className="text-xl" title="Student Sentiment">{student.feedback}</span>
                                             ) : (
                                                <span className="text-slate-300 text-xs italic">-</span>
                                             )}
                                          </td>
                                          <td className="p-3">
                                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {student.status}
                                             </span>
                                          </td>
                                          <td className="p-3 text-right pr-4">
                                             {student.status === 'Completed' ? (
                                                <span className="text-green-500 flex items-center justify-end gap-1 font-bold text-xs">
                                                   <CheckCircle2 size={14} /> Awarded
                                                </span>
                                             ) : (
                                                <button
                                                   onClick={() => grantBonus(student.id)}
                                                   className="bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                >
                                                   Grant Points
                                                </button>
                                             )}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                              {currentStudents.length === 0 && (
                                 <div className="p-12 text-center text-slate-400 bg-slate-50/50">
                                    <div className="mb-2 opacity-30"><UserCheck size={32} className="mx-auto" /></div>
                                    No students currently enrolled in this event.
                                 </div>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  )}
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default MasterControl;
