import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface InputProps extends Omit<HTMLMotionProps<"input">, "children"> {
  label?: string;
  error?: string;
  as?: 'input' | 'select';
  options?: string[];
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  variant?: 'dark' | 'light';
  children?: React.ReactNode; // Explicitly allow children if needed, though mostly handled by 'as'
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  as = 'input', 
  options, 
  icon,
  rightIcon,
  onRightIconClick,
  className = '', 
  placeholder,
  variant = 'dark',
  ...props 
}) => {
  const isDark = variant === 'dark';

  const themeStyles = isDark 
    ? "bg-[#1e293b] border-slate-600 text-white placeholder-slate-500 focus:ring-brand-yellow"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-brand-purple shadow-sm";

  const baseInputStyles = `w-full border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${icon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-3 ${themeStyles}`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-sm font-semibold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}

        {as === 'select' ? (
          <motion.select 
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`${baseInputStyles} appearance-none`}
            defaultValue=""
            {...props as any}
          >
            <option value="" disabled className={isDark ? "text-slate-500" : "text-slate-400"}>{placeholder}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt} className={isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                {opt}
              </option>
            ))}
          </motion.select>
        ) : (
          <motion.input 
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={baseInputStyles} 
            placeholder={placeholder}
            {...props} 
          />
        )}

        {rightIcon && (
          <div 
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 ${onRightIconClick ? 'cursor-pointer hover:text-brand-purple' : 'pointer-events-none'}`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-red-500 text-xs ml-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default Input;