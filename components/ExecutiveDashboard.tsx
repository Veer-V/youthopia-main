
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, LayoutDashboard, Shield, Users, Calendar, 
  Sliders, Gift, MessageSquare, Crown, Menu, X 
} from 'lucide-react';

// Import Executive Sub-pages
import StudentOverview from './executive/StudentOverview';
import AdminOverview from './executive/AdminOverview';
import UsersPage from './executive/Users';
import EventsPage from './executive/Events';
import MasterControlPage from './executive/MasterControl';
import RedemptionPage from './executive/Redemption';
import FeedbackPage from './executive/Feedback';

interface ExecutiveDashboardProps {
  onLogout: () => void;
}

type ExecSection = 'student' | 'admin' | 'users' | 'events' | 'master' | 'redemption' | 'feedback';

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<ExecSection>('student');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'student', label: 'Student Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'admin', label: 'Admin Ops', icon: <Shield size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'master', label: 'Master Control', icon: <Sliders size={20} /> },
    { id: 'redemption', label: 'Redemptions', icon: <Gift size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'student': return <StudentOverview />;
      case 'admin': return <AdminOverview />;
      case 'users': return <UsersPage />;
      case 'events': return <EventsPage />;
      case 'master': return <MasterControlPage />;
      case 'redemption': return <RedemptionPage />;
      case 'feedback': return <FeedbackPage />;
      default: return <StudentOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-[#111] text-yellow-500 p-2 rounded-full border border-yellow-500/20 shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#050505] border-r border-white/5 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/5">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center text-white">
               <Crown size={16} />
             </div>
             <div>
               <h1 className="text-lg font-bold text-white tracking-wide">EXECUTIVE</h1>
               <p className="text-[10px] text-yellow-600 font-bold tracking-[0.2em] uppercase">Control Suite</p>
             </div>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
             <X size={24} />
           </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => {
                 setActiveSection(item.id as ExecSection);
                 setSidebarOpen(false);
               }}
               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden group ${
                 activeSection === item.id 
                   ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20' 
                   : 'text-slate-400 hover:bg-white/5 hover:text-white'
               }`}
             >
                {activeSection === item.id && (
                   <motion.div layoutId="activeExec" className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
             </button>
           ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-[#050505]">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
           >
             <LogOut size={20} />
             <span className="font-medium">Sign Out</span>
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen bg-[#0a0a0a] relative">
        
        {/* Ticker Tape */}
        <div className="bg-[#111] border-b border-white/5 h-8 overflow-hidden flex items-center relative z-20">
            <div className="bg-yellow-600 px-3 h-full flex items-center font-bold text-black text-[10px] uppercase tracking-widest z-10">
                Live Feed
            </div>
            <motion.div 
               className="flex whitespace-nowrap text-xs text-slate-400 font-mono"
               animate={{ x: [0, -1000] }}
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
               <span className="mx-4 text-white">Total Footfall: 1,248 <span className="text-green-500">▲ 12%</span></span> • 
               <span className="mx-4 text-white">Bonus Issued: 45.2k <span className="text-green-500">▲ 8%</span></span> • 
               <span className="mx-4 text-white">Active Sessions: 320</span> • 
               <span className="mx-4 text-white">Server Load: 45% <span className="text-green-500">Stable</span></span> • 
               <span className="mx-4 text-white">Top Event: Pulse Parade (98% Cap)</span> • 
               <span className="mx-4 text-white">Redemption Queue: 0 Pending</span> •
               <span className="mx-4 text-white">Critical Alerts: <span className="text-green-500">NONE</span></span>
            </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <AnimatePresence mode="wait">
            <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto"
            >
                {renderContent()}
            </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveDashboard;
