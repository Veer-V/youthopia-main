import React, { useState } from 'react';
import { Power, Lock, AlertOctagon, RefreshCw } from 'lucide-react';
import Button from '../Button';

const MasterControl: React.FC = () => {
  const [controls, setControls] = useState({
     registration: true,
     siteAccess: true,
     pointsRedemption: true,
  });

  const toggle = (key: keyof typeof controls) => {
     setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="text-yellow-500" /> Executive Master Control
       </h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
             <div>
                <h3 className="font-bold text-white">Global Registration</h3>
                <p className="text-sm text-slate-400">Controls student ability to join events.</p>
             </div>
             <button 
               onClick={() => toggle('registration')}
               className={`w-14 h-8 rounded-full p-1 transition-all ${controls.registration ? 'bg-green-500' : 'bg-red-500'}`}
             >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${controls.registration ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
             <div>
                <h3 className="font-bold text-white">Bonus Redemption</h3>
                <p className="text-sm text-slate-400">Enable/Disable the reward store.</p>
             </div>
             <button 
               onClick={() => toggle('pointsRedemption')}
               className={`w-14 h-8 rounded-full p-1 transition-all ${controls.pointsRedemption ? 'bg-green-500' : 'bg-red-500'}`}
             >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${controls.pointsRedemption ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
          </div>
       </div>

       <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
          <h3 className="font-bold text-red-500 flex items-center gap-2 mb-4">
             <AlertOctagon size={20} /> Danger Zone
          </h3>
          <div className="flex flex-wrap gap-4">
             <Button variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-500/10">
                Flush Cache
             </Button>
             <Button variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-500/10">
                Force Logout All Users
             </Button>
             <Button variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-500/10">
                Reset All Bonus
             </Button>
          </div>
       </div>
    </div>
  );
};

export default MasterControl;