import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Bell, Waves } from 'lucide-react';

interface TideTimeStepProps {
  onNext: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export const TideTimeStep: React.FC<TideTimeStepProps> = ({ onNext }) => {
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hourRef.current) {
        hourRef.current.scrollTop = HOURS.indexOf('09') * 64;
    }
    if (minRef.current) {
        minRef.current.scrollTop = MINUTES.indexOf('00') * 64;
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-black px-6 pt-12 relative">
      <div className="text-center mb-10 z-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          The Daily Tide 🌊
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed px-4">
          Choose a time for the tide to bring new bottles to your shore.
        </p>
      </div>
      
      {/* Ocean BG */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Main Card Container */}
      <div className="border border-white/10 rounded-[40px] p-2 bg-black relative shadow-2xl mx-1 z-10">
         
         {/* Top Section: Picker */}
         <div className="relative h-48 flex justify-center items-center overflow-hidden rounded-[32px] bg-[#050505] mb-2">
            
            {/* Dark Highlight Bar */}
            <div className="absolute w-full h-16 bg-[#121214] border-y border-white/5 z-0 top-1/2 transform -translate-y-1/2 rounded-xl pointer-events-none" />

            <div className="flex gap-2 z-10 h-full items-center">
                {/* Hours */}
                <ScrollColumn 
                    items={HOURS} 
                    value={selectedHour} 
                    onChange={setSelectedHour} 
                    ref={hourRef}
                />

                <div className="text-white text-4xl font-semibold pb-2 opacity-50">:</div>

                {/* Minutes */}
                <ScrollColumn 
                    items={MINUTES} 
                    value={selectedMinute} 
                    onChange={setSelectedMinute} 
                    ref={minRef}
                />
            </div>
         </div>

         {/* Bottom Section: Notification Preview */}
         <div className="px-4 pb-6">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/5 relative overflow-hidden shadow-lg">
                {/* App Icon Mockup */}
                <div className="w-10 h-10 bg-[#09090b] rounded-lg flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden border border-white/10">
                   <Waves size={18} className="text-white" />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-semibold text-white text-[15px] truncate flex items-center gap-1">
                            Drift
                        </span>
                        <span className="text-[12px] text-gray-500 shrink-0">now</span>
                    </div>
                    <p className="text-white/80 text-[13px] leading-tight truncate">
                        High tide. A bottle has washed ashore.
                    </p>
                </div>
            </div>
         </div>
      </div>

      <Button 
        onClick={onNext}
        secondaryAction={
            <button 
                onClick={onNext} 
                className="text-zinc-500 text-sm py-2 hover:text-white transition-colors"
            >
                I prefer not to say
            </button>
        }
      >
        Set Tide Time
      </Button>
    </div>
  );
};

// --- Scroll Column Component (Reused) ---
interface ScrollColumnProps {
    items: string[];
    value: string;
    onChange: (val: string) => void;
}

const ScrollColumn = React.forwardRef<HTMLDivElement, ScrollColumnProps>(({ items, value, onChange }, ref) => {
    const ITEM_HEIGHT = 64; 

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        if (items[index] && items[index] !== value) {
            onChange(items[index]);
        }
    };

    return (
        <div 
            ref={ref}
            className="h-full w-24 overflow-y-scroll snap-y snap-mandatory no-scrollbar py-[64px]"
            onScroll={handleScroll}
        >
            {items.map((item) => {
                const isSelected = item === value;
                return (
                    <div 
                        key={item} 
                        className={`h-[64px] flex items-center justify-center snap-center transition-all duration-300 ${
                            isSelected 
                                ? 'text-white text-5xl font-serif italic opacity-100 scale-100' 
                                : 'text-[#3f3f46] text-4xl font-serif italic opacity-30 scale-90 blur-[1px]'
                        }`}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
});