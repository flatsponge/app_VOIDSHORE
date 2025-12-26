import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, ArrowUp } from 'lucide-react';
import { Button } from './Button';

interface LevelUpModalProps {
  level: number;
  title: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        className="relative z-10 w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/30 blur-[60px] rounded-full pointer-events-none" />

        <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg relative"
        >
            <Crown size={32} className="text-white" fill="currentColor" />
            <div className="absolute -bottom-2 -right-2 bg-white text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#121214]">
                {level}
            </div>
        </motion.div>

        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">Level Up</h2>
        <h1 className="text-3xl font-serif text-white mb-4">You are now a <br/><span className="text-indigo-400 italic">{title}</span></h1>
        
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            Your words have resonated with others. Your presence helps calm the ocean.
        </p>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-4 bg-white text-black rounded-xl font-medium"
        >
            Continue Journey
        </motion.button>

        {/* Confetti Particles Effect (Simplified) */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ 
                    opacity: [0, 1, 0], 
                    x: (i % 2 === 0 ? 1 : -1) * Math.random() * 100, 
                    y: -Math.random() * 100 
                }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-400 rounded-full blur-[1px]"
            />
        ))}

      </motion.div>
    </div>
  );
};