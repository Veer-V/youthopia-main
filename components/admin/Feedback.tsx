
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Award, ThumbsUp, MessageSquare, ListFilter } from 'lucide-react';
// import { SimpleBarChart } from './Charts'; // Removed usage if not needed for spin or kept for events
import { useData } from '../../contexts/DataContext';

import * as XLSX from 'xlsx';

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
      const categoryCounts: Record<string, number> = {};

      spinFeedbacks.forEach(f => {
         const cat = f.category || 'Unknown';
         categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      return {
         totalResponses: spinFeedbacks.length,
         categoryCounts
      };
   }, [spinFeedbacks]);

   const formatAnswer = (ans: any) => {
      if (Array.isArray(ans)) return ans.join(', ');
      if (typeof ans === 'object' && ans !== null) {
         return Object.entries(ans).map(([k, v]) => `${k}: ${v}`).join('; ');
      }
      return String(ans);
   };

   // Use real items for feed
   const feedItems = feedbacks.slice().reverse().slice(0, 50); // Show last 50
   const spinFeedItems = spinFeedbacks.slice().reverse().slice(0, 50);

   const handleExport = () => {
      let dataToExport: any[] = [];
      let sheetName = '';

      if (activeTab === 'events') {
         sheetName = 'Event_Feedback';
         dataToExport = feedbacks.map(f => ({
            'Event Name': f.eventName,
            'User Name': f.userName,
            'Email': f.userEmail,
            'Emoji': f.emoji,
            'Time': f.timestamp
         }));
      } else {
         sheetName = 'Spin_Feedback';
         dataToExport = spinFeedbacks.map(f => {
            // Flatten responses
            const base = {
               'User Name': f.userName,
               'Email': f.userEmail,
               'Category': f.category || 'Feedback',
               'Prize': f.prizeAmount,
               'Time': f.timestamp
            };

            // Add questions as columns
            const dynamicQs: any = {};
            if (f.responses) {
               f.responses.forEach((r, idx) => {
                  dynamicQs[`Question ${idx + 1}`] = r.questionText;
                  dynamicQs[`Answer ${idx + 1}`] = formatAnswer(r.answer);
               });
            }
            return { ...base, ...dynamicQs };
         });
      }

      if (dataToExport.length === 0) {
         alert("No data to export");
         return;
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`);
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Feedback Analytics</h2>

            <div className="flex gap-2">
               {/* Export Button */}
               <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
               >
                  Export to Excel
               </button>

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
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 md:col-span-1"
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
                  </motion.div>

                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.1 }}
                     className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 md:col-span-3"
                  >
                     <h4 className="text-sm text-slate-500 font-medium mb-2">Responses by Category</h4>
                     <div className="flex flex-wrap gap-2">
                        {Object.entries(spinStats.categoryCounts).map(([cat, count], i) => (
                           <div key={i} className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-600">{cat}</span>
                              <span className="bg-brand-purple text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               </div>

               {/* Spin Feedback Table */}
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                  <div className="p-6 border-b border-slate-100">
                     <h3 className="font-bold text-slate-800">Recent Spin Feedback</h3>
                  </div>
                  <div className="min-w-full">
                     <table className="w-full">
                        <thead className="bg-slate-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Responses</th>
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
                                 <td className="px-6 py-4 align-top">
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">{feedback.userName}</p>
                                       <p className="text-xs text-slate-500">{feedback.userEmail}</p>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 align-top">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold whitespace-nowrap">
                                       {feedback.category || 'Feedback'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="space-y-3">
                                       {feedback.responses?.map((r, idx) => (
                                          <div key={idx} className="text-sm">
                                             <p className="text-slate-500 text-xs mb-0.5">{r.questionText}</p>
                                             <p className="font-medium text-slate-800">{formatAnswer(r.answer)}</p>
                                          </div>
                                       ))}
                                       {(!feedback.responses || feedback.responses.length === 0) && (
                                          <span className="text-slate-400 italic text-xs">No detail responses</span>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 align-top">
                                    <span className="text-sm font-bold text-brand-orange">+{feedback.prizeAmount}</span>
                                 </td>
                                 <td className="px-6 py-4 align-top">
                                    <div className="flex items-center text-xs text-slate-500 whitespace-nowrap">
                                       {feedback.timestamp}
                                    </div>
                                 </td>
                              </motion.tr>
                           )) : (
                              <tr>
                                 <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
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
      </div >
   );
};

export default Feedback;
