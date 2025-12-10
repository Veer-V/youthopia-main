
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Activity, Calendar, Wrench, ExternalLink, Globe } from 'lucide-react';
import Button from '../Button';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center pt-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-wide">
          NEED HELP? WE ARE HERE!
        </h2>
        <p className="text-slate-500 mt-2 text-lg">Support resources for your well-being.</p>
      </div>

      {/* Tech Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                <Wrench size={32} />
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-800">TECH SUPPORT</h3>
                <p className="text-slate-500">Facing technical issues?</p>
            </div>
        </div>
        <div className="flex flex-col items-center md:items-end bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 w-full md:w-auto">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Reach out to</div>
            <div className="font-black text-2xl text-slate-900">XXX</div>
        </div>
      </motion.div>

      {/* Mental Health Resources Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-8 bg-brand-purple rounded-full"></span>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
                MENTAL HEALTH RESOURCES
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Helpline Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#fdf4ff] to-white p-8 rounded-3xl border border-purple-100 shadow-sm md:col-span-2 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-20 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl shrink-0">
                        <Phone size={32} />
                    </div>
                    <div className="flex-1 w-full">
                        <h4 className="font-bold text-xl md:text-2xl text-slate-900 mb-2">24X7 MENTAL HEALTH HELPLINE</h4>
                        <p className="text-slate-500 mb-6">Always available to listen and support.</p>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="tel:1800120820050" className="flex-1 flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow group">
                                <Phone size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-slate-800 text-lg">1800 120 820 050</span>
                            </a>
                            <a href="https://mpowerminds.com/chat" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 bg-brand-purple text-white px-6 py-4 rounded-xl shadow-lg hover:bg-purple-700 transition-colors shadow-purple-500/30">
                                <MessageCircle size={20} />
                                <span className="font-bold text-lg">Chat with us</span>
                            </a>
                        </div>
                        <div className="mt-4 text-center md:text-left">
                            <a href="https://mpowerminds.com/chat" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-purple hover:underline flex items-center gap-1 justify-center md:justify-start">
                                <Globe size={14} /> mpowerminds.com/chat
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Score Card */}
            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
            >
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <Activity size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-900 mb-3">Check Mental Health Score</h4>
                <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
                    The results of this questionnaire will help you in understanding where you belong on the mental health spectrum.
                </p>
                
                <div className="space-y-3">
                    <a href="https://mpowerminds.com/score" target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="secondary" fullWidth className="gap-2 py-4">
                            Check Score Now <ExternalLink size={18} />
                        </Button>
                    </a>
                    <a href="https://mpowerminds.com/score" target="_blank" rel="noopener noreferrer" className="block text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                        mpowerminds.com/score
                    </a>
                </div>
            </motion.div>

            {/* Appointments Card */}
            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
            >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-900 mb-3">Book Appointments</h4>
                <p className="text-slate-500 text-sm mb-6">
                    Schedule a consultation with our professionals.
                </p>
                
                <div className="mt-auto space-y-4">
                    <a href="tel:+917045566526" className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-4 transition-colors group">
                         <Phone size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                         <span className="text-lg font-bold text-slate-800">+91 704 556 6526</span>
                    </a>
                    <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Available Timings</div>
                        <div className="text-sm font-bold text-blue-900">10 AM to 5 PM</div>
                        <div className="text-xs font-medium text-blue-700">Monday & Saturday</div>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Help;
