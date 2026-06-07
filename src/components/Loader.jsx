import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false }) {
  const containerClass = fullScreen
    ? "fixed inset-0 bg-white/85 backdrop-blur-md z-[9999999] flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center p-12 w-full h-full min-h-[300px]";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center select-none">

        {/* SVG Text Animation for สโมสาธา */}
        <svg viewBox="0 0 200 120" className="w-[180px] md:w-[220px] h-[80px] md:h-[100px]">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-black"
            style={{
              fontFamily: "'Kanit', sans-serif",
              fontSize: '80px',
              fill: 'transparent',
              stroke: '#FF0000',
              strokeWidth: 3,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeDasharray: 1500,
              animation: 'text-draw-and-jello 3.5s infinite ease-in-out'
            }}
          >
            PHAS
          </text>
        </svg>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-yru-pink font-bold text-sm tracking-widest mt-2 uppercase"
        >
          กำลังโหลดข้อมูล...
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes text-draw-and-jello {
            0% { stroke-dashoffset: 1500; fill: transparent; transform: scale(1); transform-origin: center; }
            35% { stroke-dashoffset: 0; fill: transparent; transform: scale(1); transform-origin: center; }
            45% { fill: #FF0000; transform: scale(1.05, 0.95); transform-origin: center; }
            50% { fill: #FF0000; transform: scale(0.95, 1.05); transform-origin: center; }
            55% { fill: #FF0000; transform: scale(1); transform-origin: center; }
            70% { fill: #FF0000; stroke-dashoffset: 0; }
            100% { fill: transparent; stroke-dashoffset: 1500; }
        }
      `}} />
    </div>
  );
}
