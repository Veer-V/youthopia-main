import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Activity, ShoppingBag, Sparkles, Trophy, Gift } from 'lucide-react';
import Button from '../Button';

interface PointsProps {
   points: number;
   onAddPoints: (amount: number) => void;
}

interface PointTransaction {
   timestamp: number;
   reason: string;
   points: number;
}

// --- Web Audio API Sound Helpers ---
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
   if (typeof window !== 'undefined' && !audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
   }
   return audioContext;
};

const playTickSound = () => {
   const context = getAudioContext();
   if (!context) return;
   try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.05);
   } catch (e) {
      console.error("Could not play sound:", e);
   }
};

const playWinSound = () => {
   const context = getAudioContext();
   if (!context) return;
   try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
      oscillator.frequency.linearRampToValueAtTime(1046.50, context.currentTime + 0.2); // C6
      gain.gain.setValueAtTime(0.2, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
   } catch (e) {
      console.error("Could not play win sound:", e);
   }
};

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
   const [spinsAvailable, setSpinsAvailable] = useState(3); // Track available spins
   const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([
      { timestamp: Date.now() - 3600000, reason: "Welcome Bonus", points: 50 },
   ]);

   const lastTickAngle = useRef(0);
   const rotationValue = useMotionValue(0);
   const canvasRef = useRef<HTMLCanvasElement>(null);

   // Wheel Segments: 8 segments, 45 degrees each
   const segments = [5, 10, 2, 20, 5, 15, 2, 25];
   const segmentColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1', '#10b981', '#ec4899', '#ef4444'];
   const sliceAngle = 360 / segments.length;

   // Add points to history
   const addToHistory = useCallback((points: number, reason: string) => {
      const transaction: PointTransaction = {
         timestamp: Date.now(),
         reason,
         points
      };
      setPointsHistory(prev => [transaction, ...prev]);
   }, []);

   // Confetti animation
   useEffect(() => {
      if (showResult && canvasRef.current) {
         playWinSound();
         const canvas = canvasRef.current;
         const ctx = canvas.getContext('2d');
         if (!ctx) return;

         let confetti: { x: number, y: number, r: number, d: number, color: string, tilt: number }[] = [];
         const confettiCount = 100;
         const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

         canvas.width = canvas.offsetWidth;
         canvas.height = canvas.offsetHeight;

         for (let i = 0; i < confettiCount; i++) {
            confetti.push({
               x: Math.random() * canvas.width,
               y: Math.random() * canvas.height - canvas.height,
               r: Math.random() * 4 + 1,
               d: Math.random() * confettiCount,
               color: colors[Math.floor(Math.random() * colors.length)],
               tilt: Math.floor(Math.random() * 10) - 10,
            });
         }

         let animationFrameId: number;
         const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach((p, i) => {
               ctx.beginPath();
               ctx.lineWidth = p.r / 2;
               ctx.strokeStyle = p.color;
               ctx.moveTo(p.x + p.tilt, p.y);
               ctx.lineTo(p.x, p.y + p.tilt + p.r / 2);
               ctx.stroke();
               p.y += Math.pow(p.d, 0.5) + p.r * 0.5;
               p.tilt += 0.1;
               if (p.y > canvas.height) {
                  if (i % 5 > 0 || i % 2 === 0) {
                     confetti[i] = { ...p, x: Math.random() * canvas.width, y: -20, };
                  }
               }
            });
            animationFrameId = requestAnimationFrame(draw);
         };
         draw();
         return () => cancelAnimationFrame(animationFrameId);
      }
   }, [showResult]);

   const handleSpin = () => {
      if (isSpinning || spinsAvailable <= 0) return;
      setIsSpinning(true);
      setSpinsAvailable(prev => prev - 1);

      // Random spin: 5 to 10 full rotations + random segment
      const randomSegmentIndex = Math.floor(Math.random() * segments.length);
      const extraRotations = 360 * (5 + Math.floor(Math.random() * 5));
      const randomOffset = Math.random() * (sliceAngle - 2) + 1;
      const targetRotation = extraRotations + (360 - (randomSegmentIndex * sliceAngle)) - (sliceAngle / 2) + randomOffset;

      const newRotation = rotation + targetRotation;
      setRotation(newRotation);

      // Animate with tick sounds
      animate(rotationValue, newRotation, {
         duration: 4,
         ease: "circOut",
         onUpdate: (latest) => {
            const anglePerTick = sliceAngle / 2;
            if (Math.abs(latest - lastTickAngle.current) > anglePerTick) {
               playTickSound();
               lastTickAngle.current = latest;
            }
         },
         onComplete: () => {
            const prize = segments[randomSegmentIndex];
            setWonAmount(prize);
            setShowResult(true);
            onAddPoints(prize);
            addToHistory(prize, "Spin Wheel Prize");
            setIsSpinning(false);
         }
      });
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
                     <div className="text-slate-400 font-semibold mt-1">Wellness Points</div>
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
                  <Sparkles className="text-yellow-400" /> Wellness Wheel <Sparkles className="text-yellow-400" />
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
                     disabled={isSpinning || spinsAvailable <= 0}
                     className="shadow-xl shadow-yellow-500/20 text-lg py-4 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSpinning ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-2 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Spinning...
                        </>
                     ) : (
                        <>
                           <Gift className="inline-block mr-2" size={20} />
                           SPIN THE WHEEL
                        </>
                     )}
                  </Button>
                  <p className="mt-3 text-sm font-semibold text-white/70">
                     {spinsAvailable} spin{spinsAvailable !== 1 ? "s" : ""} available
                  </p>
               </div>
            </motion.div>
         </div>

         {/* Result Modal with Confetti */}
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
                     className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-center max-w-sm w-full relative z-10 shadow-2xl overflow-hidden"
                  >
                     {/* Confetti Canvas */}
                     <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

                     <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600 shadow-inner">
                           <Trophy size={40} />
                        </div>
                        <h3 className="text-brand-purple font-extrabold text-2xl mb-1 uppercase tracking-wider">Congratulations!</h3>
                        <div className="text-slate-500 text-sm mb-6 font-medium">You won</div>

                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 mb-2">
                           {wonAmount}
                        </div>
                        <p className="text-lg font-semibold text-gray-800 mb-6">Points!</p>

                        <Button variant="primary" fullWidth onClick={() => setShowResult(false)}>
                           Awesome!
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
            <div className="space-y-2 max-h-64 overflow-y-auto">
               {pointsHistory.length > 0 ? (
                  pointsHistory.map((tx, i) => (
                     <motion.div
                        key={`${tx.timestamp}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors"
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full ${tx.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center`}>
                              {tx.points > 0 ? <Activity size={16} /> : <ShoppingBag size={16} />}
                           </div>
                           <div>
                              <div className="text-sm font-bold">{tx.reason}</div>
                              <div className="text-xs text-slate-400">
                                 {new Date(tx.timestamp).toLocaleString()}
                              </div>
                           </div>
                        </div>
                        <span className={`font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                           {tx.points > 0 ? '+' : ''}{tx.points}
                        </span>
                     </motion.div>
                  ))
               ) : (
                  <div className="text-center py-8 text-slate-400">
                     <p>No transactions yet.</p>
                     <p className="text-sm">Spin the wheel to earn points!</p>
                  </div>
               )}
            </div>
         </motion.div>
      </div>
   );
};

export default Points;