
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Server, AlertTriangle, UserCheck } from 'lucide-react';

// Live Pulse Chart Component
const ServerPulse = () => {
    const [data, setData] = useState<number[]>(Array(20).fill(20));

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1)];
                // Simulate heartbeat: mostly low, occasional spike
                const random = Math.random();
                let val = 20 + Math.random() * 10;
                if (random > 0.9) val = 80; // Spike
                newData.push(val);
                return newData;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-16 flex items-end gap-1 overflow-hidden">
            {data.map((val, i) => (
                <motion.div 
                    key={i}
                    layout
                    className="flex-1 bg-green-500/50 rounded-t-sm"
                    initial={{ height: '20%' }}
                    animate={{ height: `${val}%`, backgroundColor: val > 60 ? '#ef4444' : '#22c55e' }}
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );
};

const AdminOverview: React.FC = () => {
  const adminLogs = [
      { id: 1, admin: 'ADM-001', action: 'Approved Redemption RED-402', time: '10:42 AM', status: 'Success' },
      { id: 2, admin: 'ADM-003', action: 'Updated Event: Pulse Parade', time: '10:35 AM', status: 'Success' },
      { id: 3, admin: 'ADM-001', action: 'Global Broadcast Sent', time: '09:15 AM', status: 'Success' },
      { id: 4, admin: 'ADM-002', action: 'Failed Login Attempt', time: '08:55 AM', status: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Admin & System Health</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* System Health */}
         <div className="bg-[#111] border border-white/10 p-6 rounded-2xl lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Activity size={20} className="text-green-400" /> Live System Monitor
            </h3>
            <div className="space-y-6">
               {/* API Gateway Pulse */}
               <div className="bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                     <div>
                        <div className="font-bold text-white flex items-center gap-2"><Server size={16} /> API Gateway Load</div>
                        <div className="text-xs text-slate-400">Real-time request volume</div>
                     </div>
                     <span className="text-green-400 font-mono font-bold text-xs bg-green-500/10 px-2 py-1 rounded">HEALTHY</span>
                  </div>
                  <ServerPulse />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border-l-4 border-blue-500">
                      <div>
                         <div className="font-bold text-white">Database</div>
                         <div className="text-xs text-slate-400">Response Time</div>
                      </div>
                      <span className="text-blue-400 font-mono font-bold">12ms</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border-l-4 border-purple-500">
                      <div>
                         <div className="font-bold text-white">Storage</div>
                         <div className="text-xs text-slate-400">Capacity Used</div>
                      </div>
                      <span className="text-purple-400 font-mono font-bold">45%</span>
                   </div>
               </div>
            </div>
         </div>

         {/* Admin Active Count */}
         <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
            <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border-4 border-blue-500/30 flex items-center justify-center mb-4 mx-auto shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                   <Shield size={40} className="text-blue-400" />
                </div>
                <h3 className="text-5xl font-black text-white mb-2">3</h3>
                <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Active Admins Online</p>
                <div className="mt-6 flex gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150" />
                </div>
            </div>
         </div>
      </div>

      {/* Logs */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white">Recent Admin Actions</h3>
             <button className="text-xs text-slate-500 hover:text-white">View Full Audit Log</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
               <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                  <tr>
                     <th className="p-3 rounded-l-lg">Admin ID</th>
                     <th className="p-3">Action</th>
                     <th className="p-3">Timestamp</th>
                     <th className="p-3 rounded-r-lg">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {adminLogs.map(log => (
                     <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-white font-medium font-mono">{log.admin}</td>
                        <td className="p-3">{log.action}</td>
                        <td className="p-3 font-mono text-xs">{log.time}</td>
                        <td className="p-3">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${log.status === 'Success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              {log.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminOverview;
