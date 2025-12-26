import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Waves, HeartHandshake } from 'lucide-react';

interface BottleStepProps {
  onNext: () => void;
}

export const BottleStep: React.FC<BottleStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#09090b] relative overflow-hidden">
      
      {/* Background Ocean Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent" />
        {/* Animated Waves */}
        {[...Array(3)].map((_, i) => (
             <motion.div
                key={i}
                className="absolute left-[-50%] w-[200%] h-[400px] border-t border-white/5 rounded-[50%]"
                style={{ bottom: -100 + (i * 40) }}
                animate={{ 
                    rotate: [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? 5 : -5],
                    y: [0, 20, 0]
                }}
                transition={{ 
                    rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
                }}
             />
        ))}
      </div>

      {/* The Bottle */}
      <motion.div
        initial={{ y: 20, opacity: 0, rotate: -10 }}
        animate={{ y: 0, opacity: 1, rotate: 10 }}
        transition={{ 
            y: { duration: 1 },
            opacity: { duration: 1 },
            rotate: { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }}
        className="relative z-10 w-32 h-64 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full rounded-t-lg flex flex-col items-center justify-center mb-12 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
      >
        <div className="absolute top-[-10px] w-12 h-8 bg-white/10 border border-white/20 rounded-sm" />
        
        {/* Paper Scroll inside */}
        <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-20 h-32 bg-[#f4f4f5] opacity-80 rounded-sm origin-bottom"
        >
             <div className="w-full h-full p-2 flex flex-col gap-2">
                <div className="w-full h-1 bg-black/10 rounded-full" />
                <div className="w-3/4 h-1 bg-black/10 rounded-full" />
                <div className="w-full h-1 bg-black/10 rounded-full" />
                <div className="w-1/2 h-1 bg-black/10 rounded-full" />
             </div>
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <div className="relative z-10 text-center px-8 max-w-sm">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 text-blue-300 mb-4"
        >
            <HeartHandshake size={20} />
            <span className="text-sm font-medium tracking-widest uppercase">Shared Humanity</span>
        </motion.div>

        <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl text-white font-serif italic mb-4"
        >
            You are not alone.
        </motion.h2>
        
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-zinc-400 font-light leading-relaxed"
        >
            Your thoughts drift anonymously to kind strangers. 
            <br/>Receive support without judgment.
        </motion.p>
      </div>

      <Button onClick={onNext} variant="glass">Connect to the Ocean</Button>
    </div>
  );
};