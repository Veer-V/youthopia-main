
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User, GraduationCap, Building, Layers, Info, ShieldCheck, Check, AlertCircle, Mail } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import { AuthState, Gender, UserData } from '../types';
import { useData } from '../contexts/DataContext';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (data?: UserData, initialBonus?: number) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  const { addUser, login } = useData();
  const [activeTab, setActiveTab] = useState<AuthState>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    institute: '',
    class: '',
    stream: '',
    age: '',
    gender: '',
    adminId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Password Match Validation for Register
      if (activeTab === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setIsLoading(false);
          return;
        }

        // Phone Validation
        const phoneNum = parseInt(formData.phone, 10);
        if (isNaN(phoneNum) || phoneNum < 1000000000 || phoneNum > 9999999999) {
          setError("Please enter a valid 10-digit mobile number!");
          setIsLoading(false);
          return;
        }
      }

      // 2. Admin/Executive Login
      if (activeTab === 'admin') {
        const inputId = formData.adminId.trim();

        const { user, error: loginError } = await login(inputId, formData.password);

        if (user) {
          onLogin(user);
        } else {
          setError(loginError || "Invalid Credentials.");
        }
        setIsLoading(false);
        return;
      }

      // 3. Register Logic
      if (activeTab === 'register') {
        const newUser: UserData = {
          name: formData.name,
          email: formData.email,
          institute: formData.institute,
          class: formData.class,
          stream: formData.stream,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          role: 'student',
          bonus: 5
        };

        const createdUser = await addUser(newUser, formData.password);

        if (createdUser) {
          setRegisteredUser(createdUser);
          setActiveTab('welcome');
        } else {
          setError("Account already exists with this email address.");
        }
        setIsLoading(false);
        return;
      }

      // 4. Login Logic
      if (activeTab === 'login') {
        const { user, error: loginError } = await login(formData.email, formData.password);

        if (user) {
          onLogin(user, user.bonus || 0);
        } else {
          setError(loginError || "Invalid credentials.");
        }
        setIsLoading(false);
        return;
      }

    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const toggleTab = () => {
    setError(null);
    if (activeTab === 'admin') {
      setActiveTab('login');
    } else {
      setActiveTab(prev => prev === 'login' ? 'register' : 'login');
    }
    resetForm();
  };

  const switchToAdmin = () => {
    setActiveTab('admin');
    resetForm();
    setError(null);
  };

  const switchToUser = () => {
    setActiveTab('login');
    resetForm();
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
      institute: '',
      class: '',
      stream: '',
      age: '',
      gender: '',
      adminId: '',
    });
    setShowPassword(false);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'login': return 'Get started instantly!';
      case 'register': return 'Create Account';
      case 'admin': return 'Admin Portal';
      case 'welcome': return null;
    }
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'login': return 'Sign in with your email or phone.';
      case 'register': return 'Join the Youthopia community!';
      case 'admin': return 'Access the festival dashboard.';
      case 'welcome': return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-8 relative font-sans">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md bg-[#162032] border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {activeTab !== 'welcome' && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getHeaderTitle()}
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              {getHeaderSubtitle()}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'login' && (
              // --- LOGIN VIEW ---
              <motion.div
                key="login-fields"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Email or Phone"
                  type="text"
                  name="email"
                  icon={<User size={18} />}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  icon={<Lock size={18} />}
                  rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
            )}

            {activeTab === 'register' && (
              // --- REGISTER VIEW ---
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <Input
                  placeholder="Full Name"
                  name="name"
                  icon={<User size={18} />}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  icon={<Mail size={18} />}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  placeholder="College/School Name"
                  name="institute"
                  icon={<Building size={18} />}
                  value={formData.institute}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  placeholder="Contact Number"
                  type="tel"
                  name="phone"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Class"
                    name="class"
                    icon={<GraduationCap size={18} />}
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    as="select"
                    name="stream"
                    placeholder="Stream"
                    icon={<Layers size={18} />}
                    value={formData.stream}
                    onChange={handleInputChange}
                    options={["Science", "Commerce", "Arts", "Vocational", "Engineering", "Others"]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    as="select"
                    name="gender"
                    placeholder="Gender"
                    icon={<User size={18} />}
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={Object.values(Gender)}
                    required
                  />
                  <Input
                    placeholder="Age"
                    type="number"
                    name="age"
                    icon={<Info size={18} />}
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  icon={<Lock size={18} />}
                  rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  icon={<Lock size={18} />}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              // --- ADMIN VIEW ---
              <motion.div
                key="admin-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Admin ID (or Email)"
                  type="text"
                  name="adminId"
                  icon={<ShieldCheck size={18} />}
                  value={formData.adminId}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  icon={<Lock size={18} />}
                  rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>
            )}

            {activeTab === 'welcome' && (
              // --- WELCOME / SUCCESS VIEW ---
              <motion.div
                key="welcome-screen"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center pt-2"
              >
                <div className="mb-6 relative">
                  <div className="w-24 h-24 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center shadow-lg">
                    <Check size={48} className="text-slate-500" strokeWidth={3} />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-[#162032]"
                  >
                    <Check size={16} className="text-white" strokeWidth={4} />
                  </motion.div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
                <p className="text-slate-400 text-center text-lg px-2 leading-relaxed mb-8">
                  {formData.name || 'User'}, welcome to Youthopia... Your journey to mental wellbeing starts now.
                </p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0f291e] border border-[#166534] text-[#4ade80] font-bold py-3 px-6 rounded-2xl text-center mb-8 w-full shadow-lg shadow-green-900/20"
                >
                  +5 Welcome Bonus Awarded!
                </motion.div>

                <Button type="button" onClick={() => onLogin(registeredUser || { ...formData, role: 'student' }, 5)} fullWidth variant="amber" shape="pill" className="text-lg font-bold py-4">
                  Grab Your Mental Wellness Pass
                </Button>

                <div className="mt-8 text-center">
                  <p className="text-slate-500 text-sm">
                    Already have an account? <button onClick={switchToUser} className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors">Sign In</button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          {error && activeTab !== 'welcome' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {activeTab !== 'welcome' && (
            <div className="pt-2">
              <Button type="submit" fullWidth variant="amber" shape="pill" className="text-lg" isLoading={isLoading} disabled={isLoading}>
                {activeTab === 'register' ? 'Next' : 'Sign In'}
              </Button>
            </div>
          )}
        </form>

        {activeTab !== 'welcome' && (
          <div className="mt-6 text-center">
            {activeTab !== 'admin' && (
              <p className="text-slate-400 text-sm">
                {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleTab} className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors">
                  {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}

            {activeTab === 'admin' && (
              <p className="text-slate-400 text-sm">
                Not an admin?{' '}
                <button onClick={switchToUser} className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors">
                  User Login
                </button>
              </p>
            )}

            {activeTab === 'login' && (
              <div className="pt-2 mt-4 border-t border-slate-700/50">
                <button
                  onClick={switchToAdmin}
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium"
                >
                  Are you an admin? <span className="text-slate-400 font-bold hover:text-white">Login Here</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <button onClick={onBack} className="text-slate-600 hover:text-slate-400 text-xs">
                ← Back to Home
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
