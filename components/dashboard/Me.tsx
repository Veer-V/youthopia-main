
import React, { useEffect, useRef } from 'react';
import { motion, Variants, useSpring, useTransform, animate, useMotionValue } from 'framer-motion';
import { Award, User, Phone, Book, GraduationCap, Info, ShieldCheck, Sparkles, QrCode, Mail } from 'lucide-react';
import { UserData } from '../../types';

interface MeProps {
  bonus: number;
  user: UserData | null;
  registeredEventIds: string[];
}

const DigitalIDCard = ({ user }: { user: UserData }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 20 });
  
  // Holographic sheen movement
  const sheenX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 100, damping: 20 });
  const sheenY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized position (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full max-w-md mx-auto md:mx-0">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.586/1] w-full rounded-2xl bg-black shadow-2xl overflow-hidden group select-none"
      >
        {/* --- Card Texture & Background --- */}
        <div className="absolute inset-0 bg-slate-900 z-0">
           {/* Abstract Festival Pattern */}
           <div className="absolute inset-0 opacity-30" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 30%)',
                  backgroundSize: '100% 100%' 
                }} 
           />
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* --- Holographic Overlay --- */}
        <motion.div 
          style={{ 
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
            x: sheenX,
            y: sheenY,
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            position: 'absolute',
            zIndex: 20,
            pointerEvents: 'none',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Iridescent Border Glow */}
        <div className="absolute inset-0 rounded-2xl border-[3px] border-transparent bg-gradient-to-br from-brand-purple/50 via-brand-yellow/50 to-brand-pink/50 z-10 opacity-50" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }}></div>

        {/* --- Card Content Layer --- */}
        <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white" style={{ transform: "translateZ(20px)" }}>
            
            {/* Header */}
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-yellow to-brand-orange flex items-center justify-center shadow-lg shadow-orange-500/20">
                     <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="leading-none">
                     <h3 className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Official Access</h3>
                     <h2 className="text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">VISA PASS</h2>
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider">ACTIVE</span>
               </div>
            </div>

            {/* Middle Section: Chip & Details */}
            <div className="flex items-center gap-6 mt-4">
                <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-inner border border-yellow-400/50 flex items-center justify-center opacity-90 shrink-0">
                   <div className="w-8 h-5 border border-black/20 rounded-sm grid grid-cols-2">
                      <div className="border-r border-black/20"></div>
                      <div></div>
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Holder Name</div>
                   <div className="font-mono text-xl font-bold text-white tracking-tight truncate shadow-black drop-shadow-md">
                      {user.name.toUpperCase()}
                   </div>
                </div>
            </div>

            {/* Footer: ID & QR */}
            <div className="flex justify-between items-end mt-4">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                     <span>ID:</span>
                     <span className="text-brand-yellow font-bold">YTH-{user.phone ? user.phone.slice(-4) : '2025'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.school || 'Youthopia University'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.stream} • Class {user.class}</div>
               </div>

               <div className="bg-white p-1.5 rounded-lg shrink-0">
                  <QrCode size={36} className="text-black" />
               </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const Me: React.FC<MeProps> = ({ bonus, user, registeredEventIds }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const userData = user || {
    name: "Guest Student",
    email: "guest@example.com",
    school: "N/A",
    class: "N/A",
    stream: "N/A",
    phone: "N/A",
    age: "N/A",
    gender: "N/A",
    adminId: ""
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* --- Section 1: Digital ID & Points --- */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
         {/* Digital Visa */}
         <div className="w-full lg:flex-1">
            <motion.div variants={item}>
               <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-brand-purple" size={20} /> Digital Festival Pass
               </h3>
               <DigitalIDCard user={userData} />
            </motion.div>
         </div>

         {/* Bonus Card */}
         <motion.div 
            variants={item}
            className="w-full lg:w-80 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-10 bg-brand-yellow/10 rounded-bl-full -mr-6 -mt-6"></div>
            
            <div className="mb-2 p-3 bg-brand-yellow/20 rounded-full text-brand-orange">
               <Sparkles size={24} />
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</div>
            <div className="text-6xl font-black text-slate-900 mb-2">
               <AnimatedCounter value={bonus} />
            </div>
            <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
               Total Points
            </div>
         </motion.div>
      </div>

      {/* --- Section 2: Personal Details Grid --- */}
      <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><User size={20} /></div>
                Student Profile
            </h3>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
               Verified
            </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail size={12} /> Email
               </div>
               <div className="font-bold text-slate-800 text-lg group-hover:text-brand-purple transition-colors truncate" title={userData.email}>
                 {userData.email}
               </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Info size={12} /> Age
               </div>
               <div className="font-bold text-slate-800 text-lg group-hover:text-brand-purple transition-colors">{userData.age} Years</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <User size={12} /> Gender
               </div>
               <div className="font-bold text-slate-800 text-lg group-hover:text-brand-purple transition-colors">{userData.gender}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles size={12} /> Status
               </div>
               <div className="font-bold text-slate-800 text-lg group-hover:text-brand-purple transition-colors">Active Participant</div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Me;
