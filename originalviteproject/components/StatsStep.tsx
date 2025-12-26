import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Folder, RotateCw, Hourglass, Trophy, Plane } from 'lucide-react';

interface StatsStepProps {
  onNext: () => void;
}

const stats = [
  {
    align: 'left',
    icon: Folder,
    color: 'text-orange-400',
    borderColor: 'border-orange-500',
    text: (
      <span>Complete <span className="text-orange-400 font-bold">20%</span> more tasks during focus sessions.</span>
    )
  },
  {
    align: 'right',
    icon: RotateCw,
    color: 'text-green-500',
    borderColor: 'border-green-500',
    text: (
      <span>Stay distraction-free for <span className="text-green-500 font-bold">90%</span> of your flight time.</span>
    )
  },
  {
    align: 'left',
    icon: Hourglass,
    color: 'text-red-500',
    borderColor: 'border-red-500',
    text: (
      <span>Increase your deep focus duration by <span className="text-red-500 font-bold">40%</span>.</span>
    )
  },
  {
    align: 'right',
    icon: Trophy,
    color: 'text-blue-500',
    borderColor: 'border-blue-500',
    text: (
      <span>Build habits that save you <span className="text-blue-500 font-bold">10+</span> hours this month.</span>
    )
  }
];

export const StatsStep: React.FC<StatsStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col px-6 pt-12 pb-32 h-full bg-black relative overflow-y-auto no-scrollbar">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-10 text-center shrink-0"
      >
        With FocusFlight<br />You Can:
      </motion.h1>

      <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
        {stats.map((stat, index) => {
           const isLeft = stat.align === 'left';
           const Icon = stat.icon;
           
           return (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.15), type: "spring", stiffness: 100, damping: 20 }}
                className={`flex items-center gap-4 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
            >
                {/* Icon Box */}
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-[#0a0a0a] border-2 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${stat.borderColor} ${stat.color}`}>
                    <Icon size={32} strokeWidth={2.5} />
                </div>
                
                {/* Text Bubble */}
                <div className="flex-1 p-4 rounded-xl bg-[#1a1a1a] border border-white/5 shadow-xl relative group">
                     {/* Decorative subtle glow */}
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl bg-current ${stat.color}`} />
                    <p className="text-gray-200 text-sm font-medium leading-snug relative z-10">
                        {stat.text}
                    </p>
                </div>
            </motion.div>
           );
        })}
      </div>

      {/* Floating Badge just above the button area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-28 left-0 right-0 flex justify-center z-40 pointer-events-none"
      >
        <div className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <Plane className="text-blue-400 transform -rotate-45" size={16} />
            <span className="text-white text-sm font-semibold">Ready to take off?</span>
        </div>
      </motion.div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};