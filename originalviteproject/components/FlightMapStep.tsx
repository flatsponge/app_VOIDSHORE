import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Plane } from 'lucide-react';

interface FlightMapStepProps {
  onNext: () => void;
}

export const FlightMapStep: React.FC<FlightMapStepProps> = ({ onNext }) => {
  return (
    <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden flex flex-col">
        {/* Simplified Map Background */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 800 1200" className="w-full h-full text-[#333] fill-current">
           {/* Abstract Europe shape */}
           <path d="M 200 800 Q 150 600 300 400 T 500 200 T 700 300 V 1200 H 0 V 800 Z" />
           <path d="M 500 100 Q 550 150 600 100 T 700 50 Z" />
        </svg>
      </div>

      {/* Flight Path Animation */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 375 812">
            {/* Define Gradients */}
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                </linearGradient>
            </defs>
            {/* LHR Point */}
            <circle cx="120" cy="200" r="4" fill="white" />
            
             {/* CDG Point */}
             <circle cx="280" cy="450" r="4" fill="white" />

             {/* Path */}
            <motion.path
                d="M 120 200 Q 200 300 280 450"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="0 1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
        </svg>

        {/* Airport Tags */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-[180px] left-[70px] bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1"
        >
            <Plane size={10} className="transform -rotate-45" /> LHR
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute top-[430px] left-[290px] bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1"
        >
             <Plane size={10} className="transform rotate-45" /> CDG
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="mt-auto p-8 relative z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-32">
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="text-xl md:text-2xl text-white font-medium leading-relaxed"
        >
            FocusFlight turns every focus session into an exciting flight, guiding you into <span className="font-bold text-white">deep focus mode</span>.
        </motion.p>
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
