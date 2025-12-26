import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  delay?: number;
  secondaryAction?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    fullWidth = true, 
    className = '', 
    delay = 0, 
    secondaryAction, 
    variant = 'primary',
    ...props 
}) => {
  
  const getBg = () => {
    switch(variant) {
        case 'glass': return 'bg-white/10 backdrop-blur-md border border-white/10 text-white';
        case 'secondary': return 'bg-zinc-800 text-white';
        default: return 'bg-white text-black';
    }
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 px-6 z-50 pointer-events-none flex flex-col items-center gap-4">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={{ 
            opacity: { duration: 0.6, delay: delay, ease: [0.2, 0.8, 0.2, 1] },
            scale: { duration: 0.2 },
            default: { duration: 0.6, delay: delay }
        }}
        className={`${getBg()} font-medium text-lg py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto transition-colors ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
      {secondaryAction && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="pointer-events-auto"
        >
            {secondaryAction}
        </motion.div>
      )}
    </div>
  );
};