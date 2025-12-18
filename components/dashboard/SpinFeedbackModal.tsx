import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../Button';
import { SpinFeedbackResponse } from '../../types';

const QUESTION_SETS: QuestionSet[] = [
    {
        id: 'set1',
        title: 'Social Media Usage and Habits',
        questions: [
            {
                id: 'Q1',
                text: 'On average, how many hours per day do you spend on social media?',
                type: 'single',
                options: ['Less than 1 hour', '1-2 hours', '3-4 hours', '5-6 hours', 'More than 6 hours']
            },
            {
                id: 'Q2',
                text: 'How often do you compare yourself to others based on what you see on social media?',
                type: 'single',
                options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
            },
            {
                id: 'Q3',
                text: 'After spending time on social media, how do you typically feel about yourself?',
                type: 'single',
                options: ['Much more positive', 'Slightly more positive', 'No change', 'Slightly more negative', 'Much more negative']
            }
        ]
    },
    {
        id: 'set2',
        title: 'Past Experience and Mental Health',
        questions: [
            {
                id: 'Q1',
                text: 'How often do you find yourself replaying past negative experiences in your mind?',
                type: 'single',
                options: ['Never or rarely', 'Sometimes (1-2 times per week)', 'Often (3-5 times per week)', 'Very often (almost daily)', 'Constantly (multiple times daily)']
            },
            {
                id: 'Q2',
                text: 'Which statement best describes how you relate to your past negative experiences?',
                type: 'single',
                options: [
                    'They are part of my history, but don’t define who I am',
                    'I have learned from them and mostly moved on',
                    'I think about them regularly and they influence my current identity',
                    'They are central to understanding who I am and how I see myself',
                    'I actively work to not let them define me'
                ]
            },
            {
                id: 'Q3',
                text: 'In the past month, have you repeatedly thought about negative experiences affecting any of the following? (Select all that apply)',
                type: 'multiple',
                options: [
                    'My academic performance',
                    'My relationships with friends/family',
                    'My mood or emotional well-being',
                    'My ability to trust others',
                    'My self-confidence',
                    'My physical health (sleep, appetite, etc.)',
                    'My sense of personal agency/control',
                    'None of the above'
                ]
            }
        ]
    },
    {
        id: 'set3',
        title: 'Toxic Relationship and Mental Health',
        questions: [
            {
                id: 'Q1',
                text: 'How have toxic relationships affected your mental health? (Select ALL that apply)',
                type: 'multiple',
                options: [
                    'Anxiety, panic attacks, or constant worry',
                    'Depression or persistent sadness',
                    'Low self-esteem or loss of identity',
                    'Difficulty trusting others',
                    'post-traumatic stress symptoms (flashbacks, nightmares, hypervigilance)',
                    'Sleep disturbances',
                    'Self-harm or suicidal thoughts',
                    'eating disorders or disordered eating',
                    'Substance use/abuse',
                    'Physical symptoms (headaches, stomach issues, exhaustion)',
                    'Difficulty setting boundaries',
                    'People-pleasing or fear of conflict',
                    'No significant mental health impact'
                ]
            },
            {
                id: 'Q2',
                text: 'How would you rate your current self-esteem/self-worth in the context of your toxic relationship experiences?',
                type: 'single',
                options: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent']
            },
            {
                id: 'Q3',
                text: 'What factors have made it harder to leave or avoid toxic relationships? (Select ALL that apply)',
                type: 'multiple',
                options: [
                    'Financial dependence',
                    'Fear of the person\'s reaction or retaliation',
                    'Cultural or religious expectations',
                    'Family/community pressure to maintain relationship',
                    'Still loved them / hoped they would change',
                    'Low self-worth (believed I deserved it)',
                    'Didnt recognize it was toxic until later',
                    'Lack of support system or resources',
                    'Shared living situation or children involved',
                    'Gender, race, or other identity factors',
                    'Mental health challenges or past trauma',
                    'Disability or chronic illness',
                    'Immigration status or language barriers',
                    'Not applicable'
                ]
            }
        ]
    },
    {
        id: 'set4',
        title: 'Social Media and Self-esteem',
        questions: [
            {
                id: 'Q1',
                text: 'In the past 6 months, has social media content about beauty/appearance made you feel: (Select all that apply)',
                type: 'multiple',
                options: [
                    'Anxious or stressed about my looks',
                    'Motivated to improve my appearance',
                    'Ashamed of my body or features',
                    'Pressure to use beauty products/treatments',
                    'Desire to edit or filter my photos',
                    'Inadequate or not good enough',
                    'Inspired and confident',
                    'No significant impact'
                ]
            },
            {
                id: 'Q2',
                text: 'Which beauty standards do you feel most pressured by? (Select all that apply)',
                type: 'multiple',
                options: [
                    'Fair/light skin tone',
                    'Slim body type',
                    'Western facial features',
                    'Traditional Indian beauty ideals (long hair, specific body proportions)',
                    'Influencer/celebrity aesthetics',
                    'Perfect skin (acne-free, blemish-free)',
                    'Specific body measurements',
                    'None of the above'
                ]
            },
            {
                id: 'Q3',
                text: 'How often do you compare your appearance to:',
                type: 'matrix',
                rows: [
                    'Indian celebrities/influencers',
                    'International/Western celebrities/influencers',
                    'Friends and peers in real life'
                ],
                columns: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
            }
        ]
    }
];

