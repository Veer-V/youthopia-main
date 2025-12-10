
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'dark' | 'amber';
  fullWidth?: boolean;
  shape?: 'rounded' | 'pill';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  shape = 'pill',
  isLoading = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative py-3 px-8 font-bold flex items-center justify-center gap-2 overflow-hidden z-0 transition-all";
  
  const shapes = {
    rounded: "rounded-xl",
    pill: "rounded-full"
  };

  const variants = {
    primary: "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg shadow-brand-purple/30 border-none",
    secondary: "bg-brand-yellow text-brand-dark hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 border-none",
    outline: "border-2 border-brand-purple text-brand-purple hover:text-white bg-transparent",
    white: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50",
    dark: "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800",
    amber: "bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 shadow-lg shadow-amber-500/20 border-none"
  };

  return (
    <motion.button
      whileHover={isLoading || disabled ? {} : { scale: 1.02 }}
      whileTap={isLoading || disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
      className={`${baseStyles} ${shapes[shape]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Background layer for outline hover effect */}
      {variant === 'outline' && !isLoading && !disabled && (
        <motion.div 
          className="absolute inset-0 bg-brand-purple -z-10"
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
