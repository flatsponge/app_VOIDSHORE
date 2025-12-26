import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Check } from 'lucide-react';
import { MapStyle } from '../types';

interface MapStyleStepProps {
  onNext: () => void;
}

const mapStyles: MapStyle[] = [
  { id: 'monochrome', name: 'Monochrome', image: 'grayscale(100%)' },
  { id: 'terra', name: 'Terra', image: 'sepia(50%) hue-rotate(-30deg)' },
  { id: 'standard', name: 'Standard', image: 'contrast(1.1)' },
  { id: 'satellite', name: 'Satellite', image: 'saturate(1.5) brightness(0.8)' },
];

export const MapStyleStep: React.FC<MapStyleStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState('standard');
  const [labelsEnabled, setLabelsEnabled] = useState(false);

  return (
    <div className="flex flex-col h-full bg-black pt-16 px-6 relative">
       {/* Background Effect */}
       <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-black z-0 pointer-events-none"></div>

      <div className="z-10 text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Map Style 🗺️</h1>
        <p className="text-gray-400 text-sm">Your chosen map will appear by default on the home and flight screens.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 z-10">
        {mapStyles.map((style) => (
            <motion.div
                key={style.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(style.id)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${selected === style.id ? 'border-white' : 'border-transparent'}`}
            >
                {/* Mock Map Image using CSS Pattern/Filter */}
                <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ 
                        backgroundColor: '#222',
                        backgroundImage: `url('https://picsum.photos/300/300?random=${style.id}')`,
                        filter: style.image 
                    }}
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-white text-sm font-medium">{style.name}</span>
                </div>

                {selected === style.id && (
                    <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1">
                        <Check size={12} className="text-white" />
                    </div>
                )}
            </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl z-10">
        <span className="text-white font-medium">Labels</span>
        <button 
            onClick={() => setLabelsEnabled(!labelsEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${labelsEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${labelsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
