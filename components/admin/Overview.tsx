
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SimpleLineChart } from './Charts';
import { useData } from '../../contexts/DataContext';

const Overview: React.FC = () => {
  const { users, registrations, events } = useData();

  const totalStudents = users.filter(u => u.role === 'student').length;
  // Explicitly cast curr to string[] to avoid TS unknown type errors
  const totalRegistrations = Object.values(registrations).reduce((acc, curr) => acc + (curr as string[]).length, 0);
  const totalBonus = users.reduce((acc, u) => acc + (u.bonus || 0), 0);
  
  // Real-time Stats
  const stats = [
    { 
      label: 'Total Students', 
      value: totalStudents.toString(), 
      icon: <Users className="text-blue-600" size={24} />, 
      change: '+100%', 
      trend: 'up',
      bg: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Event Registrations', 
      value: totalRegistrations.toString(), 
      icon: <Calendar className="text-purple-600" size={24} />, 
      change: '+100%', 
      trend: 'up',
      bg: 'bg-purple-50 text-purple-600'
    },
    { 
      label: 'Bonus Economy', 
      value: totalBonus.toLocaleString(), 
      icon: <Trophy className="text-yellow-600" size={24} />, 
      change: '+5%', 
      trend: 'up',
      bg: 'bg-yellow-50 text-yellow-600'
    },
    { 
      label: 'Active Events', 
      value: events.length.toString(), 
      icon: <Activity className="text-green-600" size={24} />, 
      change: '0%', 
      trend: 'up',
      bg: 'bg-green-50 text-green-600'
    },
  ];

  const trafficData = [10, 25, 40, 35, 50, 45, 60, 80, 75, 90];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
           <p className="text-slate-500 text-sm">Real-time insights into student activities and festival performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
           </span>
           <div className="text-sm font-bold text-slate-700">System Live</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                   {stat.change}
                </div>
             </div>
             <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
             <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
             
             {/* Decor */}
             <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none scale-150 grayscale">
                {stat.icon}
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Area */}
         <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <TrendingUp size={20} className="text-brand-purple" /> Traffic & Engagement
               </h3>
               <div className="flex gap-2">
                 <button className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Daily</button>
                 <button className="px-3 py-1 text-xs font-bold bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50">Weekly</button>
               </div>
            </div>
            
            <div className="flex-1 w-full px-2">
               <SimpleLineChart data={trafficData} color="#8b5cf6" />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400 mt-4 px-2 font-mono">
               <span>08:00</span>
               <span>12:00</span>
               <span>16:00</span>
               <span>20:00</span>
               <span>00:00</span>
            </div>
         </motion.div>

         {/* Recent Student Activity */}
         <motion.div variants={item} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Activity size={20} className="text-brand-orange" /> Recent Activity
            </h3>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
               {users.slice(0, 5).map((user, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                       <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                               {user.name.charAt(0)}
                           </div>
                           <div>
                               <div className="text-sm font-bold text-slate-800">{user.name}</div>
                               <div className="text-xs text-slate-500">Registered</div>
                           </div>
                       </div>
                       <span className="text-xs text-slate-400">Just now</span>
                   </div>
               ))}
               {users.length === 0 && <p className="text-center text-slate-400 py-10">No recent activity.</p>}
            </div>
            <button className="mt-auto w-full py-3 text-sm font-bold text-slate-500 hover:text-brand-purple border-t border-slate-100 transition-colors">
               View Full Activity Log
            </button>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
