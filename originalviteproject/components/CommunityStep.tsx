import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Heart, User } from 'lucide-react';

interface CommunityStepProps {
  onNext: () => void;
}

export const CommunityStep: React.FC<CommunityStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#09090b] pt-16 px-6 relative overflow-hidden">
      
      <div className="text-center z-10 mb-12 max-w-sm">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif text-white mb-4"
        >
            You are not alone.
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-light"
        >
            Receive anonymous support from strangers who listen without judgment.
        </motion.p>
      </div>

      <div className="relative w-full max-w-sm h-72 flex items-center justify-center">
        {/* Center: YOU */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="relative z-20"
        >
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <User size={32} className="text-black" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-white/50">You</div>
        </motion.div>

        {/* Orbiting Strangers */}
        {[...Array(5)].map((_, index) => {
            const angle = (index / 5) * 2 * Math.PI;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                    className="absolute"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                    {/* Connection Line */}
                    <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 0.2, width: radius }}
                        transition={{ delay: 1 + index * 0.1, duration: 1 }}
                        className="absolute top-1/2 left-1/2 h-[1px] bg-indigo-500 origin-left"
                        style={{ 
                            transform: `rotate(${angle + Math.PI}rad)`, // Rotate line to point to center
                            zIndex: -1 
                        }}
                    />
                    
                    <div className="w-10 h-10 bg-indigo-900/40 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300">
                        <Heart size={14} fill="currentColor" className="opacity-50" />
                    </div>
                </motion.div>
            );
        })}

        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-40 h-40 border border-white/10 rounded-full"
            />
             <motion.div 
                animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.05, 0, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-40 h-40 border border-white/5 rounded-full"
            />
        </div>
      </div>

      <Button onClick={onNext} variant="glass">Enter The Shore</Button>
    </div>
  );
};