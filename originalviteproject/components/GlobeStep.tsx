import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Navigation, Search } from 'lucide-react';

export const GlobeStep: React.FC = () => {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Globe Placeholder (CSS Sphere) */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-[800px] h-[800px] rounded-full absolute bg-gradient-to-tr from-blue-900 via-black to-blue-900 opacity-50 blur-3xl"
      />
      
      {/* Realistic Globe Image Overlay (Rotating) */}
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
         className="w-[600px] h-[600px] rounded-full absolute bg-cover opacity-80 shadow-[inset_0_0_50px_rgba(0,0,0,1)]"
         style={{ 
             backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1200px-World_map_-_low_resolution.svg.png')",
             backgroundSize: '200%',
             filter: 'grayscale(100%) sepia(20%) hue-rotate(180deg) brightness(0.6)'
         }}
      />

      <div className="z-10 text-center mt-[-100px]">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-2 tracking-tight"
        >
            Welcome to<br/>FocusFlight
        </motion.h1>
      </div>

      {/* Main CTA */}
      <div className="fixed bottom-12 z-20 w-full px-6">
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSheet(true)}
            className="w-full bg-white text-black font-semibold text-lg py-4 rounded-full shadow-lg"
        >
            Start Journey
        </motion.button>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSheet(false)}
                    className="absolute inset-0 bg-black z-30"
                />
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl p-6 z-40 h-[400px]"
                >
                    <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6 opacity-50" />
                    
                    <h3 className="text-white text-lg font-semibold mb-4 text-center">Select Your Starting Airport</h3>
                    
                    <div className="bg-[#333] rounded-xl flex items-center px-4 py-3 mb-4">
                        <Search className="text-gray-400 mr-3" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search Airport / City" 
                            className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                            autoFocus
                        />
                    </div>

                    <button className="w-full bg-white/10 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                        <Navigation size={18} />
                        Use Current Location
                    </button>
                    
                    <div className="mt-4 text-center">
                         <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">☁️ Data Updated</span>
                    </div>

                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};
