import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface SimpleTextStepProps {
  onNext: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  buttonText: string;
  smallLabel?: string;
  showLogo?: boolean;
}

const containerVariants = {
  visible: { 
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 1, 
      ease: [0.2, 0.65, 0.3, 0.9] 
    } 
  }
};

export const TextStep: React.FC<SimpleTextStepProps> = ({ 
  onNext, 
  title, 
  subtitle, 
  buttonText, 
  smallLabel, 
  showLogo 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-[#09090b] relative z-10">
       {/* Background gradient orb */}
       <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        key="content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full relative z-10"
      >
        {smallLabel && (
          <motion.p variants={itemVariants} className="text-zinc-500 text-xs font-semibold mb-6 uppercase tracking-[0.2em]">
            {smallLabel}
          </motion.p>
        )}
        
        {title && (
          <motion.div variants={itemVariants} className={`mb-6 leading-tight ${showLogo ? 'font-serif italic text-6xl text-white' : 'font-light text-3xl md:text-4xl text-zinc-100'}`}>
            {title}
          </motion.div>
        )}
        
        {subtitle && (
          <motion.div variants={itemVariants} className="text-zinc-400 text-lg leading-relaxed font-light">
            {subtitle}
          </motion.div>
        )}
      </motion.div>
      
      <Button onClick={onNext} delay={0.6} variant="glass">{buttonText}</Button>
    </div>
  );
};