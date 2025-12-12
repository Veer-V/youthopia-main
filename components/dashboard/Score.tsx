
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ClipboardList, Trophy, Star, Target } from 'lucide-react';

interface ScoreProps {
  bonus: number;
  registeredEventIds?: string[];
  userPoints?: number;
  userBonus?: number;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const Score: React.FC<ScoreProps> = ({ bonus, registeredEventIds = [], userPoints = 0, userBonus = 0 }) => {
  const eventCount = registeredEventIds.length;
  const totalPoints = userPoints + userBonus;

  // Performance data with detailed breakdown
  const scores: { title: string; score: number; color: string }[] = [
    { title: "Base Points", score: userPoints, color: "bg-blue-500" },
    { title: "Bonus Points", score: userBonus, color: "bg-brand-yellow" },
    { title: "Events Participated", score: eventCount, color: "bg-brand-purple" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Score Board</h2>

      {/* Total Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-dark to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-brand-purple/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start text-brand-yellow font-bold uppercase tracking-wider text-sm mb-2">
              <Trophy size={16} /> Overall Standing
            </div>
            <h3 className="text-6xl font-black mb-1">
              <AnimatedCounter value={totalPoints} />
            </h3>
            <p className="text-slate-400">Total Festival Points</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-[100px]">
              <div className="text-2xl font-bold text-brand-pink mb-1">
                {totalPoints > 500 ? 'Top 10%' : totalPoints > 200 ? 'Top 30%' : '--'}
              </div>
              <div className="text-xs text-slate-300">Rank</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-[100px]">
              <div className="text-2xl font-bold text-brand-purple mb-1">
                {Math.min(100, Math.round(totalPoints / 10))}%
              </div>
              <div className="text-xs text-slate-300">Progress</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><ClipboardList size={24} /></div>
          <div>
            <h3 className="font-bold text-lg">Event Performance Breakdown</h3>
            <p className="text-slate-500 text-sm">Detailed scores from participated events</p>
          </div>
        </div>

        <div className="space-y-6">
          {scores.length > 0 ? scores.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm text-slate-700">{item.title}</span>
                <span className="font-bold text-sm text-slate-900">{item.score}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: item.title === "Events Participated"
                      ? `${Math.min(100, (item.score / 20) * 100)}%`
                      : item.title === "Base Points"
                        ? `${Math.min(100, (item.score / 1000) * 100)}%`
                        : `${Math.min(100, (item.score / 1000) * 100)}%` // For Bonus Points
                  }}
                  transition={{ duration: 1.5, delay: idx * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`${item.color} h-3 rounded-full relative overflow-hidden`}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                  />
                </motion.div>
              </div>
            </div>
          )) : (
            <p className="text-slate-400 text-center py-8">No performance data available yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Score;
