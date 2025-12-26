import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Facebook, Instagram, Twitter, MessageCircle, ShoppingBag, Youtube } from 'lucide-react';

interface AirplaneModeStepProps {
  onNext: () => void;
}

export const AirplaneModeStep: React.FC<AirplaneModeStepProps> = ({ onNext }) => {
  const icons = [
    { icon: <Youtube size={24} />, color: 'bg-red-600' },
    { icon: <MessageCircle size={24} />, color: 'bg-blue-400' }, // Telegram
    { icon: <ShoppingBag size={24} />, color: 'bg-green-600' }, // Shopify
    { icon: <Instagram size={24} />, color: 'bg-pink-600' },
    { icon: <MessageCircle size={24} />, color: 'bg-green-500' }, // WhatsApp
    { icon: <Facebook size={24} />, color: 'bg-blue-600' },
  ];

  return (
    <div className="flex flex-col items-center h-full bg-black pt-16 px-6 relative overflow-hidden">
      <div className="text-center z-10 mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Airplane Mode ✈️</h1>
        <p className="text-gray-400">Airplane Mode reduces distractions by managing screen time.</p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Center Lock Icon */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
            <div className="text-black text-4xl">⏳</div>
        </motion.div>

        {/* Orbiting Apps */}
        {icons.map((item, index) => {
            const angle = (index / icons.length) * 2 * Math.PI;
            const radius = 120; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white ${item.color}`}
                >
                    {item.icon}
                </motion.div>
            );
        })}

        {/* Connecting Lines (Decorative) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 animate-spin-slow" style={{ animationDuration: '20s' }}>
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
