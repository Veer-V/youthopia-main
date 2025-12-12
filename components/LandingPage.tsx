
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coins, Calendar, MapPin, Twitter, Instagram, Facebook, ArrowUp } from 'lucide-react';
import Button from './Button';

interface LandingPageProps {
  onNavigateAuth: () => void;
  onFeatureClick?: (section: 'redeem' | 'activities' | 'map') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth, onFeatureClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (section: 'redeem' | 'activities' | 'map') => {
    if (onFeatureClick) {
      onFeatureClick(section);
    } else {
      onNavigateAuth();
    }
  };

  const features = [
    {
      icon: <Coins size={32} className="text-yellow-600" />,
      bg: "bg-yellow-50",
      title: "Earn & Redeem",
      desc: "Collect points as you join the fun. Use them to get cool rewards!",
      action: "Start Earning",
      color: "text-yellow-600",
      target: 'redeem' as const
    },
    {
      icon: <Calendar size={32} className="text-blue-600" />,
      bg: "bg-blue-50",
      title: "Event Schedule",
      desc: "Check what’s happening and when. Never miss your favorite event.",
      action: "View Timeline",
      color: "text-blue-600",
      target: 'activities' as const
    },
    {
      icon: <MapPin size={32} className="text-purple-600" />,
      bg: "bg-purple-50",
      title: "What's happening, where?",
      desc: "Find your way around the fest easily. Every place you need is right here",
      action: "Explore Map",
      color: "text-purple-600",
      target: 'map' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0faff] via-white to-white text-slate-900 relative overflow-x-hidden font-sans">

      {/* Decorative Bunting / Triangles */}
      <div className="absolute top-20 left-10 md:left-32 transform -rotate-12 pointer-events-none opacity-80">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[25px] border-t-blue-600 border-r-[15px] border-r-transparent"></div>
      </div>
      <div className="absolute top-24 left-24 md:left-52 transform rotate-12 pointer-events-none opacity-80">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[25px] border-t-yellow-400 border-r-[15px] border-r-transparent"></div>
      </div>
      <div className="absolute top-20 right-10 md:right-32 transform rotate-12 pointer-events-none opacity-80">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[25px] border-t-blue-600 border-r-[15px] border-r-transparent"></div>
      </div>
      <div className="absolute top-24 right-24 md:right-52 transform -rotate-12 pointer-events-none opacity-80">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[25px] border-t-yellow-400 border-r-[15px] border-r-transparent"></div>
      </div>

      {/* Navbar - Minimal */}
      <nav className="relative z-50 flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto">
        <img
          src="/image/youthopia-logo-new.png"
          alt="Youthopia Logo"
          className="h-12 md:h-16 w-auto object-contain"
        />
        <Button variant="secondary" onClick={onNavigateAuth} className="px-6 py-2 shadow-lg shadow-cyan-100">
          Login / Register
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center mt-4 md:mt-8 px-4 max-w-6xl mx-auto w-full">



        {/* Main Logo & Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-3xl mx-auto mb-10 mix-blend-multiply"
        >
          <img
            src="/image/youthopia final logo.jpg"
            alt="MPOWER Youthopia"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </motion.div>
        <h2 className="text-l md:text-2xl font-bold text-[#1e293b] text-center">Welcome to <b>Youthopia</b>, a one-of-a-kind <b>Youth Mental Health Fest</b>, buzzing with
excitement! From dance duels to memory games, from activities that test your
strength to moments that help you take charge of your mental health, there’s so
much happening here. And we hope you explore, experience, and enjoy them all!</h2>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <Button variant="primary" onClick={onNavigateAuth} className="px-10 py-4 text-lg shadow-xl shadow-purple-200">
            Join the Community <ArrowRight size={20} />
          </Button>
          <Button
            variant="white"
            onClick={() => {
              const element = document.getElementById('events');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 text-lg border-2 border-slate-100 hover:bg-slate-50"
          >
            Explore Events
          </Button>
        </motion.div>

      </main>
      
      {/* Feature Section - "A Quick Tour of What's Inside" */}
      <section id="events" className="relative z-10 py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b]">A Quick Tour of What’s Inside</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleCardClick(feature.target)}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-20 h-20 rounded-full ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                {feature.desc}
              </p>
              <button className={`mt-auto ${feature.color} font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide`}>
                {feature.action} <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-12 px-6 relative mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">MPower Youthopia</h2>
            <p className="text-slate-400 mt-2 text-sm">Your space for mental wellness.</p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-xs">
          © 2025 Youthopia. All Rights Reserved. A project for hope and resilience.
        </div>

        {/* Scroll To Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg z-40 hover:bg-teal-400 transition-colors"
        >
          <ArrowUp size={20} />
        </motion.button>
      </footer>
    </div>
  );
};

export default LandingPage;
