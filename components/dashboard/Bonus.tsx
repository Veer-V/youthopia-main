
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Lock, ChevronRight, CircleCheck, CircleAlert, Award } from 'lucide-react';
import Button from '../Button';
import SpinFeedbackModal from './SpinFeedbackModal';
import { useData } from '@/contexts/DataContext';

interface BonusProps {
  bonus: number;
  onAddBonus: (amount: number) => void;
  spinsAvailable: number;
  eventsCount: number;
  onSpinUsed: (points: number) => void;
  onNavigateToRedeem: () => void;
  userName: string;
  userEmail: string;
  onSubmitFeedback: (rating: number, favoriteAspect: string, wouldRecommend: string, prizeAmount: number) => void;
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

const Bonus: React.FC<BonusProps> = ({ bonus, onAddBonus, spinsAvailable, eventsCount, onSpinUsed, onNavigateToRedeem, userName, userEmail, onSubmitFeedback }) => {
  const { user, events } = useData();
  const displayBonus = user?.points || bonus || 0;

  // Filter for Engagement events only
  const registeredEventsCount = React.useMemo(() => {
    if (!user?.registered) return 0;

    // Get list of registered IDs
    let regIds: string[] = [];
    if (Array.isArray(user.registered)) {
      regIds = user.registered.map((r: any) => typeof r === 'string' ? r : (r._id || r.id));
    } else if (typeof user.registered === 'object') {
      regIds = Object.keys(user.registered);
    }

    // Count how many match an 'Engagement' event
    return regIds.filter(id => {
      const evt = events.find(e => e.id === id || e._id === id);
      return evt?.category === 'Engagement';
    }).length;
  }, [user, events]);

  const spinThreshold = 4;
  const earnedSpins = Math.floor(registeredEventsCount / spinThreshold);

  // Use backend 'spinsAvailable' as source of truth if it exists, otherwise fallback to calculated
  const displaySpins = user?.spinsAvailable !== undefined ? user.spinsAvailable : earnedSpins;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Game Flow States
  const [pendingPrize, setPendingPrize] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Wheel Segments: 8 segments, 45 degrees each
  // Values: 10, 20, 30, 40 repeated twice
  const segments = [10, 20, 30, 40, 10, 20, 30, 40];
  const segmentColors = ['#facc15', '#fbbf24', '#ec4899', '#8b5cf6', '#facc15', '#fbbf24', '#ec4899', '#8b5cf6'];
  const sliceAngle = 360 / segments.length;

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSpin = () => {
    if (isSpinning || displaySpins <= 0) return;
    setIsSpinning(true);
    // onSpinUsed(); // Moved to feedback submit as per request

    // Random spin
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 5));
    const randomOffset = Math.random() * (sliceAngle - 2) + 1;
    const targetRotation = extraRotations + (360 - (randomSegmentIndex * sliceAngle)) - (sliceAngle / 2) + randomOffset;

    setRotation(rotation + targetRotation);

