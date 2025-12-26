import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { 
  CloudRain, Heart, Sparkles, Brain, 
  Coffee, Moon, Sun, BookOpen 
} from 'lucide-react';

interface TopicsStepProps {
  onNext: () => void;
}

const topics = [
  { id: 'anxiety', label: 'Anxiety', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'love', label: 'Love', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { id: 'dreams', label: 'Dreams', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'vent', label: 'Vent', icon: Brain, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { id: 'hope', label: 'Hope', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 'calm', label: 'Calm', icon: Coffee, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { id: 'life', label: 'Life', icon: BookOpen, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
];

// Optimized positions to prevent overlap
const positions = [
    { top: '25%', left: '25%' },
    { top: '25%', left: '75%' },
    { top: '45%', left: '20%' },
    { top: '45%', left: '80%' },
    { top: '50%', left: '50%' }, // Center item
    { top: '65%', left: '30%' },
    { top: '65%', left: '70%' },
    { top: '80%', left: '50%' },
];

export const TopicsStep: React.FC<TopicsStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const MIN_SELECTION = 3;
  const isComplete = selected.length >= MIN_SELECTION;

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      <div className="px-6 pt-20 z-20 text-center pointer-events-none">
        <motion.h1 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-2xl font-bold text-white mb-2"
        >
            What's on your mind?
        </motion.h1>
        <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-gray-400 text-sm"
        >
            Select topics to guide the bottles you find.
        </motion.p>
        
        {/* Selection Counter */}
        <motion.div 
            className="mt-6 inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
            animate={{ 
                borderColor: isComplete ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isComplete ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }}
        >
            <span className={`text-xs font-bold ${isComplete ? 'text-green-400' : 'text-zinc-500'}`}>
                {selected.length} / {MIN_SELECTION} Selected
            </span>
        </motion.div>
      </div>

      <div className="flex-1 relative mt-4">
        {topics.map((topic, index) => {
            const isSelected = selected.includes(topic.id);
            const pos = positions[index] || { top: '50%', left: '50%' };
            
            return (
                <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: 1, 
                        scale: isSelected ? 1.1 : 1,
                        y: isSelected ? -5 : 0 
                    }}
                    transition={{ 
                        delay: index * 0.05, 
                        type: 'spring',
                        y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: Math.random() } // Floating animation
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTopic(topic.id)}
                    className={`absolute flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-md transition-all duration-300
                        ${isSelected 
                            ? `${topic.bg} ${topic.border} border-2 ${topic.color} shadow-[0_0_20px_rgba(255,255,255,0.1)] z-10` 
                            : 'bg-[#1a1a1a]/80 border border-white/5 text-gray-500 hover:bg-[#222] hover:border-white/10 z-0'}`}
                    style={{ 
                        top: pos.top, 
                        left: pos.left, 
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <topic.icon size={16} className={isSelected ? 'animate-bounce' : ''} />
                    <span className="font-medium text-sm whitespace-nowrap">{topic.label}</span>
                </motion.button>
            );
        })}
        
        {/* Background Particles */}
        {[...Array(15)].map((_, i) => (
             <div 
                key={i}
                className="absolute bg-white/5 rounded-full blur-[1px] pointer-events-none"
                style={{
                    width: Math.random() * 4 + 1 + 'px',
                    height: Math.random() * 4 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animation: `pulse ${Math.random() * 3 + 2}s infinite`
                }}
             />
        ))}
      </div>

      <Button 
        onClick={onNext} 
        disabled={!isComplete} 
        className={!isComplete ? "opacity-50 grayscale" : ""}
      >
        Continue
      </Button>
    </div>
  );
};