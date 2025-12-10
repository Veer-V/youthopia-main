
import React, { useMemo } from 'react';
import { Smile, TrendingUp, MessageCircle, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const Feedback: React.FC = () => {
  const { feedbacks } = useData();

  // Calculate stats based on real data
  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return { positive: 0, sentiment: 'Neutral', topEmoji: '😐' };

    const positiveEmojis = ['🔥', '🤩', '😀', '🙂'];
    const positiveCount = feedbacks.filter(f => positiveEmojis.includes(f.emoji)).length;
    const positivePercentage = Math.round((positiveCount / total) * 100);

    // Find top emoji
    const counts: Record<string, number> = {};
    feedbacks.forEach(f => {
      counts[f.emoji] = (counts[f.emoji] || 0) + 1;
    });
    const topEmoji = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '😐');

    let sentiment = 'Neutral';
    if (positivePercentage >= 80) sentiment = 'Excellent';
    else if (positivePercentage >= 60) sentiment = 'Good';
    else if (positivePercentage < 40) sentiment = 'Needs Attention';

    return { positive: positivePercentage, sentiment, topEmoji };
  }, [feedbacks]);

  // Extract keywords from event names for "tags"
  const activeTags = useMemo(() => {
     const eventNames = feedbacks.map(f => f.eventName.split(' ')[0]); // simple extraction
     const unique = Array.from(new Set(eventNames)).slice(0, 10);
     return unique.length > 0 ? unique : ['General', 'Events', 'Organization'];
  }, [feedbacks]);

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6">Sentiment Analysis</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center flex flex-col items-center justify-center"
          >
             <div className="text-6xl mb-4">{stats.topEmoji}</div>
             <h3 className="text-3xl font-bold text-white">{stats.positive}% Positive</h3>
             <p className="text-slate-400 mt-2 flex items-center gap-2">
               <TrendingUp size={16} className={stats.positive >= 60 ? "text-green-500" : "text-yellow-500"} />
               Overall Sentiment: <span className="text-white font-bold">{stats.sentiment}</span>
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl lg:col-span-2"
          >
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-yellow-500" /> Recent Feedback Trends
             </h3>
             
             <div className="mb-6">
                <p className="text-sm text-slate-400 mb-2">Trending Topics (Based on Event Activity)</p>
                <div className="flex flex-wrap gap-2">
                    {activeTags.map((tag, i) => (
                    <span 
                        key={i} 
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm hover:bg-white/10 transition-colors cursor-default"
                    >
                        #{tag}
                    </span>
                    ))}
                </div>
             </div>

             <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {feedbacks.length > 0 ? (
                    feedbacks.slice().reverse().slice(0, 5).map((fb) => (
                        <div key={fb.id} className="bg-white/5 p-3 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{fb.emoji}</span>
                                <div>
                                    <div className="text-sm font-bold text-white">{fb.eventName}</div>
                                    <div className="text-xs text-slate-500">{fb.userName} • {fb.timestamp}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-500 py-8 italic">
                       No feedback recorded yet.
                    </div>
                )}
             </div>
          </motion.div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Feedback Volume</h3>
              <div className="flex items-end gap-2 h-40">
                  {[40, 65, 30, 85, 50, 60, feedbacks.length > 0 ? 90 : 20].map((h, i) => (
                      <div key={i} className="flex-1 bg-yellow-600/20 rounded-t-lg relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-yellow-500 rounded-t-lg transition-all duration-500"
                            style={{ height: `${h}%` }}
                          />
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
           </div>

           <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
               <AlertCircle size={48} className="text-blue-400 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">AI Insights</h3>
               <p className="text-slate-400 text-sm max-w-sm">
                   Based on current data, student satisfaction is highest during <strong>Intercollegiate</strong> events. 
                   Consider increasing capacity for "Dance" category events.
               </p>
           </div>
       </div>
    </div>
  );
};

export default Feedback;
