import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Waves } from 'lucide-react';

interface IntroStepProps {
  onNext: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-[#09090b] relative z-10 overflow-hidden">
       {/* Background gradient orb - pulsating */}
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" 
       />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 mb-12"
      >
        <div className="relative">
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/5 rounded-full blur-xl"
            />
            <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-sm relative z-10">
                <Waves size={40} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
            </div>
        </div>
      </motion.div>

      <div className="max-w-md w-full relative z-10 space-y-8">
        <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif italic text-6xl md:text-7xl text-white leading-none tracking-tight"
        >
            Quiet <br/>
            <span className="text-zinc-500 text-5xl md:text-6xl">the Noise.</span>
        </motion.h1>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" 
        />
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
        >
            <p className="text-zinc-300 text-lg leading-relaxed font-light">
                Your mind is constantly running. <br/>
                It's time to let it rest.
            </p>
        </motion.div>
      </div>
      
      <Button onClick={onNext} delay={1.2} variant="glass">Begin Journey</Button>
    </div>
  );
};