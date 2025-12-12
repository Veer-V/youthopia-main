
import React from 'react';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({ data, color = '#8b5cf6' }) => {
  const max = Math.max(...data, 1);
  const min = 0;

  // Balanced padding to keep graph within bounds while maximizing display area
  const padding = 10;
  const width = 100;
  const height = 100;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Calculate points with proper scaling
  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const normalizedValue = (val - min) / (max - min);
    const y = height - padding - (normalizedValue * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'hidden' }}
      >
        {/* Clip path to ensure nothing goes outside */}
        <defs>
          <clipPath id="chartClip">
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>

          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g clipPath="url(#chartClip)">
          {/* Area under the line */}
          <motion.path
            d={`M ${padding},${height - padding} ${data.map((val, i) => {
              const x = padding + (i / (data.length - 1)) * chartWidth;
              const normalizedValue = (val - min) / (max - min);
              const y = height - padding - (normalizedValue * chartHeight);
              return `L ${x},${y}`;
            }).join(' ')} L ${padding + chartWidth},${height - padding} Z`}
            fill="url(#lineGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Shadow/Glow Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Main Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Dots - Much smaller */}
          {data.map((val, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const normalizedValue = (val - min) / (max - min);
            const y = height - padding - (normalizedValue * chartHeight);

            return (
              <motion.g key={i}>
                {/* Dot glow - very subtle */}
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={color}
                  opacity="0.15"
                />
                {/* Main dot - small */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="white"
                  stroke={color}
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.08, duration: 0.3 }}
                />
              </motion.g>
            );
          })}
        </g>
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
