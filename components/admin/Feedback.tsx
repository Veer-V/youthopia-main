
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Award, ThumbsUp } from 'lucide-react';
import { SimpleBarChart } from './Charts';
import { useData } from '../../contexts/DataContext';

const Feedback: React.FC = () => {
   const { feedbacks, spinFeedbacks } = useData();
   const [activeTab, setActiveTab] = useState<'events' | 'spins'>('events');

   // Calculate live ratings from real data (Event Feedback)
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

   // Calculate spin feedback statistics
   const spinStats = useMemo(() => {
      if (spinFeedbacks.length === 0) {
         return {
            avgRating: 0,
            totalResponses: 0,
            recommendYes: 0,
            recommendMaybe: 0,
            recommendNo: 0,
            aspectCounts: {} as Record<string, number>
         };
      }

      const totalRating = spinFeedbacks.reduce((sum, f) => sum + f.rating, 0);
      const avgRating = totalRating / spinFeedbacks.length;

      const recommendCounts = { Yes: 0, Maybe: 0, No: 0 };
      const aspectCounts: Record<string, number> = {};

      spinFeedbacks.forEach(f => {
         recommendCounts[f.wouldRecommend]++;
         aspectCounts[f.favoriteAspect] = (aspectCounts[f.favoriteAspect] || 0) + 1;
      });

      return {
         avgRating,
         totalResponses: spinFeedbacks.length,
         recommendYes: recommendCounts.Yes,
         recommendMaybe: recommendCounts.Maybe,
         recommendNo: recommendCounts.No,
         aspectCounts
      };
   }, [spinFeedbacks]);

   // Use real items for feed
   const feedItems = feedbacks.slice().reverse().slice(0, 50); // Show last 50
   const spinFeedItems = spinFeedbacks.slice().reverse().slice(0, 50);

   const sentimentData = [20, 45, 60, 80, 50, 65, 30]; // Keep chart static for now as historical data tracking is complex
   const sentimentLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Feedback Analytics</h2>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
               <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'events'
                     ? 'bg-white text-brand-purple shadow-sm'
                     : 'text-slate-500 hover:text-slate-700'
                     }`}
               >
                  Event Feedback
               </button>
               <button
                  onClick={() => setActiveTab('spins')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'spins'
                     ? 'bg-white text-brand-purple shadow-sm'
                     : 'text-slate-500 hover:text-slate-700'
                     }`}
               >
                  Spin Feedback ({spinFeedbacks.length})
               </button>
            </div>
         </div>

         {activeTab === 'events' ? (
            <>
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
            </>
         ) : (
            <>
               {/* Spin Feedback Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                  >
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                           <Star className="text-yellow-600" size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-slate-500 font-medium">Average Rating</p>
                           <h3 className="text-3xl font-bold text-slate-900">
                              {spinStats.avgRating.toFixed(1)} <span className="text-lg text-slate-400">/5</span>
                           </h3>
                        </div>
                     </div>
                     <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                              key={star}
                              size={16}
                              className={star <= Math.round(spinStats.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                           />
                        ))}
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.1 }}
                     className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                  >
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                           <ThumbsUp className="text-green-600" size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-slate-500 font-medium">Would Recommend</p>
                           <h3 className="text-3xl font-bold text-slate-900">
                              {spinStats.totalResponses > 0
                                 ? Math.round((spinStats.recommendYes / spinStats.totalResponses) * 100)
                                 : 0}%
                           </h3>
                        </div>
                     </div>
                     <div className="flex gap-2 text-xs mt-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                           👍 {spinStats.recommendYes}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">
                           🤔 {spinStats.recommendMaybe}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold">
                           👎 {spinStats.recommendNo}
                        </span>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                  >
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                           <Award className="text-purple-600" size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-slate-500 font-medium">Total Responses</p>
                           <h3 className="text-3xl font-bold text-slate-900">{spinStats.totalResponses}</h3>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 mt-2">
                        Most loved: <span className="font-bold text-slate-600">
                           {Object.keys(spinStats.aspectCounts).length > 0
                              ? Object.entries(spinStats.aspectCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0][0]
                              : 'N/A'}
                        </span>
                     </p>
                  </motion.div>
               </div>

               {/* Spin Feedback Table */}
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                     <h3 className="font-bold text-slate-800">Recent Spin Feedback</h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-slate-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Favorite Aspect</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Recommend</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Prize</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Time</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {spinFeedItems.length > 0 ? spinFeedItems.map((feedback) => (
                              <motion.tr
                                 key={feedback.id}
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 className="hover:bg-slate-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">{feedback.userName}</p>
                                       <p className="text-xs text-slate-500">{feedback.userEmail}</p>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                       {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                             key={star}
                                             size={14}
                                             className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                                          />
                                       ))}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                       {feedback.favoriteAspect}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${feedback.wouldRecommend === 'Yes' ? 'bg-green-100 text-green-700' :
                                       feedback.wouldRecommend === 'Maybe' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-red-100 text-red-700'
                                       }`}>
                                       {feedback.wouldRecommend}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-brand-orange">+{feedback.prizeAmount}</span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="text-xs text-slate-500">{feedback.timestamp}</span>
                                 </td>
                              </motion.tr>
                           )) : (
                              <tr>
                                 <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                    No spin feedback received yet
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default Feedback;
