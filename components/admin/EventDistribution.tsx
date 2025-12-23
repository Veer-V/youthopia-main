
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building2, ChevronDown, ChevronRight, Users, Trophy } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { UserData, EventData } from '../../types';

const EventDistribution: React.FC = () => {
    const { users, events } = useData();
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to normalize and group colleges (Reused logic)
    const getCollegeStatsForEvent = (eventId: string) => {
        const participants = users.filter(u => {
            if (u.role && u.role !== 'student') return false;
            if (!u.registered) return false;

            if (Array.isArray(u.registered)) {
                return u.registered.includes(eventId);
            } else if (typeof u.registered === 'object') {
                return Object.keys(u.registered).includes(eventId);
            }
            return false;
        });

        const groups: Record<string, { display: string; count: number }> = {};

        // Grouping Rules Configuration
        const KEYWORD_GROUPS = [
            { id: 'birla', keywords: ['birla'], label: 'Birla College' },
            { id: 'somaiya', keywords: ['somaiya'], label: 'Somaiya Vidyavihar' },
            { id: 'sies', keywords: ['sies'], label: 'SIES College' },
            { id: 'ves', keywords: ['ves', 'vivekanand'], label: 'VES College' },
            { id: 'dypatil', keywords: ['dy patil', 'd.y. patil', 'd y patil'], label: 'D.Y. Patil University' },
            { id: 'model', keywords: ['model college'], label: 'Model College' },
            { id: 'pendharkar', keywords: ['pendharkar'], label: 'Pendharkar College' },
            { id: 'saket', keywords: ['saket'], label: 'Saket College' },
            { id: 'manjunath', keywords: ['manjunath'], label: 'Manjunatha College' },
            { id: 'bedekar', keywords: ['bedekar', 'vpm'], label: 'Joshi Bedekar College' },
            { id: 'chm', keywords: ['chm', 'chandibai'], label: 'CHM College' },
            { id: 'agarwal', keywords: ['agarwal'], label: 'Agarwal College' },
            { id: 'royal', keywords: ['royal'], label: 'Royal College' },
            { id: 'sst', keywords: ['sst'], label: 'SST College' },
            { id: 'vaze', keywords: ['vaze', 'kelkar'], label: 'Vaze Kelkar College' },
            { id: 'bnn', keywords: ['bnn'], label: 'BNN College' },
            { id: 'vikas', keywords: ['vikas'], label: 'Vikas College' },
            { id: 'ratnam', keywords: ['ratnam'], label: 'Ratnam College' },
            { id: 'menon', keywords: ['menon'], label: 'Menon College' },
            { id: 'ruparel', keywords: ['ruparel'], label: 'Ruparel College' },
            { id: 'ruia', keywords: ['ruia'], label: 'Ruia College' },
            { id: 'jaihind', keywords: ['jai hind', 'jaihind'], label: 'Jai Hind College' },
            { id: 'mithibai', keywords: ['mithibai'], label: 'Mithibai College' },
            { id: 'wilson', keywords: ['wilson'], label: 'Wilson College' },
            { id: 'xavier', keywords: ['xavier'], label: 'St. Xaviers College' },
            { id: 'kc', keywords: ['kc college'], label: 'KC College' },
            { id: 'hr', keywords: ['hr college'], label: 'HR College' },
        ];

        const IGNORED_SUFFIXES = [
            'college', 'degree', 'junior', 'senior', 'arts', 'science', 'commerce',
            'institute', 'technology', 'management', 'university', 'trust', 'society',
            'of', 'and', '&', 'the', 'campus', 'autonomous'
        ];

        participants.forEach(u => {
            const rawInstitute = u.institute || "Unknown Institute";
            const lowerName = rawInstitute.trim().toLowerCase();

            let key = '';
            let display = rawInstitute.trim();
            let matched = false;

            for (const group of KEYWORD_GROUPS) {
                if (group.keywords.some(kw => lowerName.includes(kw))) {
                    key = group.id;
                    display = group.label;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                let cleanName = lowerName.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
                const words = cleanName.split(' ');
                const coreWords = words.filter(w => !IGNORED_SUFFIXES.includes(w) && w.length > 2);

                if (coreWords.length > 0) {
                    key = coreWords.join('_');
                } else {
                    key = 'other_unknown';
                }
            }

            if (!groups[key]) {
                groups[key] = { display, count: 0 };
            }
            groups[key].count++;
        });

        return Object.values(groups).sort((a, b) => b.count - a.count);
    };

    // Calculate stats for all events once
    const eventsWithStats = useMemo(() => {
        return events.map(event => {
            const collegeStats = getCollegeStatsForEvent(event.id);
            const totalParticipants = collegeStats.reduce((sum, c) => sum + c.count, 0);
            return {
                ...event,
                collegeStats,
                totalParticipants
            };
        }).sort((a, b) => b.totalParticipants - a.totalParticipants);
    }, [users, events]);

    const filteredEvents = eventsWithStats.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Event-wise Distribution</h2>
                    <p className="text-slate-500 text-sm">College participation breakdown for each event</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                    />
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >
                {filteredEvents.map((event) => (
                    <motion.div key={event.id} variants={item} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div
                            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                            className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${event.category === 'Intercollegiate' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'}`}>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Users size={14} /> {event.totalParticipants} Participants</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Building2 size={14} /> {event.collegeStats.length} Colleges</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Top College Preview */}
                                {event.collegeStats.length > 0 && (
                                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                        <Trophy size={12} className="text-yellow-500" />
                                        <span>Top: {event.collegeStats[0].display}</span>
                                    </div>
                                )}
                                <button className="text-slate-400">
                                    {expandedEvent === event.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedEvent === event.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50/50 border-t border-slate-100"
                                >
                                    <div className="p-5">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Participation by College</h4>
                                        <div className="space-y-3">
                                            {event.collegeStats.length > 0 ? (
                                                event.collegeStats.map((stat, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-6 text-xs font-bold text-slate-400">#{idx + 1}</div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-medium text-slate-700">{stat.display}</span>
                                                                <span className="text-xs font-bold text-slate-900">{stat.count}</span>
                                                            </div>
                                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-brand-purple rounded-full"
                                                                    style={{ width: `${(stat.count / event.totalParticipants) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-slate-400 text-sm">No participation recorded yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default EventDistribution;
