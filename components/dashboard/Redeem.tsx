
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck, CircleAlert, CircleX, Clock, History } from 'lucide-react';
import Button from '../Button';
import { useData } from '../../contexts/DataContext';
import { UserData } from '../../types';

interface RedeemItem {
  name: string;
  cost: number;
  emoji?: string;
  image?: string;
  _id?: string;
}

interface RedeemProps {
  onRedeem: (cost: number) => void;
  userBonus: number;
  user: UserData | null;
}

const Redeem: React.FC<RedeemProps> = ({ onRedeem, userBonus, user }) => {
  const { addRedemption, claimRedemption, redemptions } = useData();
  const [selectedItem, setSelectedItem] = useState<RedeemItem | null>(null);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const items: RedeemItem[] = [
    { name: 'Diary', cost: 750, image: '/image/diary.png', _id: "693e7b4c47c3a159b04db138" },
    { name: 'Sipper', cost: 550, image: '/image/sipper.png', _id: "693ea07fbe44c513834f77b5" },
    { name: 'Keychain', cost: 350, image: '/image/keychain.png', _id: "693ea20ca1825e0de8d94c2f" },
    { name: 'Badge', cost: 150, image: '/image/badge.png', _id: "693ea2894e50bc7eb4baf4f4" },
  ];

  const handleConfirm = () => {
    if (!selectedItem || !user) return;

    setRedeemStatus('loading');

    // Quick process time for responsiveness
    setTimeout(() => {
      if (userBonus >= selectedItem.cost) {
        onRedeem(selectedItem.cost);

        // Add request to shared context
        // Use User Yid for claiming
        claimRedemption(user.Yid || user.id || '', selectedItem._id || '');

        // Optimistic update if needed, but claimRedemption re-fetches list
        // We keep local 'addRedemption' for compatibility if needed, 
        // but explicit request was "Use THIS to redeem"

        /* 
        addRedemption({
          id: `RED-${Math.floor(Math.random() * 10000)}`,
          user: user.name,
          userId: user.id, // Pass explicit ID
          item: selectedItem.name,
          cost: selectedItem.cost,
          status: 'Pending',
          time: new Date().toLocaleTimeString()
        });
        */

        setRedeemStatus('success');

        setTimeout(() => {
          setToast({ message: `Successfully redeemed ${selectedItem.name}!`, type: 'success' });
          setSelectedItem(null);
          setRedeemStatus('idle');
        }, 1200);
      } else {
        setRedeemStatus('error');
      }
    }, 800);
  };

  const handleCancel = () => {
    if (redeemStatus === 'loading') return;
    setSelectedItem(null);
    setRedeemStatus('idle');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Redeem Bonus</h2>
        <div className="bg-brand-yellow/10 text-brand-orange font-bold px-4 py-2 rounded-full text-sm">
          Balance: {user?.points} points
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {items.map((item, i) => {
          const canAfford = userBonus >= item.cost;
          return (
            <motion.div
              key={i}
              variants={itemVariant}
              whileHover={canAfford ? { y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
              className={`p-4 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all ${canAfford ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}
            >
              <motion.div
                whileHover={canAfford ? { rotate: [0, -15, 15, -15, 0], scale: 1.2 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="mb-3 cursor-pointer"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <span className="text-4xl">{item.emoji}</span>
                )}
              </motion.div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h3>
              <div className={`font-bold text-sm mb-3 ${canAfford ? 'text-brand-purple' : 'text-slate-400'}`}>{item.cost} Points</div>
              <button
                onClick={() => canAfford && setSelectedItem(item)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${canAfford
                  ? 'bg-slate-100 hover:bg-brand-purple hover:text-white text-slate-700 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {canAfford ? 'Redeem' : 'Need more Points'}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

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

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-pink" />

              {redeemStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
                  >
                    <CircleCheck size={48} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Redeemed!</h3>
                  <p className="text-slate-500 text-center">
                    You have successfully claimed <br />
                    <strong className="text-slate-800">{selectedItem.name}</strong>
                  </p>
                </motion.div>
              ) : redeemStatus === 'error' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6"
                  >
                    <CircleX size={48} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Failed!</h3>
                  <p className="text-slate-500 text-center mb-6 px-4">
                    {userBonus < selectedItem.cost
                      ? "You don't have enough bonus points to redeem this item."
                      : "Something went wrong processing your request. Please try again."}
                  </p>
                  <Button variant="secondary" onClick={() => setRedeemStatus('idle')}>Try Again</Button>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-6 pt-2">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                      {selectedItem.image ? (
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <span className="text-5xl">{selectedItem.emoji}</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Redeem Item?</h3>
                    <p className="text-slate-500 text-sm mt-2 px-4">
                      Are you sure you want to redeem <strong className="text-slate-800">{selectedItem.name}</strong>?
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">Total Cost</span>
                    <span className="text-lg font-bold text-brand-purple flex items-center gap-1">
                      {selectedItem.cost} <span className="text-xs font-normal text-slate-400">Bonus</span>
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="white"
                      fullWidth
                      onClick={handleCancel}
                      disabled={redeemStatus === 'loading'}
                      className="border border-slate-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleConfirm}
                      isLoading={redeemStatus === 'loading'}
                      disabled={redeemStatus === 'loading'}
                      className="shadow-lg shadow-purple-500/20"
                    >
                      {redeemStatus === 'loading' ? 'Redeeming...' : 'Confirm'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* History Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <History className="text-brand-purple" /> Redemption History
        </h3>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          {redemptions.filter(r => r.user === user?.name && r.status === 'Approved').length > 0 ? (
            <div className="space-y-4">
              {redemptions
                .filter(r => r.user === user?.name && r.status === 'Approved')
                .map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
                        <CircleCheck size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.item}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Clock size={12} /> {item.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Approved
                      </span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        -{item.cost} <span className="text-xs text-slate-400 font-normal">pts</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <History size={32} />
              </div>
              <h4 className="text-slate-800 font-bold mb-1">No Redeemed Items Yet</h4>
              <p className="text-slate-400 text-sm">Once your redemption requests are approved, they will appear here.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Redeem;
