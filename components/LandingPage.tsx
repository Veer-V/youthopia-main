
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
      desc: "Collect bonus as you participate in events and unlock exclusive cool rewards!",
      action: "Start Earning",
      color: "text-yellow-600",
      target: 'redeem' as const
    },
    {
      icon: <Calendar size={32} className="text-blue-600" />,
      bg: "bg-blue-50",
      title: "Event Schedule",
      desc: "Stay updated with the timeline. Never miss your favorite competitions and shows.",
      action: "View Timeline",
      color: "text-blue-600",
      target: 'activities' as const
    },
    {
      icon: <MapPin size={32} className="text-purple-600" />,
      bg: "bg-purple-50",
      title: "Interactive Map",
      desc: "Navigate the fest effortlessly. Find every venue and stall right at your fingertips.",
      action: "Explore Map",
      color: "text-purple-600",
      target: 'map' as const
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden font-sans">

      {/* Background Gradients to match image glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-[20%] w-[800px] h-[400px] bg-brand-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-3 flex-1 min-w-0"
        >
          {/* Logo Space */}
          <div className="w-8 h-8 md:w-12 md:h-12 relative flex-shrink-0">
            <img
              src="/splash-logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if no logo image is found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Text Branding */}
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[0.5rem] md:text-xs font-bold text-slate-500 tracking-widest">MPOWER</span>
            <div className="text-lg md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink relative">
              YOUTHOPIA
              <span className="hidden md:inline absolute -top-1 -right-2 text-brand-yellow text-xs animate-pulse">✨</span>
            </div>
            <span className="text-[0.4rem] md:text-[0.5rem] text-slate-400 tracking-wider hidden sm:block">Unplug. Unleash. Unmind</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0 ml-2"
        >
          <Button variant="secondary" onClick={onNavigateAuth} className="px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-sm whitespace-nowrap">
            Join Now
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-12 px-4 max-w-7xl mx-auto w-full">

        {/* Main Banner Image - Replaced text with Image */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full flex justify-center mb-8 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full bg-slate-50 min-h-[300px] md:min-h-[500px] flex items-center justify-center">
            <img
              src="/landing-hero.png"
              alt="Birlotsav Presents MPOWER YOUTHOPIA"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "../image/youthopia-logo.png";
              }}
            />
          </div>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-500 text-base md:text-xl max-w-2xl mt-4 leading-relaxed"
        >
          Welcome to <strong className="text-slate-900">Youthopia</strong>! A festival buzzing with excitement.
          From dance duels to business pitches, discover your potential and celebrate with us.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mt-10 w-full md:w-auto"
        >
          <Button variant="dark" onClick={onNavigateAuth} className="px-8 py-4 text-base md:text-lg">
            Join the Community <ArrowRight size={20} />
          </Button>
          <Button
            variant="white"
            onClick={() => {
              const element = document.getElementById('events');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 text-base md:text-lg border-2 border-slate-100"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#fefce8", // light yellow
              borderColor: "#facc15", // brand-yellow
              color: "#854d0e"
            }}
            whileTap={{
              scale: 0.95,
              x: [0, -4, 4, -4, 4, 0], // Shake animation
              transition: { duration: 0.4 }
            }}
          >
            Explore Events
          </Button>
        </motion.div>

        {/* Floating elements for vibe */}
        <div className="absolute top-1/2 right-4 md:right-20 hidden md:block">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl border border-slate-100">
              🎸
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-20 left-4 md:left-20 hidden md:block">
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl border border-slate-100">
              🚀
            </div>
          </motion.div>
        </div>

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
            <h2 className="text-2xl font-bold">Youthopia</h2>
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
