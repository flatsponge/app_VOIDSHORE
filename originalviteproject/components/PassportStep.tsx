import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Fingerprint, Globe, Shield, RefreshCw, Sparkles } from 'lucide-react';

interface PassportStepProps {
  onNext: () => void;
}

const ALIASES = [
    "Mystic River", "Silent Echo", "Wandering Soul", 
    "Velvet Night", "Cosmic Dust", "Ocean Whisper",
    "Azure Sky", "Lunar Tide", "Solar Flare", "Neon Rain"
];

const GRADIENTS = [
    "from-indigo-500/20 via-transparent to-pink-500/20",
    "from-emerald-500/20 via-transparent to-sky-500/20",
    "from-amber-500/20 via-transparent to-rose-500/20",
    "from-violet-500/20 via-transparent to-fuchsia-500/20",
];

export const PassportStep: React.FC<PassportStepProps> = ({ onNext }) => {
  const [identity, setIdentity] = useState({ 
      alias: "Unknown", 
      gradient: GRADIENTS[0],
      id: "---"
  });
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
     // Initial shuffle on mount
     handleShuffle();
  }, []);

  const handleShuffle = () => {
    setIsShuffling(true);
    // Simulate shuffle effect
    let count = 0;
    const interval = setInterval(() => {
        setIdentity({
            alias: ALIASES[Math.floor(Math.random() * ALIASES.length)],
            gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
            id: Math.random().toString(36).substr(2, 6).toUpperCase()
        });
        count++;
        if (count > 8) {
            clearInterval(interval);
            setIsShuffling(false);
        }
    }, 50);
  };

  return (
    <div className="flex flex-col items-center pt-20 px-6 h-full bg-black relative">
      
      <div className="text-center mb-8 z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Anonymous Identity</h1>
        <p className="text-gray-400 text-sm">You are free to be yourself.</p>
      </div>

      {/* Drifter Pass Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-8 group cursor-pointer"
        onClick={handleShuffle}
      >
        {/* Holographic effect */}
        <motion.div 
            className={`absolute inset-0 bg-gradient-to-tr ${identity.gradient} transition-colors duration-500`} 
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:animate-shine pointer-events-none" />
        
        <div className="p-8 relative z-10 flex flex-col h-full min-h-[280px]">
            <div className="flex justify-between items-start mb-12">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Drifter Pass</span>
                    <AnimatePresence mode="wait">
                        <motion.span 
                            key={identity.alias}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-2xl font-serif text-white italic"
                        >
                            {identity.alias}
                        </motion.span>
                    </AnimatePresence>
                </div>
                <motion.div 
                    whileTap={{ rotate: 360 }}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                >
                    <Fingerprint className="text-zinc-400" size={24} />
                </motion.div>
            </div>

            <div className="space-y-4">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500 text-xs uppercase tracking-wide">Status</span>
                    <span className="text-white text-sm font-mono">Drifter (Lvl 1)</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500 text-xs uppercase tracking-wide">ID</span>
                    <span className="text-white text-sm font-mono font-bold tracking-widest">{identity.id}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500 text-xs uppercase tracking-wide">Joined</span>
                    <span className="text-white text-sm font-mono">{new Date().toLocaleDateString()}</span>
                 </div>
            </div>

            <div className="mt-auto pt-8 flex justify-between items-end">
                <Shield size={16} className="text-zinc-600" />
                <div className="text-[10px] text-zinc-600 font-mono tracking-widest flex items-center gap-1">
                    <Sparkles size={10} /> ENCRYPTED
                </div>
            </div>
        </div>
      </motion.div>

      {/* Interactive Controls */}
      <div className="w-full max-w-sm flex items-center justify-between mb-8 px-2">
          <p className="text-xs text-zinc-500">Tap card to shuffle identity</p>
          <button 
            onClick={handleShuffle}
            className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <RefreshCw size={12} className={isShuffling ? "animate-spin" : ""} />
            Generate New
          </button>
      </div>

      <Button onClick={onNext}>Confirm Identity</Button>
    </div>
  );
};