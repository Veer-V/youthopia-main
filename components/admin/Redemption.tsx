
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, ShoppingBag, CheckCircle2, XCircle, History, List } from 'lucide-react';
import Button from '../Button';
import { useData, RedemptionRequest } from '../../contexts/DataContext';

const Redemption: React.FC = () => {
    const { processRedemption } = useData();
    const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchRedemptions = async () => {
            try {
                const response = await fetch('http://35.244.42.115:6001/redeem');
                const data = await response.json();

                if (Array.isArray(data)) {
                    const allRequests: RedemptionRequest[] = [];
                    data.forEach((item: any) => {
                        // 1. Process Pending Transactions
                        if (item.transactions && typeof item.transactions === 'object') {
                            Object.values(item.transactions).forEach((t: any) => {
                                if (typeof t !== 'object' || !t || !t._id) return;

                                let uName = 'Unknown User';
                                let uId = '';

                                if (typeof t.user === 'string') {
                                    uId = t.user;
                                } else if (t.user && typeof t.user === 'object') {
                                    uName = t.user.name || 'Unknown User';
                                    uId = t.user.Yid || t.user.id || t.user._id || '';
                                }

                                allRequests.push({
                                    id: t._id,
                                    user: uName,
                                    userId: uId,
                                    goodieId: item._id,
                                    item: item.name || 'Unknown Item',
                                    cost: Math.abs(t.points || 0),
                                    status: 'Pending',
                                    time: t.createdAt || new Date().toISOString()
                                });
                            });
                        }

                        // 2. Process Approved Transactions (History)
                        if (item.approved && typeof item.approved === 'object') {
                            Object.values(item.approved).forEach((t: any) => {
                                if (typeof t !== 'object' || !t || !t._id) return;

                                let uName = 'Unknown User';
                                let uId = '';

                                if (typeof t.user === 'string') {
                                    uId = t.user;
                                } else if (t.user && typeof t.user === 'object') {
                                    uName = t.user.name || 'Unknown User';
                                    uId = t.user.Yid || t.user.id || t.user._id || '';
                                }

                                allRequests.push({
                                    id: t._id,
                                    user: uName,
                                    userId: uId,
                                    goodieId: item._id,
                                    item: item.name || 'Unknown Item',
                                    cost: Math.abs(t.points || 0),
                                    status: 'Approved',
                                    time: t.createdAt || new Date().toISOString()
                                });
                            });
                        }
                    });
                    setRedemptions(allRequests);
                }
            } catch (error) {
                console.error("Error fetching redemptions:", error);
            }
        };

        fetchRedemptions();
        // Poll every 5 seconds to keep it fresh
        const interval = setInterval(fetchRedemptions, 5000);
        return () => clearInterval(interval);
    }, []);

    const pendingRequests = redemptions.filter(r => r.status === 'Pending');
    const historyRequests = redemptions.filter(r => r.status !== 'Pending');

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const req = redemptions.find(r => r.id === id);
        // Call global processor
        await processRedemption(id, action === 'approve' ? 'Approved' : 'Rejected', req?.goodieId);

        const message = action === 'approve'
            ? `Request ${id} Approved`
            : `Request ${id} Rejected`;

        setNotification({
            message,
            type: action === 'approve' ? 'success' : 'error'
        });

        setTimeout(() => setNotification(null), 3000);

        // Re-fetch immediately
        const response = await fetch('http://35.244.42.115:6001/redeem');
        // We could just let polling handle it, but for UI responsiveness:
        // (Simplified re-fetch logic omitted to keep diff clean, polling covers it)
    };

    return (
        <div className="space-y-6 relative h-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Redeemption Queue</h2>


                {/* Toggle Tabs */}
                <div className="bg-slate-100 p-1 rounded-xl flex shadow-sm border border-slate-200">
                    <button
                        onClick={() => setActiveTab('queue')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'queue' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <List size={16} /> Pending
                        <span className="bg-brand-purple text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <History size={16} /> History
                    </button>
                </div>
            </div>
            <h2 className="text-m text-blue-500 text-slate-800">It will take almost 2 mins for transaction to show and complete</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {activeTab === 'queue' ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {pendingRequests.map((req) => (
                                <motion.div
                                    layout
                                    key={req.id}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden bg-white"
                                >
                                    <div className="absolute top-0 right-0 p-3">
                                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <Clock size={10} /> {req.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{req.item}</h3>
                                            <p className="text-xs text-slate-500">{req.user}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm border border-slate-100">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-slate-500">Student:</span>
                                            <span className="font-semibold text-slate-700">{req.user}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Cost:</span>
                                            <span className="font-bold text-slate-900">{req.cost} pts</span>
                                        </div>
                                        <div className="flex justify-between mt-1 pt-1 border-t border-slate-200">
                                            <span className="text-slate-500 text-xs">Requested:</span>
                                            <span className="text-xs text-slate-400">{req.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="white"
                                            fullWidth
                                            onClick={() => handleAction(req.id, 'reject')}
                                            className="text-xs py-2 text-red-500 hover:bg-red-50 hover:border-red-200"
                                        >
                                            <X size={14} className="mr-1" /> Reject
                                        </Button>
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => handleAction(req.id, 'approve')}
                                            className="text-xs py-2 shadow-none bg-green-600 hover:bg-green-700"
                                        >
                                            <Check size={14} className="mr-1" /> Approve
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {pendingRequests.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-20 text-slate-400 flex flex-col items-center"
                            >
                                <CheckCircle2 size={48} className="text-green-100 mb-4" />
                                <p className="font-medium text-slate-500">All caught up!</p>
                                <p className="text-sm">No pending redemption requests.</p>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-3 pl-6">Request ID</th>
                                    <th className="p-3">Item</th>
                                    <th className="p-3">Student</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right pr-6">Processed At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {historyRequests.length > 0 ? historyRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="p-3 pl-6 font-mono text-slate-400">{req.id}</td>
                                        <td className="p-3 font-semibold text-slate-800">{req.item}</td>
                                        <td className="p-3 text-slate-600">{req.user}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {req.status === 'Approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right pr-6 text-slate-400 font-mono text-xs">{req.time}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">No history available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[300px] border ${notification.type === 'success'
                            ? 'bg-white text-green-700 border-green-100'
                            : 'bg-white text-red-700 border-red-100'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 size={18} className="text-green-600" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <XCircle size={18} className="text-red-600" />
                            </div>
                        )}
                        <div>
                            <div className="text-slate-900">{notification.message}</div>
                            <div className="text-xs text-slate-400 font-normal">Action completed successfully</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Redemption;