interface SpinFeedbackModalProps {
    isOpen: boolean;
    prizeAmount: number;
    userName: string;
    userEmail: string;
    spinNumber?: number; // Added to determine the question set
    onSubmit: (responses: SpinFeedbackResponse['responses'], category: string) => void;
}

type QuestionType = 'single' | 'multiple' | 'matrix';

interface Question {
    id: string;
    text: string;
    type: QuestionType;
    options?: string[];
    rows?: string[]; // For matrix
    columns?: string[]; // For matrix
}

interface QuestionSet {
    id: string;
    title: string;
    questions: Question[];
}

const SpinFeedbackModal: React.FC<SpinFeedbackModalProps> = ({
    isOpen,
    prizeAmount,
    userName,
    userEmail,
    spinNumber = 1,
    onSubmit
}) => {
    const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            // Select set based on spinNumber (1-based index)
            // Ensure spinNumber is at least 1 to avoid negative index
            const effectiveSpinNum = Math.max(1, spinNumber);
            const setIndex = (effectiveSpinNum - 1) % QUESTION_SETS.length;
            setCurrentSet(QUESTION_SETS[setIndex]);

            // Clear answers
            setAnswers({});
            setTouched({});
        }
    }, [isOpen, spinNumber]);

    const handleSingleChange = (qId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleMultiChange = (qId: string, value: string) => {
        setAnswers(prev => {
            const current: string[] = prev[qId] || [];
            if (current.includes(value)) {
                return { ...prev, [qId]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [qId]: [...current, value] };
            }
        });
    };

    const handleMatrixChange = (qId: string, row: string, col: string) => {
        setAnswers(prev => {
            const currentMatrix = prev[qId] || {};
            return {
                ...prev,
                [qId]: { ...currentMatrix, [row]: col }
            };
        });
    };

    const isQuestionAnswered = (q: Question) => {
        const val = answers[q.id];
        if (!val) return false;
        if (q.type === 'single') return !!val;
        if (q.type === 'multiple') return val.length > 0;
        if (q.type === 'matrix') {
            // Must have answer for every row
            return q.rows?.every(row => val[row]) || false;
        }
        return false;
    };

    const allAnswered = currentSet?.questions.every(isQuestionAnswered) || false;

    const handleSubmit = () => {
        if (allAnswered && currentSet) {
            // Format responses
            const formattedResponses = currentSet.questions.map(q => ({
                questionId: q.id,
                questionText: q.text,
                answer: answers[q.id]
            }));

            onSubmit(formattedResponses, currentSet.title);
        } else {
            // Mark all as touched to show errors
            const newTouched: Record<string, boolean> = {};
            currentSet?.questions.forEach(q => newTouched[q.id] = true);
            setTouched(newTouched);
        }
    };

    if (!isOpen || !currentSet) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 backdrop-blur-md bg-slate-900/20"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl p-6 max-w-2xl w-full relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center mb-4 shadow-lg"
                        >
                            <Sparkles className="text-white" size={32} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">{currentSet.title}</h2>
                        <p className="text-slate-500 text-sm">
                            Answer 3 quick questions to claim your <span className="font-bold text-brand-purple">{prizeAmount} bonus points</span>
                        </p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-8 mb-8">
                        {currentSet.questions.map((q, idx) => (
                            <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 flex gap-2">
                                    <span className="text-brand-purple">{idx + 1}.</span> {q.text}
                                </h3>

                                {q.type === 'single' && (
                                    <div className="space-y-2">
                                        {q.options?.map((opt) => (
                                            <label key={opt} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-brand-purple/50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={opt}
                                                    checked={answers[q.id] === opt}
                                                    onChange={(e) => handleSingleChange(q.id, e.target.value)}
                                                    className="w-4 h-4 text-brand-purple focus:ring-brand-purple"
                                                />
                                                <span className="text-sm text-slate-700">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'multiple' && (
                                    <div className="space-y-2">
                                        {q.options?.map((opt) => (
                                            <label key={opt} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-brand-purple/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                    checked={answers[q.id]?.includes(opt) || false}
                                                    onChange={(e) => handleMultiChange(q.id, e.target.value)}
                                                    className="w-4 h-4 text-brand-purple focus:ring-brand-purple rounded"
                                                />
                                                <span className="text-sm text-slate-700">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'matrix' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[500px]">
                                            <thead>
                                                <tr>
                                                    <th className="p-2"></th>
                                                    {q.columns?.map(col => (
                                                        <th key={col} className="p-2 text-xs font-semibold text-slate-500">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {q.rows?.map(row => (
                                                    <tr key={row}>
                                                        <td className="p-2 text-sm text-slate-700 font-medium">{row}</td>
                                                        {q.columns?.map(col => (
                                                            <td key={col} className="p-2 text-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`${q.id}_${row}`}
                                                                    checked={answers[q.id]?.[row] === col}
                                                                    onChange={() => handleMatrixChange(q.id, row, col)}
                                                                    className="w-4 h-4 text-brand-purple focus:ring-brand-purple"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {touched[q.id] && !isQuestionAnswered(q) && (
                                    <div className="mt-2 text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle size={12} /> This question is required
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!allAnswered && Object.keys(touched).length > 0}
                        className={`shadow-xl transition-all h-12 ${allAnswered
                            ? 'shadow-brand-purple/30 hover:shadow-brand-purple/50'
                            : 'opacity-80'
                            }`}
                    >
                        {allAnswered ? (
                            <>
                                <CheckCircle2 size={20} />
                                Submit & Claim {prizeAmount} Points
                            </>
                        ) : (
                            'Submit Answer'
                        )}
                    </Button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SpinFeedbackModal;
