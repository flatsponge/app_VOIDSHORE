import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Clock, Feather, ArrowUp } from 'lucide-react';

interface FlowEditorProps {
  onSend?: (content: string) => void;
  isDemo?: boolean;
  placeholder?: string;
  nextSendTime?: number | null;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ 
  onSend, 
  isDemo = false,
  placeholder = "Let your thoughts drift...",
  nextSendTime = null
}) => {
  const [content, setContent] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Timer logic
  useEffect(() => {
    if (!nextSendTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = nextSendTime - now;

      if (diff <= 0) {
        setTimeLeft('');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextSendTime]);

  const handleSend = async () => {
    if (nextSendTime && Date.now() < nextSendTime) return;
    if (!content.trim()) return;

    setIsSending(true);
    
    // Allow animation to play
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onSend) onSend(content);
    setContent('');
    setIsSending(false);
  };

  // Dynamic font size based on length
  const getFontSize = () => {
    const len = content.length;
    if (len < 50) return 'text-3xl md:text-4xl';
    if (len < 100) return 'text-2xl md:text-3xl';
    return 'text-xl md:text-2xl';
  };

  return (
    <div className={`flex flex-col h-full w-full max-w-lg mx-auto relative transition-all duration-500 ${isDemo ? '' : 'pt-24 pb-32'}`}>
      
      {/* Text Input Area - Flex Grow to push content to center but respect top/bottom space */}
      <div className="flex-1 flex flex-col justify-center px-8 relative z-20 min-h-0">
        <AnimatePresence mode="wait">
            {!isSending ? (
                <motion.div 
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        rows={1}
                        className={`w-full bg-transparent border-none outline-none font-serif text-zinc-100 placeholder-zinc-700/50 resize-none overflow-hidden text-center leading-relaxed selection:bg-indigo-500/30 transition-all duration-300 ${getFontSize()}`}
                        autoFocus
                        style={{ minHeight: '60px', maxHeight: '60vh' }}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="sending"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-zinc-400 gap-4"
                >
                    <motion.div 
                        animate={{ y: -100, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="font-serif italic text-2xl text-zinc-500"
                    >
                        Drifting away...
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      
      {/* Controls Area - Stays above keyboard if viewport shrinks */}
      {!isDemo && !isSending && (
         <div className="shrink-0 px-6 pb-4 flex flex-col items-center justify-end gap-6 z-30 min-h-[100px]">
            
            {/* Context/Timer */}
            <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {timeLeft ? (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full"
                        >
                            <Clock size={12} className="text-zinc-500" />
                            <span className="text-zinc-500 font-mono text-xs">{timeLeft}</span>
                        </motion.div>
                    ) : content.length === 0 ? (
                         <motion.div 
                            key="hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-zinc-600 text-xs font-medium tracking-widest uppercase"
                        >
                            <Feather size={12} />
                            <span>Unburden your mind</span>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Main Action Button */}
            <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {content.trim().length > 0 && !timeLeft && (
                        <motion.button 
                            key="send"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSend}
                            className="group relative flex items-center gap-3 bg-white text-black pl-6 pr-5 py-3 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-300"
                        >
                            <span className="font-medium text-lg tracking-wide">Drift</span>
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                                <ArrowUp size={16} />
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
         </div>
      )}
    </div>
  );
};