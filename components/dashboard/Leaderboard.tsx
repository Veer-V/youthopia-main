
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, Medal, Crown, Star, Zap, List, BarChart3 } from 'lucide-react';
import Input from '../Input';
import { useData } from '../../contexts/DataContext';

interface LeaderboardProps {
  bonus?: number;
}

type Category = 'All' | 'Champion' | 'Expert' | 'Pro' | 'Beginner';
type ViewMode = 'list' | 'graph';

const Leaderboard: React.FC<LeaderboardProps> = ({ bonus = 0 }) => {
  const { users } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const categories: Category[] = ['All', 'Champion', 'Expert', 'Pro', 'Beginner'];

  // Helper to determine category based on bonus points
  const getCategory = (pts: number): Category => {
    if (pts >= 700) return 'Champion';
    if (pts >= 451) return 'Expert';
    if (pts >= 301) return 'Pro';
    // Covers 150-300 and falls back for <150
    return 'Beginner'; 
  };

  // Convert Context Users to Leaders List
  const leaders = users
    .filter(u => u.role === 'student')
    .map(u => ({
        name: u.name,
        points: u.bonus || 0,
        school: u.school,
        category: getCategory(u.bonus || 0)
    }));

  // Sort by points descending
  const sortedLeaders = [...leaders].sort((a, b) => b.points - a.points);

  // Assign Ranks
  const rankedLeaders = sortedLeaders.map((l, index) => ({
      ...l,
      rank: index + 1
  }));

  // Calculate counts for badges
  const categoryCounts = useMemo(() => {
     const counts: Record<string, number> = { All: rankedLeaders.length };
     rankedLeaders.forEach(l => {
         counts[l.category] = (counts[l.category] || 0) + 1;
     });
     return counts;
  }, [rankedLeaders]);

  // Filter Logic
  const filteredLeaders = rankedLeaders.filter(l => {
    // 1. Text Search
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category Filter
    const matchesCategory = activeCategory === 'All' || l.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: Category) => {
      switch(cat) {
          case 'Champion': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
          case 'Expert': return 'text-purple-600 bg-purple-100 border-purple-200';
          case 'Pro': return 'text-blue-600 bg-blue-100 border-blue-200';
          case 'Beginner': return 'text-green-600 bg-green-100 border-green-200';
          default: return 'text-slate-600 bg-slate-100 border-slate-200';
      }
  };

  const getCategoryIcon = (cat: Category) => {
      switch(cat) {
          case 'Champion': return <Crown size={14} />;
          case 'Expert': return <Medal size={14} />;
          case 'Pro': return <Star size={14} />;
          case 'Beginner': return <Zap size={14} />;
          default: return null;
      }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  // Logic for Graph Scaling
  const maxGraphPoints = Math.max(...filteredLeaders.map(l => l.points), 100);
  const graphData = filteredLeaders.slice(0, 10); // Show top 10 in graph mode to fit screen

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Leaderboard</h2>
            <p className="text-slate-500 text-sm mt-1">See where you stand among the legends.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="List View"
                >
                    <List size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('graph')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Graph View"
                >
                    <BarChart3 size={20} />
                </button>
            </div>

            <div className="w-full md:w-64">
                <Input 
                    variant="light"
                    placeholder="Search student..."
                    icon={<Search size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
      </div>

      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 overflow-hidden ${
                   activeCategory === cat 
                     ? 'border-transparent text-white shadow-lg shadow-brand-purple/20' 
                     : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
               }`}
             >
                {activeCategory === cat && (
                   <motion.div
                     layoutId="activeCategory"
                     className="absolute inset-0 bg-brand-purple"
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                )}
                {/* Ensure text is on top with z-10 */}
                <span className="relative z-10 flex items-center gap-2">
                    {cat !== 'All' && getCategoryIcon(cat)}
                    {cat}
                </span>
                <span className={`relative z-10 text-[10px] py-0.5 px-1.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {categoryCounts[cat] || 0}
                </span>
             </button>
          ))}
      </div>
      
      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
             key="list-view"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]"
          >
            <div className="bg-slate-50 p-4 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 sticky top-0 z-10">
               <div className="col-span-2 text-center">Rank</div>
               <div className="col-span-6 md:col-span-5">Student</div>
               <div className="col-span-4 md:col-span-3 text-right">Bonus</div>
               <div className="hidden md:block md:col-span-2 text-center">Tier</div>
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              key={activeCategory + searchQuery} 
              className="divide-y divide-slate-100"
            >
               {filteredLeaders.length > 0 ? (
                 filteredLeaders.map((l) => (
                    <motion.div 
                        key={l.name}
                        variants={item}
                        whileHover={{ 
                            scale: 1.005, 
                            backgroundColor: "rgba(248, 250, 252, 1)",
                        }}
                        className="grid grid-cols-12 p-4 items-center cursor-default transition-colors"
                    >
                        <div className="col-span-2 text-center font-bold text-lg text-slate-400">
                            {l.rank === 1 ? <span className="text-2xl">🥇</span> : l.rank === 2 ? <span className="text-2xl">🥈</span> : l.rank === 3 ? <span className="text-2xl">🥉</span> : `#${l.rank}`}
                        </div>
                        <div className="col-span-6 md:col-span-5">
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                                {l.name} 
                            </div>
                            <div className="text-xs text-slate-500">{l.school}</div>
                        </div>
                        <div className="col-span-4 md:col-span-3 text-right font-bold text-brand-purple text-lg">{l.points}</div>
                        <div className="hidden md:flex md:col-span-2 justify-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border flex items-center gap-1 ${getCategoryColor(l.category!)}`}>
                                {getCategoryIcon(l.category!)}
                                {l.category}
                            </span>
                        </div>
                    </motion.div>
                 ))
               ) : (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center text-slate-400 flex flex-col items-center"
                 >
                   <Trophy size={48} className="mb-4 opacity-20" />
                   <p>No students found in this category.</p>
                 </motion.div>
               )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
             key="graph-view"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.98 }}
             className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[400px] flex items-end justify-center md:justify-around gap-2 md:gap-6 overflow-x-auto pb-12"
          >
             <div className="flex items-end justify-center md:justify-around gap-2 md:gap-6 w-full h-[250px] relative">
             {graphData.length > 0 ? graphData.map((l, index) => {
                const heightPercentage = (l.points / maxGraphPoints) * 100;
                const isTop3 = index < 3;
                
                // Colors for top 3 bars
                let barColor = 'bg-slate-200';
                if (index === 0) barColor = 'bg-gradient-to-t from-yellow-400 to-yellow-300';
                else if (index === 1) barColor = 'bg-gradient-to-t from-slate-300 to-slate-200';
                else if (index === 2) barColor = 'bg-gradient-to-t from-orange-300 to-orange-200';

                return (
                   <div key={l.name} className="flex flex-col items-center justify-end gap-2 group relative w-12 md:w-20 shrink-0 h-full">
                      {/* Points Tooltip */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="font-bold text-slate-800 text-xs md:text-sm mb-1"
                      >
                         {l.points}
                      </motion.div>

                      {/* Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(heightPercentage, 5)}%` }} // Minimum height for visibility
                        transition={{ type: "spring", damping: 20, stiffness: 100, delay: index * 0.1 }}
                        className={`w-full rounded-t-xl relative ${barColor} group-hover:brightness-110 transition-all shadow-sm`}
                      >
                         {/* Rank Badge inside Bar */}
                         {isTop3 && (
                             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-lg drop-shadow-sm">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                             </div>
                         )}
                      </motion.div>

                      {/* Name Label */}
                      <div className="absolute -bottom-12 text-center w-24">
                          <div className="text-xs md:text-sm font-bold truncate text-slate-600">
                             {l.name.split(' ')[0]}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate hidden md:block">{l.school}</div>
                      </div>
                   </div>
                );
             }) : (
                <div className="w-full text-center text-slate-400 py-20 flex flex-col items-center absolute inset-0 justify-center">
                   <BarChart3 size={48} className="mb-4 opacity-20" />
                   <p>No data to visualize for this category.</p>
                </div>
             )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legend / Info */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-center gap-3">
             <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Crown size={16} /></div>
             <div>
                 <div className="text-xs text-yellow-800 font-bold uppercase">Champion</div>
                 <div className="text-xs text-yellow-600">700+ Bonus</div>
             </div>
         </div>
         <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex items-center gap-3">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Medal size={16} /></div>
             <div>
                 <div className="text-xs text-purple-800 font-bold uppercase">Expert</div>
                 <div className="text-xs text-purple-600">451 - 699 Bonus</div>
             </div>
         </div>
         <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Star size={16} /></div>
             <div>
                 <div className="text-xs text-blue-800 font-bold uppercase">Pro</div>
                 <div className="text-xs text-blue-600">301 - 450 Bonus</div>
             </div>
         </div>
         <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
             <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Zap size={16} /></div>
             <div>
                 <div className="text-xs text-green-800 font-bold uppercase">Beginner</div>
                 <div className="text-xs text-green-600">0 - 300 Bonus</div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
