import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { FlowEditor } from './FlowEditor';
import { Brain, CheckCircle2 } from 'lucide-react';

interface FlowDemoStepProps {
  onNext: () => void;
}

export const FlowDemoStep: React.FC<FlowDemoStepProps> = ({ onNext }) => {
  const [hasDrifted, setHasDrifted] = useState(false);

  const handleDemoSend = () => {
    setHasDrifted(true);
  };

  return (
    <div className="relative w-full h-full bg-[#09090b] overflow-hidden flex flex-col pt-12">
        <div className="px-6 mb-4 text-center z-20">
            <AnimatePresence mode="wait">
                {!hasDrifted ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400"
                        >
                            <Brain size={24} />
                        </motion.div>
                        <h2 className="text-white text-2xl font-serif italic mb-2">
                            The Weight of Thought
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
                            Psychology shows that unexpressed thoughts create mental tension. 
                            <br/><span className="text-white font-medium">Releasing them is the cure.</span>
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="outro"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                            className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-400"
                        >
                            <CheckCircle2 size={32} />
                        </motion.div>
                        <h2 className="text-white text-2xl font-serif italic mb-2">
                            Felt that?
                        </h2>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-xs mx-auto">
                            That moment of release is what Drift provides every single day. 
                            Clear your mind, improve your sleep.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* The interactive demo */}
        <div className="flex-1 w-full relative">
            {!hasDrifted ? (
                <FlowEditor 
                    isDemo={true} 
                    placeholder="Write one thing stressing you out..." 
                    onSend={handleDemoSend}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-[#121214] border border-white/10 rounded-2xl p-6 mx-6">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                            <span className="text-zinc-500 text-xs uppercase tracking-widest">Scientific Benefit</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-zinc-300">
                                <span className="text-green-400">✓</span> Reduces Cortisol levels
                            </li>
                            <li className="flex gap-3 text-sm text-zinc-300">
                                <span className="text-green-400">✓</span> Improves emotional regulation
                            </li>
                            <li className="flex gap-3 text-sm text-zinc-300">
                                <span className="text-green-400">✓</span> Creates mental space
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            
            {/* Overlay gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-30" />
        </div>

      <Button onClick={onNext} variant={hasDrifted ? "primary" : "glass"} delay={hasDrifted ? 0 : 2}>
         {hasDrifted ? "I need this" : "Experience Release"}
      </Button>
    </div>
  );
};