    // Faster spin: 2.5s duration
    setTimeout(() => {
      const prize = segments[randomSegmentIndex];
      setPendingPrize(prize);
      setIsSpinning(false);

      // Show feedback modal instead of awarding points immediately
      setShowFeedbackModal(true);
    }, 2500);
  };

  const handleFeedbackSubmit = (rating: number, favoriteAspect: string, wouldRecommend: string) => {
    // Submit feedback
    onSubmitFeedback(rating, favoriteAspect, wouldRecommend, pendingPrize);

    // Call spin point endpoint (consume spin / transaction)
    onSpinUsed(pendingPrize);

    // Close feedback modal
    setShowFeedbackModal(false);

    // Show success toast and result
    setToast({ message: `Hooray! You won ${pendingPrize} Bonus Points!`, type: 'success' });
    setShowResult(true);
  };

  // const spinThreshold = 4; // Already defined above
  const progressToNextSpin = (registeredEventsCount % spinThreshold) / spinThreshold * 100;
  const eventsNeeded = spinThreshold - (registeredEventsCount % spinThreshold);

  return (
    <div className="space-y-12">
      {/* Header Bonus Display */}
      <div className="text-center pt-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative inline-block"
        >
          <motion.div
            key={displayBonus}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center bg-white shadow-xl relative overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-tr from-yellow-50 via-white to-transparent opacity-50"
            />
            <div className="relative z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow"
              >
                <AnimatedCounter value={displayBonus} />
              </motion.div>
              <div className="text-slate-400 font-semibold mt-1">Total Bonus</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Spin The Wheel Game Section */}
      <div className="max-w-md mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1b4b] rounded-3xl p-6 shadow-2xl border-4 border-[#312e81] relative overflow-hidden"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full" />
            <div className="absolute bottom-20 right-10 w-6 h-6 bg-pink-500 rounded-full" />
            <div className="absolute top-1/2 left-4 w-3 h-3 bg-purple-500 rounded-full" />
            <div className="absolute top-4 right-1/2 w-2 h-2 bg-blue-400 rounded-full" />
          </div>
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-400" size={28} />
              Spin The Wheel
              <Sparkles className="text-yellow-400" size={28} />
            </h2>
            <p className="text-slate-300 text-sm">Complete 4 engagement events to unlock each spin!</p>
          </div>

          {/* Spins Available Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
              <Award size={24} />
              <span>{displaySpins} {displaySpins === 1 ? 'Spin' : 'Spins'} Available</span>
            </div>
          </div>

          {/* Wheel Container */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-10">
              <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg relative flex items-center justify-center border-2 border-white">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-red-500 absolute -bottom-3" />
              </div>
            </div>

            {/* The Wheel */}
            <motion.div
              className="w-full h-full rounded-full border-4 border-yellow-500 shadow-2xl bg-white relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 2.5, ease: "circOut" }}
              style={{ transformOrigin: 'center' }}
            >
              {displaySpins <= 0 && !isSpinning && (
                <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-[2px]">
                  <Lock className="text-white/50 w-16 h-16" />
                </div>
              )}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {segments.map((val, i) => {
                  const startAngle = (i * sliceAngle * Math.PI) / 180;
                  const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
                  const x1 = 50 + 50 * Math.cos(startAngle);
                  const y1 = 50 + 50 * Math.sin(startAngle);
                  const x2 = 50 + 50 * Math.cos(endAngle);
                  const y2 = 50 + 50 * Math.sin(endAngle);

                  return (
                    <g key={i}>
                      <path
                        d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                        fill={segmentColors[i]}
                        stroke="white"
                        strokeWidth="0.5"
                      />
                      <text
                        x={50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}
                        y={50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)}
                        fill="white"
                        fontSize="6"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${(i * sliceAngle) + (sliceAngle / 2)}, ${50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}, ${50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)})`}
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}
              </svg>
              {/* Center Cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-slate-200 z-30">
                <div className="w-4 h-4 bg-slate-300 rounded-full" />
              </div>
            </motion.div>
          </div>

          <div className="text-center px-4">
            {displaySpins > 0 ? (
              <Button
                variant="secondary"
                fullWidth
                shape="pill"
                onClick={handleSpin}
                disabled={isSpinning}
                className="shadow-xl shadow-yellow-500/20 text-lg py-4 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all"
              >
                {isSpinning ? 'Spinning...' : '👆 SPIN!'}
              </Button>
            ) : (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <p className="text-slate-300 text-sm mb-3">
                  Complete <strong>{eventsNeeded}</strong> more Engagement Activit{eventsNeeded !== 1 ? 'ies' : 'y'} to unlock a spin!
                </p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextSpin}%` }}
                    className="h-full bg-brand-yellow"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-right">
                  {registeredEventsCount % spinThreshold}/{spinThreshold} Completed
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Spin Feedback Modal - Shows before result modal */}
      <SpinFeedbackModal
        isOpen={showFeedbackModal}
        prizeAmount={pendingPrize}
        userName={userName}
        userEmail={userEmail}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-md"
              onClick={() => setShowResult(false)}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm w-full relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Confetti (Simple dots) */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full ${segmentColors[i % 4]}`}
                  initial={{ y: -20, x: Math.random() * 300, opacity: 1 }}
                  animate={{ y: 400, rotate: 360 }}
                  transition={{ duration: 2 + Math.random(), ease: "linear" }}
                />
              ))}

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600 shadow-inner">
                  <Trophy size={40} />
                </div>
                <h3 className="text-brand-purple font-extrabold text-2xl mb-1 uppercase tracking-wider">Congratulations!</h3>
                <div className="text-slate-500 text-sm mb-6 font-medium">You Won</div>

                <div className="text-6xl font-black text-brand-dark mb-4">
                  {pendingPrize}
                </div>

                <p className="text-slate-400 text-sm mb-6">Points added to your balance.</p>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setShowResult(false);
                      onNavigateToRedeem();
                    }}
                    className="shadow-lg shadow-purple-500/20"
                  >
                    REDEEM NOW <ChevronRight size={18} />
                  </Button>
                  <button
                    onClick={() => setShowResult(false)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800"
                  >
                    Spin Again Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[300px] justify-center backdrop-blur-md ${toast.type === 'success'
              ? 'bg-slate-900/90 text-white border border-slate-700'
              : 'bg-red-500/90 text-white border border-red-400'
              }`}
          >
            {toast.type === 'success' ? (
              <CircleCheck size={18} className="text-green-400" />
            ) : (
              <CircleAlert size={18} className="text-white" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-left"
      >
        {/* <h3 className="font-bold text-slate-800 mb-4">Bonus History</h3>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {pendingPrize > 0 && (
            <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Sparkles size={16} /></div>
                <div>
                  <div className="text-sm font-bold">Won Spinner Game</div>
                  <div className="text-xs text-slate-400">Just now</div>
                </div>
              </div>
              <span className="text-green-600 font-bold">+{pendingPrize}</span>
            </div>
          )}

          {user?.transactions && user.transactions.length > 0 ? (
            user.transactions.slice().reverse().map((tx: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'credit' ? <Sparkles size={16} /> : <Award size={16} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{tx.reason || 'Transaction'}</div>
                    <div className="text-xs text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount)}
                </span>
              </div>
            ))
          ) : (
            !pendingPrize && <p className="text-slate-400 text-sm text-center">No history yet.</p>
          )}
        </div> */}
      </motion.div>
    </div>
  );
};

export default Bonus;
