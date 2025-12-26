import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Plane, Clock, BookOpen } from 'lucide-react';

interface BoardingPassStepProps {
  onNext: () => void;
}

export const BoardingPassStep: React.FC<BoardingPassStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center pt-16 px-6 h-full bg-black relative">
      
      {/* Boarding Pass Card */}
      <motion.div
        initial={{ y: -50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-sm bg-gray-200 rounded-3xl overflow-hidden shadow-2xl text-black mb-8 relative"
      >
        {/* Top Part (Ticket) */}
        <div className="p-6 bg-white border-b-2 border-dashed border-gray-300 relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-xs text-gray-500 font-semibold mb-1">December 23, 2025</div>
                    <div className="text-4xl font-black">LHR</div>
                    <div className="text-sm text-gray-500">London</div>
                </div>
                <div className="flex flex-col items-center justify-center pt-2 w-16">
                    <Plane className="text-black transform rotate-90 mb-1" size={24} />
                    <div className="text-[10px] text-gray-400">42m</div>
                </div>
                <div className="text-right">
                     <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block mb-1">LANDED</div>
                    <div className="text-4xl font-black">CDG</div>
                    <div className="text-sm text-gray-500">Paris</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                 <div>
                    <div className="text-gray-400 text-xs">Seat</div>
                    <div className="font-bold text-lg">21A</div>
                 </div>
                 <div className="text-right">
                    <div className="text-gray-400 text-xs">Distance</div>
                    <div className="font-bold text-lg">348 km</div>
                 </div>
                 <div>
                    <div className="text-gray-400 text-xs">Boarding</div>
                    <div className="font-bold text-lg">Now</div>
                 </div>
                 <div className="text-right">
                    <div className="text-gray-400 text-xs">Date</div>
                    <div className="font-bold text-lg">2025/12/23</div>
                 </div>
            </div>
            
             {/* Barcode Mockup */}
            <div className="h-12 bg-black w-full mt-2" style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, black 2px, black 4px)'
            }}></div>
        </div>
        
        {/* Circle cutouts for ticket effect */}
        <div className="absolute top-[68%] -left-3 w-6 h-6 bg-black rounded-full"></div>
        <div className="absolute top-[68%] -right-3 w-6 h-6 bg-black rounded-full"></div>

      </motion.div>

      {/* Feature List */}
      <div className="w-full max-w-sm space-y-8 mt-4">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
        >
            <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center shrink-0 text-white">
                <BookOpen size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-1">Focus Boarding Pass</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Every flight is a journey of deep focus, from takeoff to touchdown.</p>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-4"
        >
            <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center shrink-0 text-white">
                <Clock size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-1">Focus History</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Every flight marks a milestone in your focus journey.</p>
            </div>
        </motion.div>
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
