import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Bell } from 'lucide-react';

interface TimePickerStepProps {
  onNext: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export const TimePickerStep: React.FC<TimePickerStepProps> = ({ onNext }) => {
  const [selectedHour, setSelectedHour] = useState('14');
  const [selectedMinute, setSelectedMinute] = useState('00');
  
  // Refs for auto-scroll initialization
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center initial values
    if (hourRef.current) {
        hourRef.current.scrollTop = HOURS.indexOf('14') * 64;
    }
    if (minRef.current) {
        minRef.current.scrollTop = MINUTES.indexOf('00') * 64;
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-black px-6 pt-12 relative">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          Select Your Desired<br/>Focus Time 🔔
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed px-4">
          We'll send you a notification to remind you when it's time to start focusing!
        </p>
      </div>

      {/* Main Card Container */}
      <div className="border border-white/10 rounded-[40px] p-2 bg-black relative shadow-2xl mx-1">
         
         {/* Top Section: Picker */}
         <div className="relative h-48 flex justify-center items-center overflow-hidden rounded-[32px] bg-[#000000] mb-2">
            
            {/* Dark Highlight Bar */}
            <div className="absolute w-full h-16 bg-[#18181b] z-0 top-1/2 transform -translate-y-1/2 rounded-xl pointer-events-none" />

            <div className="flex gap-2 z-10 h-full items-center">
                {/* Hours */}
                <ScrollColumn 
                    items={HOURS} 
                    value={selectedHour} 
                    onChange={setSelectedHour} 
                    ref={hourRef}
                />

                <div className="text-white text-4xl font-semibold pb-2">:</div>

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
            <div className="bg-[#1C1C1E] rounded-2xl p-4 flex items-center gap-3 border border-white/5 relative overflow-hidden shadow-lg">
                {/* App Icon Mockup */}
                <div className="w-10 h-10 bg-[#3A3A3C] rounded-lg flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 opacity-50"></div>
                   <div className="w-4 h-6 bg-white/40 transform -skew-x-12"></div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-semibold text-white text-[15px] truncate flex items-center gap-1">
                            🤩 Time to focus!
                        </span>
                        <span className="text-[12px] text-gray-500 shrink-0">now</span>
                    </div>
                    <p className="text-white/80 text-[13px] leading-tight truncate">
                        Let’s get started on your journey.
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
                className="text-white font-semibold text-lg py-2 opacity-90 hover:opacity-100 transition-opacity"
            >
                Skip
            </button>
        }
      >
        Continue
      </Button>
    </div>
  );
};

// --- Scroll Column Component ---
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
                                ? 'text-white text-5xl font-semibold opacity-100 scale-100' 
                                : 'text-[#3f3f46] text-4xl font-bold opacity-60 scale-90 blur-[0.5px]'
                        }`}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
});