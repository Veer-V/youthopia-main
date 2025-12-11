
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Search, Clock, CheckCircle2, Quote, AlertCircle, ArrowLeft, Users, AlertTriangle, ArrowUpDown, X, CircleCheck, CircleAlert, Sparkles, Award } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { EventData, UserData } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TeamMember {
  name: string;
  id: string;
}

interface ActivitiesProps {
  registeredEventIds: string[];
  onRegister: (eventId: string) => void;
  user: UserData | null;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=1000&q=80";

const Activities: React.FC<ActivitiesProps> = ({ registeredEventIds, onRegister, user }) => {
  const { events, completedEvents, addFeedback } = useData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [registeringState, setRegisteringState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Team Registration State
  const [teamSize, setTeamSize] = useState<number>(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamError, setTeamError] = useState<string | null>(null);

  const filters = ['All', 'Registered', 'Completed', 'Engagement', 'Intercollegiate'];

  const currentUserEmail = user?.email || '';
  const myCompletedIds = currentUserEmail ? (completedEvents[currentUserEmail] || []) : [];

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Extract unique dates for filter
  const uniqueDates = useMemo(() => {
    const dates = new Set(events.map(e => e.date));
    return ['All Dates', ...Array.from(dates)];
  }, [events]);

  // Memoize filtered events to improve performance
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Category Filter
      if (activeFilter === 'Registered') {
        if (!registeredEventIds.includes(e.id)) return false;
      } else if (activeFilter === 'Completed') {
        if (!myCompletedIds.includes(e.id)) return false;
      } else if (activeFilter !== 'All') {
        if (e.category !== activeFilter) return false;
      }

      // Search Query Filter
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.loc.toLowerCase().includes(searchQuery.toLowerCase());

      // Date Filter
      const matchesDate = dateFilter === 'All Dates' || e.date === dateFilter;

      return matchesSearch && matchesDate;
    }).sort((a, b) => {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  }, [events, activeFilter, searchQuery, dateFilter, sortOrder, registeredEventIds, myCompletedIds]);

  // Pagination Logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRegisterClick = (e: React.MouseEvent, event: EventData) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setRegisteringState('idle');
    setSelectedEmoji(null);
    setTeamError(null);

