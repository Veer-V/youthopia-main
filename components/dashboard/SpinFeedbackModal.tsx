import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../Button';

interface SpinFeedbackModalProps {
    isOpen: boolean;
    prizeAmount: number;
    userName: string;
    userEmail: string;
    onSubmit: (rating: number, favoriteAspect: string, wouldRecommend: string) => void;
}

const SpinFeedbackModal: React.FC<SpinFeedbackModalProps> = ({
    isOpen,
    prizeAmount,
    userName,
    userEmail,
    onSubmit
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [favoriteAspect, setFavoriteAspect] = useState<string>('');
    const [wouldRecommend, setWouldRecommend] = useState<string>('');

    const aspects = [
        { value: 'Events', emoji: '🎭', label: 'Events' },
        { value: 'Prizes', emoji: '🎁', label: 'Prizes' },
        { value: 'Community', emoji: '👥', label: 'Community' },
        { value: 'Organization', emoji: '📋', label: 'Organization' },
        { value: 'Other', emoji: '✨', label: 'Other' }
    ];

    const recommendations = [
        { value: 'Yes', emoji: '👍', label: 'Yes', color: 'bg-green-500 hover:bg-green-600' },
        { value: 'Maybe', emoji: '🤔', label: 'Maybe', color: 'bg-yellow-500 hover:bg-yellow-600' },
        { value: 'No', emoji: '👎', label: 'No', color: 'bg-red-500 hover:bg-red-600' }
    ];

    const handleSubmit = () => {
        if (rating > 0 && favoriteAspect && wouldRecommend) {
            onSubmit(rating, favoriteAspect, wouldRecommend);
            // Reset form
            setRating(0);
            setFavoriteAspect('');
            setWouldRecommend('');
        }
    };

    const isFormValid = rating > 0 && favoriteAspect && wouldRecommend;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl p-6 max-w-md w-full relative z-10 shadow-xl overflow-y-auto max-h-[90vh]"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-yellow/10 to-brand-orange/10 rounded-full blur-3xl -z-10" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center mb-4 shadow-lg"
                        >
                            <Sparkles className="text-white" size={32} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quick Feedback</h2>
                        <p className="text-slate-500 text-sm">
                            Help us improve! Answer 3 quick questions to claim your <span className="font-bold text-brand-purple">{prizeAmount} bonus points</span>
                        </p>
                    </div>

                    {/* Question 1: Rating */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            1. How would you rate your overall Youthopia experience?
                        </label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-all"
                                >
                                    <Star
                                        size={40}
                                        className={`transition-all ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-slate-300'
                                            }`}
                                    />
                                </motion.button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-sm text-slate-500 mt-2"
                            >
                                {rating === 5 ? '🔥 Amazing!' : rating === 4 ? '😊 Great!' : rating === 3 ? '👍 Good!' : rating === 2 ? '😐 Okay' : '😕 Needs improvement'}
                            </motion.p>
                        )}
                    </div>

                    {/* Question 2: Favorite Aspect */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            2. What did you enjoy most about the engagement activities?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {aspects.map((aspect) => (
                                <motion.button
                                    key={aspect.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFavoriteAspect(aspect.value)}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${favoriteAspect === aspect.value
                                        ? 'border-brand-purple bg-brand-purple/10 shadow-lg'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{aspect.emoji}</div>
                                    <div className="text-xs font-bold text-slate-700">{aspect.label}</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Question 3: Recommendation */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3">
                            3. Would you recommend Youthopia to your friends?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {recommendations.map((rec) => (
                                <motion.button
                                    key={rec.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setWouldRecommend(rec.value)}
                                    className={`p-4 rounded-2xl transition-all text-center text-white font-bold ${wouldRecommend === rec.value
                                        ? `${rec.color} shadow-lg ring-4 ring-offset-2 ring-${rec.color.split('-')[1]}-300`
                                        : 'bg-slate-300 hover:bg-slate-400'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{rec.emoji}</div>
                                    <div className="text-sm">{rec.label}</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`shadow-xl transition-all ${isFormValid
                            ? 'shadow-brand-purple/30 hover:shadow-brand-purple/50'
                            : 'opacity-50 cursor-not-allowed'
                            }`}
                    >
                        {isFormValid ? (
                            <>
                                <CheckCircle2 size={20} />
                                Submit & Claim {prizeAmount} Points
                            </>
                        ) : (
                            'Please answer all questions'
                        )}
                    </Button>

                    {/* Progress Indicator */}
                    <div className="mt-4 flex justify-center gap-2">
                        {[rating > 0, favoriteAspect !== '', wouldRecommend !== ''].map((completed, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${completed ? 'bg-brand-purple w-8' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SpinFeedbackModal;
