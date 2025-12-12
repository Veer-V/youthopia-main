
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import { ViewState, UserData } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('splash');
  const [user, setUser] = useState<UserData | null>(null);
  const [initialBonus, setInitialBonus] = useState(0);

  // Check for session persistence
  React.useEffect(() => {
    const session = localStorage.getItem('yth_session');
    if (session) {
      try {
        const parsedUser = JSON.parse(session);
        setUser(parsedUser);
        setCurrentView('dashboard');
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem('yth_session');
      }
    }
  }, []);

  // Auto-refresh user data every 15 minutes
  React.useEffect(() => {
    if (!user || !user.Yid) return;

    const refreshUserData = async () => {
      try {
        const response = await fetch(`http://35.244.42.115:6001/user/data/${user.Yid}`);
        if (response.ok) {
          const updatedUser = await response.json();
          // Update user state and localStorage with fresh data
          setUser(updatedUser);
          localStorage.setItem('yth_session', JSON.stringify(updatedUser));
          console.log('User data refreshed from backend');
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    };

    // Refresh immediately on mount
    refreshUserData();

    // Set up interval to refresh every 15 minutes (900000 ms)
    const interval = setInterval(refreshUserData, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.Yid]);

  const handleLogin = (userData?: UserData, bonus: number = 0) => {
    if (userData) {
      setUser(userData);
      setInitialBonus(bonus);
      localStorage.setItem('yth_session', JSON.stringify(userData));
      // Role handling is done in renderView
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yth_session');
    setCurrentView('landing');
  };

  const renderView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentView('landing')} />;
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onNavigateAuth={() => setCurrentView('auth')} />
          </motion.div>
        );
      case 'auth':
        return (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <AuthPage
              onBack={() => setCurrentView('landing')}
              onLogin={handleLogin}
            />
          </motion.div>
        );
      case 'dashboard':
        // Determine which dashboard to show based on user role
        if (user?.role === 'executive') {
          return (
            <motion.div
              key="executive-dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExecutiveDashboard onLogout={handleLogout} />
            </motion.div>
          );
        }
        if (user?.role === 'admin') {
          return (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard onLogout={handleLogout} />
            </motion.div>
          );
        }
        return (
          <motion.div
            key="student-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StudentDashboard user={user} onLogout={handleLogout} initialBonus={initialBonus} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-white min-h-screen bg-brand-dark">
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </div>
  );
};

export default App;
