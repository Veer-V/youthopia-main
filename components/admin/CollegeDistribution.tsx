import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Search, ChevronDown, ChevronRight, School, MapPin } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { UserData } from '../../types';

const CollegeDistribution: React.FC = () => {
    const { users, events } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCollege, setExpandedCollege] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string>('all');

    // Group users by institute
    const groupedColleges = useMemo(() => {
        const groups: Record<string, { display: string; students: UserData[] }> = {};

        // Grouping Rules Configuration
        const KEYWORD_GROUPS = [
            { id: 'somaiya', keywords: ['somaiya'], label: 'Somaiya Vidyavihar' },
            { id: 'sies', keywords: ['sies'], label: 'SIES College' },
            { id: 'ves', keywords: ['ves', 'vivekanand'], label: 'VES College' },
            { id: 'dypatil', keywords: ['dy patil', 'd.y. patil', 'd y patil'], label: 'D.Y. Patil University' },
            { id: 'model', keywords: ['model college'], label: 'Model College' }, // "model" might be too generic, "model college" is safer
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
            { id: 'kc', keywords: ['kc college'], label: 'KC College' },  // "kc" is too short
            { id: 'hr', keywords: ['hr college'], label: 'HR College' },  // "hr" is too short
        ];

        const IGNORED_SUFFIXES = [
            'college', 'degree', 'junior', 'senior', 'arts', 'science', 'commerce',
            'institute', 'technology', 'management', 'university', 'trust', 'society',
            'of', 'and', '&', 'the', 'campus', 'autonomous'
        ];

        const EXCLUDED_KEYWORDS = ['birla', 'biral', 'brila', 'bkbck', 'bk', 'college', 'b.k.birka'];

        users.forEach(u => {
            // Only consider students
            if (u.role && u.role !== 'student') return;

            // Filter by selected event
            if (selectedEventId !== 'all') {
                let isRegistered = false;
                if (u.registered) {
                    if (Array.isArray(u.registered)) {
                        isRegistered = u.registered.includes(selectedEventId);
                    } else if (typeof u.registered === 'object') {
                        isRegistered = Object.keys(u.registered).includes(selectedEventId);
                    }
                }
                if (!isRegistered) return;
            }

            const rawInstitute = u.institute || "Unknown Institute";
            const lowerName = rawInstitute.trim().toLowerCase();

            // Exclude unwanted colleges
            if (EXCLUDED_KEYWORDS.some(kw => lowerName.includes(kw))) return;

            let key = '';
            let display = rawInstitute.trim();
            let matched = false;

            // 1. Check Explicit Keyword Groups
            for (const group of KEYWORD_GROUPS) {
                if (group.keywords.some(kw => lowerName.includes(kw))) {
                    key = group.id;
                    display = group.label;
                    matched = true;
                    break;
                }
            }

            // 2. Fallback: Generic Core Word Extraction
            if (!matched) {
                // Remove punctuation and extra spaces
                let cleanName = lowerName.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');

                // Remove common suffixes/words to find the "core" name
                // We split, filter out ignored words, and join back
                const words = cleanName.split(' ');
                const coreWords = words.filter(w => !IGNORED_SUFFIXES.includes(w) && w.length > 2); // Ignore very short words too

                if (coreWords.length > 0) {
                    key = coreWords.join('_');
                    // Try to capitalize for display if it was fully lowercased
                    // (We keep the rawInstitute as display usually, but for grouping key we use this)
                } else {
                    key = 'other_unknown';
                }
            }

            if (!groups[key]) {
                groups[key] = {
                    display: display,
                    students: []
                };
            } else {
                // If we're merging into an existing non-keyword group, maybe keep the longer display name?
                // or just keep the first one found. Let's keep first one for stability.
            }
            groups[key].students.push(u);
        });

        // Convert to array and sort by count (descending)
        return Object.values(groups)
            .map(g => ({
                name: g.display,
                count: g.students.length,
                students: g.students
            }))
            .sort((a, b) => b.count - a.count);
    }, [users, selectedEventId]);

    // Filter based on search
    const filteredColleges = groupedColleges.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">College Distribution</h2>
                    <p className="text-slate-500 text-sm">Analytics of student participation grouped by institute</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* Event Filter */}
                    <div className="relative w-full md:w-60">
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                        >
                            <option value="all">All Events Distribution</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search colleges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <School size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{groupedColleges.length}</div>
                            <div className="text-slate-500 text-sm">Active Institutes</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">
                                {groupedColleges.reduce((sum, item) => sum + item.count, 0)}
                            </div>
                            <div className="text-slate-500 text-sm">
                                {selectedEventId === 'all' ? 'Total Students' : 'Participants'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">
                                {groupedColleges.length > 0 ? groupedColleges[0].name : '-'}
                            </div>
                            <div className="text-slate-500 text-sm">Top Participating Institute</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* College List */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >
                {filteredColleges.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <Building2 size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No colleges found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    filteredColleges.map((college, idx) => (
                        <motion.div key={idx} variants={item} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div
                                onClick={() => setExpandedCollege(expandedCollege === college.name ? null : college.name)}
                                className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{college.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>{college.count} Students</span>
                                            <span>•</span>
                                            <span className={college.count > 10 ? "text-green-600 font-medium" : "text-slate-400"}>
                                                {college.count > 10 ? "High Participation" : "Growing"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 justify-between md:justify-end">

                                    {/* Progress Bar visual for relative size */}
                                    <div className="hidden md:block w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-purple rounded-full"
                                            style={{ width: `${Math.min((college.count / (groupedColleges[0]?.count || 1)) * 100, 100)}%` }}
                                        />
                                    </div>

                                    <button className="text-slate-400">
                                        {expandedCollege === college.name ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details - Student List */}
                            <AnimatePresence>
                                {expandedCollege === college.name && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50/50 border-t border-slate-100"
                                    >
                                        <div className="p-5">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Registered Students</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {college.students.map(student => (
                                                    <div key={student.id || student._id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="text-sm font-medium text-slate-900 truncate">{student.name}</div>
                                                            <div className="text-xs text-slate-500 truncate">{student.email}</div>
                                                        </div>
                                                        <div className="ml-auto flex flex-col items-end">
                                                            <span className="text-[10px] font-bold text-brand-purple bg-purple-50 px-1.5 py-0.5 rounded">
                                                                {student.points || 0} pts
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default CollegeDistribution;