    if (event.isTeamEvent) {
      const min = event.minMembers || 2;
      setTeamSize(min);
      setTeamMembers(Array(min).fill({ name: '', id: '' }));
    }
  };

  const handleTeamSizeChange = (newSize: number) => {
    setTeamSize(newSize);
    setTeamMembers(prev => {
      const newMembers = [...prev];
      if (newSize > prev.length) {
        for (let i = prev.length; i < newSize; i++) {
          newMembers.push({ name: '', id: '' });
        }
      } else {
        newMembers.splice(newSize);
      }
      return newMembers;
    });
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (teamError) setTeamError(null);
  };

  const validateMemberId = (id: string, currentIndex: number): string | null => {
    const trimmedId = id.trim().toUpperCase();
    if (!trimmedId) return null;
    const isDuplicate = teamMembers.some((m, idx) =>
      idx !== currentIndex && m.id.trim().toUpperCase() === trimmedId
    );
    if (isDuplicate) return "Duplicate ID found in this team list.";
    return null;
  };

  const confirmRegistration = () => {
    if (!selectedEvent) return;

    if (selectedEvent.isTeamEvent) {
      const hasEmptyFields = teamMembers.some(m => !m.name.trim() || !m.id.trim());
      if (hasEmptyFields) {
        setTeamError("Please fill in details for all team members.");
        setToast({ message: "Please fill in details for all team members.", type: 'error' });
        return;
      }
      for (let i = 0; i < teamMembers.length; i++) {
        const error = validateMemberId(teamMembers[i].id, i);
        if (error) {
          setTeamError("Please fix the errors in the team list before submitting.");
          setToast({ message: "Please fix the errors in the team list before submitting.", type: 'error' });
          return;
        }
      }
    }

    setRegisteringState('loading');
    setTimeout(() => {
      onRegister(selectedEvent.id);
      setRegisteringState('success');
      setToast({ message: `Successfully registered for ${selectedEvent.title}!`, type: 'success' });
    }, 600);
  };

  const handleFeedbackSubmit = (emoji: string) => {
    if (!selectedEvent || !user) return;
    setSelectedEmoji(emoji);
    setToast({ message: "Thanks for your feedback!", type: 'success' });

    addFeedback({
      id: Date.now().toString(),
      eventId: selectedEvent.id,
      eventName: selectedEvent.title,
      userEmail: user.email,
      userName: user.name,
      emoji: emoji,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
    setDateFilter('All Dates');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || activeFilter !== 'All' || dateFilter !== 'All Dates';

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Activity</h2>
        <p className="text-slate-500 mt-1">Explore events, register, and track your stamps.</p>
      </div>

      {/* Search & Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Input
            variant="light"
            placeholder="Search events by name or location..."
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            rightIcon={searchQuery ? <X size={16} /> : undefined}
            onRightIconClick={() => setSearchQuery('')}
          />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <div className="flex-1">
            <Input
              as="select"
              variant="light"
              icon={<Calendar size={18} />}
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              options={uniqueDates}
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="bg-white border border-slate-200 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors flex items-center gap-2 font-medium"
            title={sortOrder === 'asc' ? 'Sort Z-A' : 'Sort A-Z'}
          >
            <ArrowUpDown size={18} />
            <span className="hidden sm:inline">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={resetFilters}
                className="bg-red-50 border border-red-100 px-3 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
                title="Reset All Filters"
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category Pills & Pagination Wrapper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex bg-white p-1 rounded-full shadow-sm border border-slate-200 overflow-x-auto max-w-full no-scrollbar relative">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap z-10 ${activeFilter === filter ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {activeFilter === filter && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#0f172a] rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {filter}
            </button>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 ml-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === page
                  ? 'bg-brand-yellow text-slate-900 font-bold shadow-sm'
                  : 'hover:bg-slate-100'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {displayedEvents.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {displayedEvents.map((evt, i) => {
            const isRegistered = registeredEventIds.includes(evt.id);
            const isCompleted = myCompletedIds.includes(evt.id);

            return (
              <motion.div
                key={evt.id}
                variants={item}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15)"
                }}
                className={`bg-white rounded-2xl shadow-sm border flex flex-col h-full cursor-pointer relative overflow-hidden group ${isCompleted ? 'border-green-300 ring-1 ring-green-100' : isRegistered ? 'border-blue-200' : 'border-slate-100'}`}
                onClick={(e) => handleRegisterClick(e, evt)}
              >
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative bg-slate-100">
                  <img
                    src={evt.image || PLACEHOLDER_IMAGE}
                    alt={evt.title}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCompleted ? 'grayscale' : ''}`}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-xs font-bold px-2 py-1 rounded-md text-slate-800 shadow-sm">
                    {evt.category}
                  </div>

                  {/* Status Badge */}
                  {isCompleted ? (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Award size={12} /> COMPLETED
                    </div>
                  ) : isRegistered && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <CheckCircle2 size={12} /> REGISTERED
                    </div>
                  )}

                  {/* Points Badge on Card */}
                  {!isCompleted && (evt.points || 0) > 0 && (
                    <div className="absolute bottom-3 right-3 bg-brand-yellow text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-20 border border-yellow-400">
                      <Sparkles size={10} className="text-slate-800" /> +{evt.points} Bonus
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
                    {evt.title}
                  </h3>

                  <div className="space-y-2 text-sm text-slate-500 mb-6 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-purple" />
                      <span className="font-medium">{evt.date}, {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand-pink" />
                      <span className="font-medium">{evt.loc}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant={isCompleted ? "white" : isRegistered ? "white" : "secondary"}
                    fullWidth
                    className={`py-2 text-sm font-bold shadow-md ${isCompleted ? 'border-green-200 text-green-600' : isRegistered ? 'border-blue-200 text-blue-600' : 'shadow-yellow-500/10'}`}
                    disabled={false}
                    onClick={(e) => handleRegisterClick(e, evt)}
                  >
                    {isCompleted ? 'View Details' : isRegistered ? 'View Details' : (evt.isTeamEvent ? 'Register Team' : 'Register Now')}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-slate-400">No events found.</p>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-brand-purple font-bold text-sm mt-2 hover:underline">
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="flex md:hidden justify-center items-center gap-4 pt-4">
          <Button
            variant="white"
            shape="rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2"
          >
            Prev
          </Button>
          <span className="text-sm font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
          <Button
            variant="white"
            shape="rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative z-10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image/Quote Section */}
              <div className={`relative h-64 bg-gradient-to-r ${selectedEvent.imageColor} flex flex-col justify-center items-center text-center p-8 text-white overflow-hidden shrink-0`}>
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 z-0"
                >
                  <img src={selectedEvent.image || PLACEHOLDER_IMAGE} alt="" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60" />
                </motion.div>

                <div className="relative z-10 w-full flex flex-col items-center">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-[-10px] right-[-10px] p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all"
                  >
                    <X size={24} />
                  </button>

                  <Quote size={48} className="text-white/40 mb-4" />
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-extrabold italic font-serif leading-tight max-w-2xl drop-shadow-lg"
                  >
                    "{selectedEvent.quote}"
                  </motion.h2>

                  {(myCompletedIds.includes(selectedEvent.id)) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                    >
                      <Award size={16} /> COMPLETED
                    </motion.div>
                  )}

                  {!(myCompletedIds.includes(selectedEvent.id)) && (selectedEvent.points || 0) > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="mt-4 bg-brand-yellow/90 backdrop-blur-md text-brand-dark px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                    >
                      <Sparkles size={14} /> <span>+{selectedEvent.points} Bonus Points</span>
                    </motion.div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10" />
              </div>

              <div className="flex-1 p-6 md:p-10 w-full">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{selectedEvent.title}</h1>
                    {selectedEvent.isTeamEvent && (
                      <span className="bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-purple/20 self-start">
                        Team Event
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-lg">{selectedEvent.description}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Calendar size={24} /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date</div>
                      <div className="font-bold text-slate-800">{selectedEvent.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><Clock size={24} /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time</div>
                      <div className="font-bold text-slate-800">{selectedEvent.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><MapPin size={24} /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</div>
                      <div className="font-bold text-slate-800">{selectedEvent.loc}</div>
                    </div>
                  </div>
                </div>

                {/* Rules Section */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-brand-purple" />
                    Rules & Regulations
                  </h3>
                  <ul className="space-y-4">
                    {selectedEvent.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600">
                        <div className="mt-1 min-w-[20px]"><CheckCircle2 size={18} className="text-green-500" /></div>
                        <span>{rule}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3 text-slate-600">
                      <div className="mt-1 min-w-[20px]"><CheckCircle2 size={18} className="text-green-500" /></div>
                      <span>Participants must report to the venue 15 minutes before the scheduled time.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600">
                      <div className="mt-1 min-w-[20px]"><CheckCircle2 size={18} className="text-green-500" /></div>
                      <span>Student ID card is mandatory for entry.</span>
                    </li>
                  </ul>
                </div>

                {/* TEAM REGISTRATION FORM */}
                {selectedEvent.isTeamEvent && !registeredEventIds.includes(selectedEvent.id) && !(myCompletedIds.includes(selectedEvent.id)) && (
                  <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-3xl p-6 md:p-8 mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-brand-purple text-white rounded-lg"><Users size={24} /></div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Team Registration</h3>
                        <p className="text-slate-500 text-sm">You are the Team Leader. Add your members below.</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">
                        Select Team Size
                      </label>
                      <select
                        className="w-full md:w-1/3 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all"
                        value={teamSize}
                        onChange={(e) => handleTeamSizeChange(Number(e.target.value))}
                      >
                        {Array.from(
                          { length: (selectedEvent.maxMembers || 12) - (selectedEvent.minMembers || 2) + 1 },
                          (_, i) => (selectedEvent.minMembers || 2) + i
                        ).map(num => (
                          <option key={num} value={num}>{num} Members</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      {teamMembers.map((member, idx) => {
                        const idError = validateMemberId(member.id, idx);
                        return (
                          <div key={idx} className={`bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center ${idError ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}>
                            <span className="bg-slate-100 text-slate-500 font-bold text-xs px-2 py-1 rounded-md uppercase">
                              Member {idx + 1} {idx === 0 && "(Leader)"}
                            </span>
                            <div className="flex-1 w-full">
                              <input
                                placeholder="Full Name"
                                className="w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-purple"
                                value={member.name}
                                onChange={(e) => updateMember(idx, 'name', e.target.value)}
                              />
                            </div>
                            <div className="flex-1 w-full flex flex-col">
                              <input
                                placeholder="Student ID (e.g., YTH-2025-XXX)"
                                className={`w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 ${idError ? 'focus:ring-red-500 text-red-600' : 'focus:ring-brand-purple'}`}
                                value={member.id}
                                onChange={(e) => updateMember(idx, 'id', e.target.value)}
                              />
                              {idError && (
                                <span className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1">
                                  <AlertTriangle size={10} /> {idError}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {teamError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600"
                      >
                        <AlertTriangle className="shrink-0" size={20} />
                        <span className="font-semibold text-sm">{teamError}</span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Footer Action */}
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
                  {(myCompletedIds.includes(selectedEvent.id)) ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-green-100 text-green-700 px-8 py-4 rounded-full font-bold flex items-center gap-3 text-lg border border-green-200"
                      >
                        <Award size={24} /> Event Completed!
                      </motion.div>
                      <p className="text-slate-500 text-sm">Points have been added to your balance.</p>
                      <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 text-sm mt-2">
                        Close Details
                      </button>
                    </div>
                  ) : (registeringState === 'success' || registeredEventIds.includes(selectedEvent.id)) ? (
                    <div className="flex flex-col items-center gap-6 w-full">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-green-100 text-green-700 px-8 py-4 rounded-full font-bold flex items-center gap-3 text-lg"
                      >
                        <CheckCircle2 size={24} /> Registered Successfully!
                      </motion.div>

                      {/* Feedback Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center w-full max-w-md"
                      >
                        {!selectedEmoji ? (
                          <>
                            <p className="text-slate-800 font-bold mb-4">How excited are you for this event?</p>
                            <div className="flex justify-center gap-4">
                              {['😐', '🙂', '😀', '🤩', '🔥'].map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.2, rotate: 10 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleFeedbackSubmit(emoji)}
                                  className="text-3xl w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 hover:border-brand-yellow hover:bg-yellow-50 transition-colors"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-brand-purple font-bold flex flex-col items-center"
                          >
                            <motion.div
                              initial={{ scale: 0.5, rotate: -30 }}
                              animate={{ scale: 1.5, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 10 }}
                              className="text-5xl mb-4"
                            >
                              {selectedEmoji}
                            </motion.div>
                            <p>Thanks for your feedback!</p>
                            <p className="text-xs text-slate-400 font-normal mt-1">We're glad to hear from you.</p>
                          </motion.div>
                        )}
                      </motion.div>

                      <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 text-sm mt-2">
                        Close Details
                      </button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        fullWidth
                        shape="pill"
                        className="max-w-md py-4 text-lg shadow-xl shadow-yellow-500/20"
                        onClick={confirmRegistration}
                        isLoading={registeringState === 'loading'}
                        disabled={registeringState === 'loading'}
                      >
                        {selectedEvent.isTeamEvent ? `Register Team (${teamSize})` : 'Confirm Registration'}
                      </Button>
                      <p className="text-xs text-slate-400">By clicking confirm, you agree to the event rules.</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[300px] justify-center backdrop-blur-md ${toast.type === 'success'
                ? 'bg-slate-900/95 text-white border border-slate-700'
                : 'bg-red-500/95 text-white border border-red-400'
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Activities;
