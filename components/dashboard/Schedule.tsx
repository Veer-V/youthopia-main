
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Calendar, Filter } from 'lucide-react';
import Input from '../Input';
import { useData } from '../../contexts/DataContext';

interface ScheduleProps {
    registeredEventIds: string[];
}

const Schedule: React.FC<ScheduleProps> = ({ registeredEventIds }) => {
  const { events } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyEvents, setShowMyEvents] = useState(false);

  // Map the shared events to the schedule structure
  // For demo, we assume status is 'Upcoming' unless specifically overridden
  const scheduleItems = events.map(evt => ({
      ...evt,
      status: 'Upcoming', 
      color: evt.category === 'Intercollegiate' ? 'bg-brand-purple' : 'bg-brand-pink'
  }));

  const filteredSchedule = scheduleItems.filter(item => {
    // 1. Text Search
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.status.toLowerCase().includes(searchQuery.toLowerCase());
    // 2. My Events Filter
    const matchesMyEvents = showMyEvents ? registeredEventIds.includes(item.id) : true;

    return matchesSearch && matchesMyEvents;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Live Now':
        return 'bg-white border-brand-pink ring-4 ring-brand-pink/10 shadow-lg shadow-brand-pink/5';
      case 'Completed':
        return 'bg-slate-50 border-slate-200 opacity-60 grayscale-[0.5]';
      default: // Upcoming
        return 'bg-white border-slate-100';
    }
  };

  const getBadgeStyles = (status: string) => {
      switch (status) {
        case 'Live Now':
          return 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30 animate-pulse';
        case 'Completed':
          return 'bg-slate-200 text-slate-500';
        default:
          return 'bg-blue-50 text-blue-600';
      }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Your Schedule</h2>
           <p className="text-slate-500 text-sm mt-1">Track events across the festival timeline.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <span className={`text-sm font-bold ${showMyEvents ? 'text-brand-purple' : 'text-slate-500'}`}>My Events Only</span>
                <button 
                  onClick={() => setShowMyEvents(!showMyEvents)}
                  className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${showMyEvents ? 'bg-brand-purple' : 'bg-slate-300'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showMyEvents ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="w-full md:w-64">
                <Input 
                    variant="light"
                    placeholder="Search schedule..."
                    icon={<Search size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>
      
      {filteredSchedule.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 relative pl-6 border-l-2 border-slate-200 ml-4 md:ml-0"
        >
           {filteredSchedule.map((evt, i) => (
             <motion.div 
                key={i} 
                variants={item} 
                className="relative group"
                whileHover="hover"
             >
                {/* Timeline Dot */}
                <motion.div 
                  className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${evt.color}`}
                  variants={{
                    hover: { scale: 1.5 }
                  }}
                >
                   {/* Ripple effect on hover */}
                   <motion.div 
                      className={`absolute inset-0 rounded-full opacity-50 ${evt.color}`}
                      variants={{
                        hover: { scale: 2, opacity: 0 }
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                   />
                </motion.div>
                
                <motion.div 
                   className={`p-5 rounded-2xl border transition-all duration-300 ${getStatusStyles(evt.status)}`}
                   variants={{
                     hover: { x: 8, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }
                   }}
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                     <span className={`text-sm font-bold flex items-center gap-2 ${evt.status === 'Completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Clock size={16} /> {evt.date}, {evt.time}
                     </span>
                     <span className={`self-start md:self-auto text-xs font-bold px-3 py-1 rounded-full ${getBadgeStyles(evt.status)}`}>
                       {evt.status}
                     </span>
                   </div>
                   <h3 className={`text-lg font-bold ${evt.status === 'Completed' ? 'text-slate-500' : 'text-slate-800'}`}>
                      {evt.title}
                   </h3>
                </motion.div>
             </motion.div>
           ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
           <Calendar size={48} className="mx-auto mb-4 opacity-20" />
           <p>No schedule items found matching criteria.</p>
           {showMyEvents && <p className="text-sm mt-2">Try registering for events in the "Activities" tab!</p>}
        </div>
      )}
    </div>
  );
};

export default Schedule;
