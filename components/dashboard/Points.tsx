import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Activity, ShoppingBag, Sparkles, Trophy } from 'lucide-react';
import Button from '../Button';

interface PointsProps {
  points: number;
  onAddPoints: (amount: number) => void;
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

const Points: React.FC<PointsProps> = ({ points, onAddPoints }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);

  // Wheel Segments: 8 segments, 45 degrees each
  // Values: 10, 20, 30, 40 repeated twice
  const segments = [10, 20, 30, 40, 10, 20, 30, 40];
  const segmentColors = ['#facc15', '#fbbf24', '#ec4899', '#8b5cf6', '#facc15', '#fbbf24', '#ec4899', '#8b5cf6'];
  const sliceAngle = 360 / segments.length;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Random spin: 5 to 10 full rotations + random segment
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 5));
    
    // Calculate rotation to land on the specific segment
    // Note: The pointer is usually at the top (0 deg or -90 deg depending on SVG coord).
    // Let's assume pointer is at Top (0 deg visual).
    // Segment 0 starts at 0 deg (or -sliceAngle/2 to center it).
    // To land on segment i, we need to rotate backwards relative to the pointer.
    const randomOffset = Math.random() * (sliceAngle - 2) + 1; // Add some randomness within the slice
    const targetRotation = extraRotations + (360 - (randomSegmentIndex * sliceAngle)) - (sliceAngle / 2) + randomOffset;

    setRotation(rotation + targetRotation);

    setTimeout(() => {
      const prize = segments[randomSegmentIndex];
      setWonAmount(prize);
      setShowResult(true);
      onAddPoints(prize);
      setIsSpinning(false);
    }, 4000); // Duration matches the transition duration
  };

  return (
    <div className="space-y-12">
      {/* Header Points Display */}
      <div className="text-center pt-4">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative inline-block"
        >
           <motion.div 
             key={points}
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
                  <AnimatedCounter value={points} />
                </motion.div>
                <div className="text-slate-400 font-semibold mt-1">Total Points</div>
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

            <h3 className="text-center text-white font-bold text-xl mb-6 tracking-widest uppercase flex items-center justify-center gap-2">
               <Sparkles className="text-yellow-400" /> Spinner Game <Sparkles className="text-yellow-400" />
            </h3>

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
                  transition={{ duration: 4, ease: "circOut" }}
                  style={{ transformOrigin: 'center' }}
               >
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                     {segments.map((val, i) => {
                        // Calculate SVG path for a slice
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
                              {/* Text positioning */}
                              <text
                                x={50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}
                                y={50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)}
                                fill="white"
                                fontSize="6"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${(i * sliceAngle) + (sliceAngle/2)}, ${50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}, ${50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)})`}
                              >
                                {val}
                              </text>
                           </g>
                        );
                     })}
                  </svg>
                  {/* Center Cap */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-slate-200">
                     <div className="w-4 h-4 bg-slate-300 rounded-full" />
                  </div>
               </motion.div>
            </div>

            <div className="text-center px-4">
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
            </div>
         </motion.div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
                   <h3 className="text-brand-purple font-extrabold text-2xl mb-1 uppercase tracking-wider">Game Over!</h3>
                   <div className="text-slate-500 text-sm mb-6 font-medium">Your Final Score</div>
                   
                   <div className="text-6xl font-black text-brand-dark mb-8">
                      {wonAmount}
                   </div>

                   <Button variant="primary" fullWidth onClick={() => setShowResult(false)}>
                      PLAY AGAIN
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Section */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-left"
      >
         <h3 className="font-bold text-slate-800 mb-4">Points History</h3>
         <div className="space-y-4">
            <motion.div 
              className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Activity size={16} /></div>
                  <div>
                     <div className="text-sm font-bold">Won Spinner Game</div>
                     <div className="text-xs text-slate-400">Just now</div>
                  </div>
               </div>
               <span className="text-green-600 font-bold">+{wonAmount || 50}</span>
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><ShoppingBag size={16} /></div>
                  <div>
                     <div className="text-sm font-bold">Redeemed Coffee</div>
                     <div className="text-xs text-slate-400">Yesterday, 4:00 PM</div>
                  </div>
               </div>
               <span className="text-red-500 font-bold">-100</span>
            </motion.div>
         </div>
      </motion.div>
    </div>
  );
};

export default Points;