
import React from 'react';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({ data, color = '#8b5cf6' }) => {
  const max = Math.max(...data, 1);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full flex items-end">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Gradient fill */}
        <motion.path
          d={`M 0,100 ${data.map((val, i) => `L ${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ')} L 100,100 Z`}
          fill={color}
          fillOpacity="0.1"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        />
        {/* Dots */}
        {data.map((val, i) => (
            <motion.circle
                key={i}
                cx={(i / (data.length - 1)) * 100}
                cy={100 - (val / max) * 100}
                r="1.5"
                fill="white"
                stroke={color}
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
            />
        ))}
      </svg>
    </div>
  );
};

interface BarChartProps {
  data: number[];
  labels?: string[];
  color?: string;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({ data, labels, color = 'bg-yellow-400' }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="w-full h-full flex items-end justify-between gap-2">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
           <motion.div
             initial={{ height: 0 }}
             animate={{ height: `${(val / max) * 100}%` }}
             transition={{ delay: i * 0.1, duration: 0.5 }}
             className={`w-full rounded-t-md ${color} opacity-80 hover:opacity-100 transition-opacity min-h-[4px]`}
           />
           {labels && (
               <div className="text-[10px] text-center text-slate-400 mt-2 truncate w-full">
                   {labels[i]}
               </div>
           )}
        </div>
      ))}
    </div>
  );
};

interface AreaChartProps {
  data: number[];
  color?: string; // Hex color for stroke
  fillColor?: string; // Hex color for fill
  id?: string;
}

export const SimpleAreaChart: React.FC<AreaChartProps> = ({ data, color = '#eab308', fillColor = '#eab308', id = 'area' }) => {
  const max = Math.max(...data, 1) * 1.2; // Add some headroom
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M 0,100 ${data.map((val, i) => `L ${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ')} L 100,100 Z`;

  return (
    <div className="w-full h-full flex items-end">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <motion.path
          d={areaPath}
          fill={`url(#gradient-${id})`}
          stroke="none"
          initial={{ opacity: 0, d: `M 0,100 L 100,100 L 100,100 Z` }}
          animate={{ opacity: 1, d: areaPath }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Highlight max point */}
        {data.map((val, i) => {
           if (val === Math.max(...data)) {
               return (
                 <circle 
                   key={i}
                   cx={(i / (data.length - 1)) * 100}
                   cy={100 - (val / max) * 100}
                   r="3"
                   fill={color}
                   stroke="#111"
                   strokeWidth="1"
                 />
               )
           }
           return null;
        })}
      </svg>
    </div>
  );
};
