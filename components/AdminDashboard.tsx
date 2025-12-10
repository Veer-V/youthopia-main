
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Sliders, MessageSquare, Gift, LogOut, Menu, X, Command, Search
} from 'lucide-react';
import Overview from './admin/Overview';
import UsersEvents from './admin/UsersEvents';
import MasterControl from './admin/MasterControl';
import Feedback from './admin/Feedback';
import Redemption from './admin/Redemption';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminSection = 'overview' | 'users' | 'master' | 'feedback' | 'redemption';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'master', label: 'Master Control', icon: <Sliders size={20} /> },
    { id: 'users', label: 'Users & Events', icon: <Users size={20} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
    { id: 'redemption', label: 'Redemption', icon: <Gift size={20} /> },
  ];

  // Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setShowCommandPalette(prev => !prev);
        }
        if (e.key === 'Escape') {
            setShowCommandPalette(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <Overview />;
      case 'users': return <UsersEvents />;
      case 'master': return <MasterControl />;
      case 'feedback': return <Feedback />;
      case 'redemption': return <Redemption />;
      default: return <Overview />;
    }
  };

  const handleCommandNavigation = (section: AdminSection) => {
      setActiveSection(section);
      setShowCommandPalette(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-slate-900 text-white p-2 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-white shadow-xl transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
           <div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
               ADMIN PORTAL
             </h1>
             <p className="text-xs text-slate-500 tracking-widest mt-1">YOUTHOPIA CONTROL</p>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
             <X size={24} />
           </button>
        </div>

        {/* Quick Search Button */}
        <div className="px-4 mt-4">
            <button 
                onClick={() => setShowCommandPalette(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg py-2 px-3 flex items-center justify-between text-sm transition-colors border border-slate-700"
            >
                <span className="flex items-center gap-2"><Search size={14} /> Quick Action</span>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-600">⌘K</span>
            </button>
        </div>

        <nav className="p-4 space-y-2 mt-2">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => {
                 setActiveSection(item.id as AdminSection);
                 setSidebarOpen(false);
               }}
               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden ${
                 activeSection === item.id 
                   ? 'bg-brand-purple text-white shadow-lg shadow-purple-900/20' 
                   : 'text-slate-400 hover:bg-slate-800 hover:text-white'
               }`}
             >
                <div className="relative z-10 flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
             </button>
           ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-[#0f172a]">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
           >
             <LogOut size={20} />
             <span className="font-medium">Logout System</span>
           </button>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 bg-slate-50/50">
        <AnimatePresence mode="wait">
           <motion.div
             key={activeSection}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
             className="max-w-6xl mx-auto"
           >
              {renderContent()}
           </motion.div>
        </AnimatePresence>
      </main>

      {/* COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {showCommandPalette && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowCommandPalette(false)}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
                >
                    <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                        <Command className="text-slate-400" />
                        <input 
                            autoFocus
                            placeholder="Type a command or search..."
                            className="flex-1 outline-none text-lg text-slate-800 placeholder-slate-300"
                        />
                        <button onClick={() => setShowCommandPalette(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="p-2">
                        <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Navigation</div>
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleCommandNavigation(item.id as AdminSection)}
                                className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors group"
                            >
                                <div className="text-slate-400 group-hover:text-brand-purple">{item.icon}</div>
                                <span>Go to {item.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="bg-slate-50 px-4 py-2 text-xs text-slate-400 border-t border-slate-100 flex justify-between">
                        <span>Use arrow keys to navigate</span>
                        <span>ESC to close</span>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
