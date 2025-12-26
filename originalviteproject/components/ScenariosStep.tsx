import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { 
  Plane, PenTool, Mic, Search, Code, 
  Brain, Compass, Briefcase, Book, Dumbbell, 
  Focus, GraduationCap 
} from 'lucide-react';
import { ScenarioType } from '../types';

interface ScenariosStepProps {
  onNext: () => void;
}

const scenarios = [
  { id: ScenarioType.FLY, icon: Plane, color: 'bg-blue-500' },
  { id: ScenarioType.DESIGN, icon: PenTool, color: 'bg-yellow-600' },
  { id: ScenarioType.WRITE, icon: PenTool, color: 'bg-green-600' }, // Reusing PenTool for write as generic
  { id: ScenarioType.PODCAST, icon: Mic, color: 'bg-green-700' },
  { id: ScenarioType.RESEARCH, icon: Search, color: 'bg-blue-700' },
  { id: ScenarioType.CODE, icon: Code, color: 'bg-purple-600' },
  { id: ScenarioType.MEDITATE, icon: Brain, color: 'bg-purple-800' },
  { id: ScenarioType.EXPLORE, icon: Compass, color: 'bg-teal-600' },
  { id: ScenarioType.WORK, icon: Briefcase, color: 'bg-blue-800' },
  { id: ScenarioType.READ, icon: Book, color: 'bg-green-800' },
  { id: ScenarioType.EXERCISE, icon: Dumbbell, color: 'bg-cyan-600' },
  { id: ScenarioType.FOCUS, icon: Focus, color: 'bg-amber-700' },
  { id: ScenarioType.LEARN, icon: GraduationCap, color: 'bg-lime-700' },
];

// Random positions for "floating" effect simulation
const positions = [
    { top: '15%', left: '55%' },
    { top: '25%', left: '20%' },
    { top: '25%', left: '75%' },
    { top: '35%', left: '45%' },
    { top: '40%', left: '75%' },
    { top: '48%', left: '15%' },
    { top: '50%', left: '75%' },
    { top: '60%', left: '30%' },
    { top: '62%', left: '60%' },
    { top: '70%', left: '10%' },
    { top: '72%', left: '80%' },
    { top: '75%', left: '45%' },
    { top: '82%', left: '70%' },
];


export const ScenariosStep: React.FC<ScenariosStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<ScenarioType[]>([ScenarioType.FLY, ScenarioType.CODE, ScenarioType.RESEARCH]);

  const toggleScenario = (id: ScenarioType) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      <div className="px-6 pt-12 z-20 text-center">
        <motion.h1 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-2xl font-bold text-white mb-2"
        >
            Choose Your Focus Scenario 🏷️
        </motion.h1>
        <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-gray-400 text-sm"
        >
            Choosing these scenarios will help track different data to boost your focus efficiency.
        </motion.p>
      </div>

      <div className="flex-1 relative mt-8">
        {scenarios.map((scenario, index) => {
            const isSelected = selected.includes(scenario.id);
            const pos = positions[index] || { top: '50%', left: '50%' };
            
            return (
                <motion.button
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, type: 'spring' }}
                    onClick={() => toggleScenario(scenario.id)}
                    className={`absolute flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 transition-all duration-300
                        ${isSelected ? `${scenario.color} border-white text-white` : 'bg-[#1a1a1a] border-transparent text-gray-500 hover:bg-[#222]'}`}
                    style={{ 
                        top: pos.top, 
                        left: pos.left, 
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSelected ? 10 : 1
                    }}
                >
                    <scenario.icon size={16} />
                    <span className="font-medium text-sm whitespace-nowrap">{scenario.id}</span>
                </motion.button>
            );
        })}
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
