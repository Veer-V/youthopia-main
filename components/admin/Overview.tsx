
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Overview: React.FC = () => {
  const { users, registrations, events } = useData();

  const totalStudents = users.filter(u => u.role === 'student').length;
  // Explicitly type the accumulator to avoid TS unknown type errors
  const totalRegistrations = Object.values(registrations).reduce((acc: number, curr) => acc + (curr as string[]).length, 0);
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
    </motion.div>
  );
};

export default Overview;
