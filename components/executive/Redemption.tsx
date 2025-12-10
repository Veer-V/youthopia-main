
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Redemption: React.FC = () => {
  const { redemptions, processRedemption } = useData();

  // Filter for 'Pending' requests only for the executive view, perhaps prioritising high value
  // For now, showing all pending
  const pendingRequests = redemptions.filter(r => r.status === 'Pending');

  const process = (id: string, action: 'Approved' | 'Rejected') => {
     processRedemption(id, action);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Redemption Approval Queue</h2>
          <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold">
            {pendingRequests.length} Pending
          </span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
             {pendingRequests.length > 0 ? pendingRequests.map(req => (
               <motion.div
                 key={req.id}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-[#111] border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-colors shadow-sm"
               >
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                        <Clock size={20} />
                     </div>
                     <div className="min-w-0">
                        <h3 className="font-bold text-white truncate">{req.item}</h3>
                        <p className="text-sm text-slate-400 truncate max-w-[150px]">{req.user}</p>
                        <p className="text-xs text-yellow-500 font-mono mt-1">{req.cost} Bonus Points</p>
                     </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button 
                        onClick={() => process(req.id, 'Rejected')}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors" title="Reject"
                     >
                        <X size={18} />
                     </button>
                     <button 
                        onClick={() => process(req.id, 'Approved')}
                        className="p-3 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors" title="Approve"
                     >
                        <Check size={18} />
                     </button>
                  </div>
               </motion.div>
             )) : (
                 <div className="col-span-full text-center py-20 text-slate-500 border border-white/5 rounded-2xl bg-[#111]">
                    No pending redemption requests.
                 </div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};

export default Redemption;
