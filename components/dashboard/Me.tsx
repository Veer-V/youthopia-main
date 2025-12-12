import React, { useEffect, useRef } from 'react';
import { motion, Variants, useSpring, useTransform, animate, useMotionValue } from 'framer-motion';
import { Award, User, Phone, Book, GraduationCap, Info, Sparkles, Mail } from 'lucide-react';
import { UserData } from '../../types';

interface MeProps {
   bonus: number;
   user: UserData | null;
   registeredEventIds: string[];
}

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
         {/* --- Section 1: Bonus Points --- */}
         <div className="flex justify-center">
            {/* Bonus Card */}
            <motion.div
               variants={item}
               className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
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
                  Mental Wellness Points
               </div>
            </motion.div>
         </div>

         {/* --- Section 2: Personal Details Grid --- */}
         <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><User size={20} /></div>
                  My Profile
               </h3>
               <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                  Verified
               </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      Yid
                  </div>
                  <div className="font-bold text-slate-800 text-lg group-hover:text-brand-purple transition-colors truncate" title={userData.email}>
                     16AC0D
                  </div>
               </div>
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
