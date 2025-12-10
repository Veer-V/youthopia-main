
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Calendar, TrendingUp, Search, Eye, Sparkles, ShieldCheck, QrCode, Mail, Info, User, CheckCircle2, X } from 'lucide-react';
import { SimpleAreaChart } from '../admin/Charts';
import { useData } from '../../contexts/DataContext';
import { UserData } from '../../types';

// --- Reused Digital ID Card Component for Executive View ---
const DigitalIDCard = ({ user }: { user: UserData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 20 });
  const sheenX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 100, damping: 20 });
  const sheenY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  // Safe phone display
  const displayId = user.phone ? `YTH-${user.phone.slice(-4)}` : 'YTH-2025';

  return (
    <div style={{ perspective: 1000 }} className="w-full max-w-md mx-auto">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.586/1] w-full rounded-2xl bg-black shadow-2xl overflow-hidden group select-none"
      >
        <div className="absolute inset-0 bg-slate-900 z-0">
           <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)' }} />
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <motion.div 
          style={{ 
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
            x: sheenX, y: sheenY, width: '200%', height: '200%', top: '-50%', left: '-50%', position: 'absolute', zIndex: 20, pointerEvents: 'none', mixBlendMode: 'overlay'
          }}
        />
        <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white" style={{ transform: "translateZ(20px)" }}>
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-orange flex items-center justify-center shadow-lg"><Sparkles size={16} /></div>
                  <div className="leading-none">
                     <h3 className="text-[10px] text-slate-400 font-bold uppercase">Official Access</h3>
                     <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">VISA PASS</h2>
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold">ACTIVE</span>
               </div>
            </div>
            <div className="flex items-center gap-6 mt-4">
                <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-inner border border-yellow-400/50 flex items-center justify-center opacity-90">
                   <div className="w-8 h-5 border border-black/20 rounded-sm grid grid-cols-2"><div className="border-r border-black/20"></div><div></div></div>
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Holder Name</div>
                   <div className="font-mono text-xl font-bold text-white tracking-tight truncate">{user.name.toUpperCase()}</div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono"><span>ID:</span><span className="text-brand-yellow font-bold">{displayId}</span></div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{user.school || 'N/A'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">{user.stream || 'N/A'} • Class {user.class || 'N/A'}</div>
               </div>
               <div className="bg-white p-1.5 rounded-lg"><QrCode size={36} className="text-black" /></div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const StudentOverview: React.FC = () => {
  const { users, registrations, events, completedEvents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;
  // Explicitly cast curr to string[] to avoid TS unknown type errors
  const totalRegistrations = Object.values(registrations).reduce((acc, curr) => acc + (curr as string[]).length, 0);
  const totalBonus = students.reduce((acc, u) => acc + (u.bonus || 0), 0);
  const engagementRate = totalStudents > 0 ? Math.round((Object.keys(registrations).length / totalStudents) * 100) : 0;

  const stats = [
    { label: 'Total Student Base', value: totalStudents.toString(), change: '+12%', icon: <Users size={20} />, color: 'text-blue-400' },
    { label: 'Active Engagement', value: `${engagementRate}%`, change: '+5%', icon: <TrendingUp size={20} />, color: 'text-green-400' },
    { label: 'Total Bonus Issued', value: totalBonus.toLocaleString(), change: '+8%', icon: <Trophy size={20} />, color: 'text-yellow-400' },
    { label: 'Event Participation', value: totalRegistrations.toString(), change: '+15%', icon: <Calendar size={20} />, color: 'text-purple-400' },
  ];

  const footfallData = [120, 350, 420, 600, 550, 800, 950, 1100, 1050, 1248];
  const bonusData = [1000, 5000, 12000, 15000, 22000, 28000, 35000, 40000, 42000, totalBonus > 45000 ? totalBonus : 45200];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone && s.phone.includes(searchQuery))
  );

  const getStudentEvents = (email: string) => {
    const regIds = registrations[email] || [];
    const completedIds = completedEvents[email] || [];
    
    return regIds.map(id => {
        const evt = events.find(e => e.id === id);
        return evt ? {
            ...evt,
            status: completedIds.includes(id) ? 'Completed' : 'Registered'
        } : null;
    }).filter((e): e is (typeof events[0] & { status: string }) => e !== null);
  };

  return (
    <div className="space-y-6">
      {/* Executive Brief */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 bg-yellow-500/5 rounded-bl-full" />
         <h2 className="text-xl font-bold text-white mb-2">Executive Briefing</h2>
         <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Activity levels are <span className="text-green-400 font-bold">peaking</span>. 
            "Pulse Parade" has the highest engagement. Bonus circulation is within limits.
         </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111] border border-white/10 p-6 rounded-2xl group hover:border-yellow-500/30 transition-colors">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-white">{stat.icon}</div>
                <span className={`text-xs font-bold ${stat.color} bg-white/5 px-2 py-1 rounded border border-white/5`}>{stat.change}</span>
             </div>
             <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
             <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#111] border border-white/10 p-6 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Hourly Footfall Trend</h3>
            <div className="flex-1 w-full relative"><SimpleAreaChart data={footfallData} color="#eab308" fillColor="#eab308" id="footfall" /></div>
         </div>
         <div className="bg-[#111] border border-white/10 p-6 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Bonus Economy Growth</h3>
            <div className="flex-1 w-full relative"><SimpleAreaChart data={bonusData} color="#a855f7" fillColor="#a855f7" id="bonus" /></div>
         </div>
      </div>

      {/* Student Directory */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white">Student Directory & Data</h2>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
            <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
                <thead className="bg-white/5 text-xs uppercase font-bold text-yellow-500">
                    <tr>
                        <th className="p-4 rounded-l-lg">Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">School</th>
                        <th className="p-4">Bonus</th>
                        <th className="p-4 rounded-r-lg text-right">Profile</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredStudents.length > 0 ? filteredStudents.slice(0, 8).map((student, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">{student.name}</td>
                            <td className="p-4 font-mono text-slate-500 text-xs">
                                <div>{student.email}</div>
                                <div>{student.phone}</div>
                            </td>
                            <td className="p-4">{student.school}</td>
                            <td className="p-4 font-bold text-yellow-400">{student.bonus}</td>
                            <td className="p-4 text-right">
                                <button 
                                  onClick={() => setSelectedStudent(student)}
                                  className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors flex items-center gap-2 ml-auto text-xs font-bold"
                                >
                                    <Eye size={16} /> View Data
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">No students found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* DETAILED STUDENT MODAL (Replicating "Me" Page) */}
      <AnimatePresence>
        {selectedStudent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-50 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh]"
                >
                    <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
                        <X size={20} />
                    </button>

                    {/* Left Panel - ID Card Area */}
                    <div className="w-full md:w-1/3 bg-slate-900 p-8 flex flex-col items-center justify-center relative shrink-0">
                        <div className="absolute inset-0 bg-brand-purple/10" />
                        <div className="relative z-10 w-full">
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 text-center">Digital Identity</h3>
                            <div className="scale-90 origin-top">
                               <DigitalIDCard user={selectedStudent} />
                            </div>
                            
                            <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">{selectedStudent.bonus}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Current Bonus Points</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Data & Activities */}
                    <div className="w-full md:w-2/3 p-6 md:p-8 bg-white overflow-y-auto">
                        <div className="mb-8 pt-4 md:pt-0">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedStudent.name}</h2>
                            <p className="text-slate-500">{selectedStudent.school}</p>
                        </div>

                        {/* Personal Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1"><Mail size={12}/> Email</div>
                                <div className="text-sm font-semibold text-slate-800 truncate" title={selectedStudent.email}>{selectedStudent.email}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1"><Info size={12}/> Class & Stream</div>
                                <div className="text-sm font-semibold text-slate-800">{selectedStudent.class || 'N/A'} - {selectedStudent.stream || 'N/A'}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1"><User size={12}/> Details</div>
                                <div className="text-sm font-semibold text-slate-800">{selectedStudent.age || 'N/A'} Years • {selectedStudent.gender || 'N/A'}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1"><ShieldCheck size={12}/> Status</div>
                                <div className="text-sm font-semibold text-green-600">Active Verified</div>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Calendar size={18} /> Activity Passport
                            </h3>
                            <div className="space-y-2 pb-8">
                                {getStudentEvents(selectedStudent.email).length > 0 ? (
                                    getStudentEvents(selectedStudent.email).map((evt) => (
                                        <div key={evt.id} className={`flex items-center justify-between p-3 rounded-xl border ${evt.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{evt.title}</div>
                                                <div className="text-xs text-slate-500">{evt.category}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${evt.status === 'Completed' ? 'bg-green-200 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {evt.status === 'Completed' ? <CheckCircle2 size={12} /> : <Info size={12} />}
                                                {evt.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No activities registered yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentOverview;
