
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { SimpleBarChart } from './Charts';
import { useData } from '../../contexts/DataContext';

const Feedback: React.FC = () => {
  const { feedbacks } = useData();

  // Calculate live ratings from real data
  const ratings = useMemo(() => {
     const counts: Record<string, number> = { '🔥': 0, '🤩': 0, '😀': 0, '🙂': 0, '😐': 0 };
     feedbacks.forEach(f => {
         if (counts[f.emoji] !== undefined) {
             counts[f.emoji]++;
         }
     });

     return [
        { emoji: '🔥', count: counts['🔥'], label: 'On Fire', color: 'bg-orange-100 text-orange-600' },
        { emoji: '🤩', count: counts['🤩'], label: 'Amazing', color: 'bg-yellow-100 text-yellow-600' },
        { emoji: '😀', count: counts['😀'], label: 'Happy', color: 'bg-green-100 text-green-600' },
        { emoji: '🙂', count: counts['🙂'], label: 'Good', color: 'bg-blue-100 text-blue-600' },
        { emoji: '😐', count: counts['😐'], label: 'Neutral', color: 'bg-slate-100 text-slate-600' },
     ];
  }, [feedbacks]);

  // Use real items for feed
  const feedItems = feedbacks.slice().reverse().slice(0, 50); // Show last 50

  const sentimentData = [20, 45, 60, 80, 50, 65, 30]; // Keep chart static for now as historical data tracking is complex
  const sentimentLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Feedback Analytics</h2>

      {/* Mood Meter */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
         {ratings.map((rating, i) => (
           <motion.div 
             key={i}
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col items-center"
           >
              <div className="text-4xl mb-4">{rating.emoji}</div>
              <h3 className="text-2xl font-bold text-slate-900">{rating.count}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full mt-2 ${rating.color}`}>
                 {rating.label}
              </span>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart Area */}
         <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="font-bold text-slate-800 mb-6">Happiness Trend</h3>
            <div className="flex-1 w-full px-4 pb-4">
               <SimpleBarChart data={sentimentData} labels={sentimentLabels} color="bg-gradient-to-t from-yellow-400 to-orange-400" />
            </div>
         </div>

         {/* Recent Feed */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Live Feed</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                    {feedItems.length} Total
                </span>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
               <AnimatePresence>
               {feedItems.length > 0 ? feedItems.map((fb) => (
                 <motion.div 
                   key={fb.id}
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -20, opacity: 0, height: 0 }}
                   className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 group hover:bg-slate-100 transition-colors"
                 >
                    <div className="text-2xl bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                       {fb.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 truncate">{fb.eventName}</p>
                       <p className="text-xs text-slate-500 truncate">by {fb.userName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium">{fb.timestamp}</span>
                    </div>
                 </motion.div>
               )) : (
                 <div className="text-center text-slate-400 py-10">
                    <p>No feedback received yet</p>
                 </div>
               )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Feedback;
