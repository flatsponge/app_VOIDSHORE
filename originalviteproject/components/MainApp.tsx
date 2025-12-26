
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowEditor } from './FlowEditor';
import { Waves, PenLine, Compass, Clock, Lock, ArrowLeft, Send, MapPin, ArrowRight, X, Quote, Calendar, MessageCircle, MessageSquare, ThumbsUp, ThumbsDown, Flower2, TrendingUp, Sparkles, Crown, Heart, HeartCrack, ChevronRight } from 'lucide-react';
import { Bottle, SentBottle, Reply, UserLevel } from '../types';
import { LevelUpModal } from './LevelUpModal';
import { ProfileModal } from './ProfileModal';

// Levels Configuration
const LEVELS = [
    { title: "Drifter", threshold: 0 },
    { title: "Listener", threshold: 100 },
    { title: "Guide", threshold: 300 },
    { title: "Anchor", threshold: 600 },
    { title: "Lighthouse", threshold: 1000 },
    { title: "Ocean Keeper", threshold: 2000 },
];

const getCurrentLevel = (xp: number) => {
    let current = LEVELS[0];
    let levelIndex = 1;
    let nextXp = LEVELS[1].threshold;

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].threshold) {
            current = LEVELS[i];
            levelIndex = i + 1;
            nextXp = LEVELS[i + 1]?.threshold || xp * 1.5;
        }
    }
    return { level: levelIndex, title: current.title, nextXp };
};

// Mock data generator for received bottles
const getRandomBottle = (): Bottle => {
    const content = [
        "I realized today that I've been holding my breath for years. Just letting it out felt like a victory.",
        "The city is so loud, but looking at the moon makes me feel like we're all in the same quiet room.",
        "I forgave someone today. Not for them, but for me. The weight is finally gone.",
        "Do you ever feel like you're waiting for a train that's already left? I think I need to start walking.",
        "To whoever reads this: You are doing enough. You are enough.",
        "Sometimes I sit by the window and watch the rain. It feels like the sky is doing the crying for me.",
        "I planted a garden today. It's hope, I think. Putting something in the ground and believing it will grow."
    ];
    
    const locations = [
        "North Atlantic",
        "South Pacific",
        "Mediterranean Sea",
        "Tasman Sea",
        "Indian Ocean",
        "Caribbean Sea",
        "Baltic Sea",
        "Gulf of Mexico",
        "Coral Sea"
    ];

    const ranks = ["Drifter", "Listener", "Guide", "Drifter", "Anchor"];

    const randomDaysAgo = Math.floor(Math.random() * 30); // 0 to 30 days ago
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - randomDaysAgo);
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        content: content[Math.floor(Math.random() * content.length)],
        author: "Stranger",
        authorRank: ranks[Math.floor(Math.random() * ranks.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: timestamp,
        isRead: false
    };
};

const MOCK_REPLIES = [
    "I needed to hear this today. Thank you.",
    "Sending you strength from across the ocean.",
    "You are not alone in feeling this.",
    "This is beautiful. Keep going.",
    "I feel the exact same way.",
    "Your words resonated with me deeply."
];

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'write' | 'shore'>('write');
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'info' | 'xp'>('info');

  // XP & Level State
  const [xp, setXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const userLevel = getCurrentLevel(xp);
  
  // State for cooldowns
  const [nextSendTime, setNextSendTime] = useState<number | null>(null);
  const [nextReceiveTime, setNextReceiveTime] = useState<number | null>(null);
  
  // State for the current daily bottle interaction
  const [dailyBottle, setDailyBottle] = useState<Bottle | null>(null);
  const [isReadingBottle, setIsReadingBottle] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [hasRatedDaily, setHasRatedDaily] = useState(false);

  // History State
  const [sentBottles, setSentBottles] = useState<SentBottle[]>([]);
  const [selectedHistoryBottle, setSelectedHistoryBottle] = useState<SentBottle | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedSend = localStorage.getItem('drift_next_send');
    const storedReceive = localStorage.getItem('drift_next_receive');
    const storedBottle = localStorage.getItem('drift_daily_bottle');
    const storedHistory = localStorage.getItem('drift_sent_history');
    const storedXp = localStorage.getItem('drift_xp');

    if (storedSend) {
        const time = parseInt(storedSend);
        if (time > Date.now()) setNextSendTime(time);
    }

    if (storedReceive) {
        const time = parseInt(storedReceive);
        if (time > Date.now()) setNextReceiveTime(time);
    }

    if (storedBottle) {
        setDailyBottle(JSON.parse(storedBottle));
    }

    if (storedXp) {
        setXp(parseInt(storedXp));
    }

    if (storedHistory) {
        // Need to revive dates
        const history = JSON.parse(storedHistory).map((b: any) => ({
            ...b,
            timestamp: new Date(b.timestamp),
            replies: b.replies.map((r: any) => ({...r, timestamp: new Date(r.timestamp)}))
        }));
        setSentBottles(history);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('drift_sent_history', JSON.stringify(sentBottles));
  }, [sentBottles]);

  useEffect(() => {
    const prevLevel = getCurrentLevel(parseInt(localStorage.getItem('drift_xp') || '0')).level;
    localStorage.setItem('drift_xp', xp.toString());
    
    // Check for level up
    if (userLevel.level > prevLevel && xp > 0) {
        setShowLevelUp(true);
    }
  }, [xp]);

  // Timer updater for the UI (forces re-render every second if locked)
  const [_, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg: string, type: 'info' | 'xp' = 'info') => {
    setNotification(msg);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 4000);
  }

  // --- XP Logic ---
  const gainXp = (amount: number, reason: string) => {
      setXp(prev => prev + amount);
      showNotification(`${reason} +${amount} XP`, 'xp');
  };

  const loseXp = (amount: number, reason: string) => {
      setXp(prev => Math.max(0, prev - amount));
      showNotification(`${reason} -${amount} XP`, 'info');
  };

  const handleRateStranger = (type: 'up' | 'down' | 'flower') => {
      if (hasRatedDaily) return;
      setHasRatedDaily(true);
      
      // Giving feedback grants a small amount of XP (Participation)
      gainXp(10, "Feedback given");
      
      // In a real app, this would send data to backend to rank the other user
  };

  const handleSend = (content: string) => {
    // 1. Create the bottle
    const newBottle: SentBottle = {
        id: Math.random().toString(36).substr(2, 9),
        content: content,
        timestamp: new Date(),
        replies: [],
        location: "Drifting...",
        hasUnreadReplies: false
    };

    // 2. Update state
    setSentBottles(prev => [newBottle, ...prev]);

    // 3. Set Cooldown
    const nextTime = Date.now() + COOLDOWN_MS;
    setNextSendTime(nextTime);
    localStorage.setItem('drift_next_send', nextTime.toString());
    
    gainXp(20, "Bottle cast");

    // 4. Simulate receiving a reply (Demo feature)
    setTimeout(() => {
        const replyText = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
        const newReply: Reply = {
            id: Math.random().toString(36).substr(2, 9),
            content: replyText,
            author: "Stranger",
            authorRank: "Listener",
            timestamp: new Date(),
            vote: null
        };

        setSentBottles(prev => prev.map(b => {
            if (b.id === newBottle.id) {
                return { 
                    ...b, 
                    replies: [...b.replies, newReply],
                    hasUnreadReplies: true 
                };
            }
            return b;
        }));
        showNotification("Someone found your bottle!");
    }, 8000);
  };

  const handleOpenBottle = () => {
    if (!dailyBottle || (nextReceiveTime && Date.now() > nextReceiveTime)) {
        const newBottle = getRandomBottle();
        setDailyBottle(newBottle);
        setHasRatedDaily(false); // Reset rating for new bottle
        localStorage.setItem('drift_daily_bottle', JSON.stringify(newBottle));
        
        const nextTime = Date.now() + COOLDOWN_MS;
        setNextReceiveTime(nextTime);
        localStorage.setItem('drift_next_receive', nextTime.toString());
    }
    setIsReadingBottle(true);
  };

  const handleSendReply = () => {
    if (!replyContent.trim()) return;
    
    setIsReplying(false);
    setReplyContent("");
    setIsReadingBottle(false);
    
    gainXp(30, "Reply sent");
    showNotification("Reply sent to the stranger.");

    // SIMULATION: The "Stranger" rates your advice later
    simulateIncomingFeedback();
  };

  const handleReplyAction = (bottleId: string, replyId: string, action: 'up' | 'down' | 'super') => {
      setSentBottles(prev => prev.map(bottle => {
          if (bottle.id !== bottleId) return bottle;
          
          return {
              ...bottle,
              replies: bottle.replies.map(reply => {
                  if (reply.id !== replyId) return reply;
                  
                  // If clicking the same action, toggle it off (except super)
                  if (reply.vote === action && action !== 'super') {
                      return { ...reply, vote: null };
                  }
                  
                  return { ...reply, vote: action };
              })
          };
      }));

      // Update the selected bottle view as well so UI updates immediately
      if (selectedHistoryBottle && selectedHistoryBottle.id === bottleId) {
          setSelectedHistoryBottle(prev => {
              if(!prev) return null;
              return {
                  ...prev,
                  replies: prev.replies.map(reply => {
                      if (reply.id !== replyId) return reply;
                      if (reply.vote === action && action !== 'super') {
                          return { ...reply, vote: null };
                      }
                      return { ...reply, vote: action };
                  })
              }
          });
      }

      if (action === 'super') {
          gainXp(15, "Super Thanks Sent");
          showNotification("Gratitude sent!");
      } else if (action === 'up') {
          showNotification("Marked as helpful");
      }
  };

  const simulateIncomingFeedback = () => {
      // Simulate asynchronous feedback coming in from the "Stranger"
      const delay = 4000 + Math.random() * 3000;
      
      setTimeout(() => {
          const roll = Math.random();
          if (roll > 0.7) {
              gainXp(50, "Stranger found your advice helpful!");
          } else if (roll > 0.9) {
              gainXp(150, "You received a Flower!");
          } else if (roll < 0.1) {
              loseXp(20, "Advice marked unhelpful");
          }
      }, delay);
  };

  const handleOpenHistoryBottle = (bottle: SentBottle) => {
      if (bottle.hasUnreadReplies) {
          const updated = { ...bottle, hasUnreadReplies: false };
          setSentBottles(prev => prev.map(b => b.id === bottle.id ? updated : b));
          setSelectedHistoryBottle(updated);
      } else {
          setSelectedHistoryBottle(bottle);
      }
  };

  const getFormatTimeLeft = (targetTime: number) => {
    const diff = targetTime - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const receiveTimeLeft = nextReceiveTime ? getFormatTimeLeft(nextReceiveTime) : null;
  const canReceive = !receiveTimeLeft;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const xpProgress = Math.min(100, (xp / userLevel.nextXp) * 100);

  return (
    <div className="relative w-full h-full bg-[#09090b] flex flex-col overflow-hidden font-sans">
      
      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
            <LevelUpModal 
                level={userLevel.level} 
                title={userLevel.title} 
                onClose={() => setShowLevelUp(false)} 
            />
        )}
      </AnimatePresence>
      
      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
            <ProfileModal 
                xp={xp}
                level={userLevel.level}
                title={userLevel.title}
                nextXp={userLevel.nextXp}
                onClose={() => setShowProfile(false)}
            />
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px]" />
      </div>

       {/* HEADER: Date & Sleek XP Pill */}
       <div className="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start pointer-events-none">
           {/* Left: Greeting/Date */}
           <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col pt-1"
           >
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span className="text-white/90 text-xl font-serif italic tracking-wide">Drift</span>
           </motion.div>

           {/* Right: Sleek XP Component */}
           <motion.div
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             onClick={() => setShowProfile(true)}
             className="pointer-events-auto bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pr-4 flex items-center gap-3 shadow-2xl hover:bg-[#222] transition-colors cursor-pointer"
           >
              {/* Circular Progress Level Indicator */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                 {/* Track */}
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" stroke="#333" strokeWidth="2.5" fill="none" />
                    <motion.circle
                      cx="18" cy="18" r="15"
                      stroke="url(#gradient)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="94.2" // 2 * pi * 15
                      strokeDashoffset={94.2 - (94.2 * xpProgress) / 100}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 94.2 }}
                      animate={{ strokeDashoffset: 94.2 - (94.2 * xpProgress) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <span className="text-[11px] font-bold text-white relative z-10">{userLevel.level}</span>
                 {/* Glow behind number */}
                 <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full" />
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-white tracking-wide uppercase">{userLevel.title}</span>
                    <Sparkles size={10} className="text-yellow-400 fill-yellow-400/50" />
                 </div>
                 <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-[9px] text-zinc-500 font-medium font-mono">{xp} / {userLevel.nextXp} XP</span>
                 </div>
              </div>
           </motion.div>
       </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
            {activeTab === 'write' ? (
                <motion.div 
                    key="write"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full pt-20"
                >
                    <FlowEditor onSend={handleSend} nextSendTime={nextSendTime} />
                </motion.div>
            ) : (
                <motion.div 
                    key="shore"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-full pb-32 pt-24"
                >
                   {/* SHORE: Hero Section */}
                   <div className="relative flex flex-col items-center justify-center p-6 mb-12">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center w-full max-w-sm flex flex-col items-center gap-10"
                        >
                            <div>
                                <h2 className="text-3xl text-white font-serif mb-2">The Shore</h2>
                                <p className="text-zinc-500 text-sm font-light">Messages wash ashore with the tide.</p>
                            </div>

                            {canReceive ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleOpenBottle}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-full blur-2xl absolute inset-0 animate-pulse" />
                                    <div className="relative w-32 h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                                        <div className="absolute inset-0 bg-white/5 rounded-full animate-ping opacity-20" />
                                        <Compass size={40} className="text-indigo-200" strokeWidth={1} />
                                    </div>
                                    <div className="mt-6 text-indigo-200 text-sm tracking-widest uppercase opacity-80">Open Bottle</div>
                                </motion.button>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-8 py-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
                                        <motion.div 
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative z-10 opacity-30"
                                        >
                                            <Waves size={64} strokeWidth={1} className="text-zinc-500" />
                                        </motion.div>
                                    </div>
                                     <div className="inline-flex items-center gap-2.5 bg-zinc-900/80 px-5 py-2.5 rounded-full border border-white/5 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-pulse" />
                                        <span className="text-zinc-400 font-mono text-xs tracking-wider uppercase">High tide in {receiveTimeLeft}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                   </div>

                   {/* SHORE: Your Drifts (History) */}
                   <div className="px-6 pb-6 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-8 opacity-60 px-2">
                            <div className="flex items-center gap-2">
                                <Send size={14} className="text-zinc-400" />
                                <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">Your Drifts</h3>
                            </div>
                            <span className="text-xs font-serif text-zinc-500 italic">{sentBottles.length} Memories</span>
                        </div>

                        {sentBottles.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5 mx-2">
                                <p className="text-zinc-500 font-serif italic">You haven't cast any bottles yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {sentBottles.map((bottle, index) => (
                                    <motion.div
                                        key={bottle.id}
                                        onClick={() => handleOpenHistoryBottle(bottle)}
                                        className="relative bg-[#1a1a1c]/60 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group shadow-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-medium text-zinc-500 tracking-wider uppercase">{formatDate(bottle.timestamp)}</span>
                                            
                                            {bottle.hasUnreadReplies ? (
                                                <div className="flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                                                    <span className="relative flex h-2 w-2">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                                    </span>
                                                    <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wide">Reply</span>
                                                </div>
                                            ) : bottle.replies.length > 0 && (
                                                <div className="flex items-center gap-1 text-zinc-600">
                                                    <MessageSquare size={12} />
                                                    <span className="text-[10px] font-medium">{bottle.replies.length}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="relative">
                                            <Quote size={16} className="absolute -top-1 -left-1 text-white/10" />
                                            <p className="text-zinc-200 font-serif text-xl line-clamp-2 leading-relaxed pl-4 italic opacity-90 group-hover:opacity-100 transition-opacity">
                                                {bottle.content}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                             <div className="flex items-center gap-1 text-xs text-zinc-600">
                                                <MapPin size={10} />
                                                <span>{bottle.location}</span>
                                             </div>
                                             <div className="bg-white/5 rounded-full p-1 group-hover:bg-white/10 transition-colors">
                                                 <ArrowRight size={12} className="text-zinc-500 group-hover:text-white" />
                                             </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                   </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* FULL SCREEN READING OVERLAY */}
      <AnimatePresence>
        {(isReadingBottle || selectedHistoryBottle) && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-[#0c0c0e] flex flex-col"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 pointer-events-none">
                    <div />
                    <button 
                        onClick={() => { 
                            setIsReadingBottle(false); 
                            setSelectedHistoryBottle(null);
                            setIsReplying(false); 
                        }}
                        className="pointer-events-auto p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors group border border-white/5"
                    >
                        <X size={20} className="text-zinc-400 group-hover:text-white" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative">
                    <div className="min-h-full flex flex-col items-center pt-24 pb-32">
                        
                        <div className="fixed top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-indigo-900/10 via-blue-900/5 to-transparent pointer-events-none" />

                        {/* MODE 1: Reading History (Improved) */}
                        {selectedHistoryBottle && (
                             <div className="relative z-10 w-full max-w-lg px-6">
                                {/* The Memory (Original Bottle) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12 relative"
                                >
                                    <div className="flex items-center gap-2 mb-4 opacity-60">
                                        <div className="w-6 h-px bg-zinc-600" />
                                        <span className="text-xs uppercase tracking-widest text-zinc-400">Your Memory</span>
                                    </div>
                                    <h2 className="font-serif text-2xl md:text-3xl text-zinc-400 leading-relaxed italic border-l-2 border-white/10 pl-6 py-2">
                                        "{selectedHistoryBottle.content}"
                                    </h2>
                                </motion.div>

                                {/* The Replies */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2 opacity-80">
                                            <Waves size={16} className="text-indigo-400" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-indigo-300">Echoes from the Shore</span>
                                        </div>
                                        <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-1 rounded">{selectedHistoryBottle.replies.length} replies</span>
                                    </div>

                                    {selectedHistoryBottle.replies.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedHistoryBottle.replies.map((reply, i) => (
                                                <motion.div 
                                                    key={reply.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group
                                                        ${reply.vote === 'down' ? 'bg-[#121214] border-white/5 opacity-50 blur-[1px] hover:blur-0' : 'bg-[#1a1a1c] border-white/10 shadow-lg'}`}
                                                >
                                                    {/* Background Glow for Super Thanks */}
                                                    {reply.vote === 'super' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
                                                    )}

                                                    {/* Header */}
                                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                                         <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 border border-white/10 shadow-inner">
                                                                {reply.author.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{reply.authorRank || 'Drifter'}</div>
                                                                <div className="text-[10px] text-zinc-600">Just now</div>
                                                            </div>
                                                         </div>
                                                    </div>

                                                    {/* Content */}
                                                    <p className={`font-serif text-lg leading-relaxed mb-6 relative z-10 ${reply.vote === 'down' ? 'text-zinc-500' : 'text-zinc-100'}`}>
                                                        "{reply.content}"
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-between pt-2 relative z-10">
                                                        <div className="flex items-center gap-1 bg-black/20 rounded-full p-1 border border-white/5">
                                                            {/* Upvote */}
                                                            <button 
                                                                onClick={() => handleReplyAction(selectedHistoryBottle.id, reply.id, 'up')}
                                                                className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 ${reply.vote === 'up' ? 'text-pink-400 bg-pink-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                                            >
                                                                <Heart size={16} fill={reply.vote === 'up' ? "currentColor" : "none"} />
                                                                {reply.vote === 'up' && <span className="text-[10px] font-bold pr-1">Helpful</span>}
                                                            </button>
                                                            
                                                            <div className="w-px h-4 bg-white/10 mx-1" />

                                                            {/* Downvote */}
                                                            <button 
                                                                onClick={() => handleReplyAction(selectedHistoryBottle.id, reply.id, 'down')}
                                                                className={`p-2 rounded-full transition-all ${reply.vote === 'down' ? 'text-zinc-400 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                                            >
                                                                <HeartCrack size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Super Thanks */}
                                                        <button 
                                                            onClick={() => handleReplyAction(selectedHistoryBottle.id, reply.id, 'super')}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${reply.vote === 'super' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-transparent text-zinc-600 hover:text-yellow-400'}`}
                                                        >
                                                            <Sparkles size={14} fill={reply.vote === 'super' ? "currentColor" : "none"} />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Send Thanks</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                            <Waves size={24} className="mx-auto mb-3 text-zinc-600" />
                                            <p className="text-sm text-zinc-500">Your bottle is still drifting...</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        )}

                        {/* MODE 2: Reading Daily Bottle */}
                        {isReadingBottle && dailyBottle && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className={`relative z-10 max-w-md w-full text-center space-y-10 transition-all duration-500 ${isReplying ? 'opacity-40 scale-95 blur-sm' : 'opacity-100'}`}
                            >
                                <Quote size={48} className="text-indigo-500/20 mx-auto" />
                                
                                <p className="font-serif text-3xl md:text-4xl text-zinc-100 leading-normal italic tracking-wide">
                                    "{dailyBottle.content}"
                                </p>
                                
                                <div className="flex flex-col items-center gap-4 pt-4">
                                    <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/5 shadow-lg backdrop-blur-sm">
                                        <MapPin size={14} className="text-indigo-400" />
                                        <span className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">
                                            {dailyBottle.location}
                                        </span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest">
                                            {dailyBottle.authorRank || 'Drifter'}
                                        </span>
                                    </div>

                                    {/* Rating Controls (Feedback System) */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <button 
                                            onClick={() => handleRateStranger('down')}
                                            disabled={hasRatedDaily}
                                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                                        >
                                            <ThumbsDown size={20} />
                                        </button>
                                        <div className="w-px h-8 bg-white/10 mx-2" />
                                        <button 
                                            onClick={() => handleRateStranger('up')}
                                            disabled={hasRatedDaily}
                                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:text-indigo-400"
                                        >
                                            <ThumbsUp size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleRateStranger('flower')}
                                            disabled={hasRatedDaily}
                                            className="p-3 rounded-full bg-white/5 hover:bg-pink-500/20 text-zinc-400 hover:text-pink-400 transition-colors disabled:opacity-30 disabled:text-pink-400"
                                        >
                                            <Flower2 size={20} />
                                        </button>
                                    </div>
                                    {hasRatedDaily && (
                                        <motion.span 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-[10px] text-zinc-500 uppercase tracking-widest"
                                        >
                                            Feedback Sent
                                        </motion.span>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Reply Input Area */}
                        <AnimatePresence>
                            {isReplying && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0c0c0e]/95 backdrop-blur-xl p-6"
                                >
                                    <div className="w-full max-w-md">
                                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-6 text-center">
                                            Reply to {dailyBottle?.authorRank || 'Stranger'}
                                        </h3>
                                        <textarea 
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a supportive message..."
                                            className="w-full bg-transparent text-2xl text-white font-serif placeholder-zinc-700 outline-none resize-none min-h-[200px] text-center"
                                            autoFocus
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Actions Bar */}
                {isReadingBottle && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-30">
                        <div className="max-w-md mx-auto">
                            {!isReplying ? (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsReplying(true)}
                                    className="w-full py-4 bg-white text-black rounded-full font-medium text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>Write a Reply</span>
                                </motion.button>
                            ) : (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsReplying(false)}
                                        className="flex-1 py-4 bg-zinc-800 text-zinc-300 rounded-full font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!replyContent.trim()}
                                        className="flex-[2] py-4 bg-white text-black rounded-full font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <span>Send</span>
                                        <Send size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Dock */}
      {!isReadingBottle && !selectedHistoryBottle && (
          <div className="fixed bottom-0 left-0 right-0 h-28 px-8 pb-8 pt-4 z-40 flex justify-center items-end pointer-events-none">
            <div className="glass-panel pointer-events-auto rounded-full px-6 py-4 flex items-center gap-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#09090b]/80 backdrop-blur-xl border border-white/10">
                <button 
                    onClick={() => setActiveTab('shore')}
                    className={`transition-all duration-300 relative flex flex-col items-center gap-1 ${activeTab === 'shore' ? 'text-white scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <Waves size={26} strokeWidth={activeTab === 'shore' ? 2.5 : 2} />
                    {canReceive && activeTab !== 'shore' && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse border-2 border-[#09090b]" />
                    )}
                </button>
                <div className="w-px h-8 bg-white/10" />
                <button 
                    onClick={() => setActiveTab('write')}
                    className={`transition-all duration-300 flex flex-col items-center gap-1 ${activeTab === 'write' ? 'text-white scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <PenLine size={26} strokeWidth={activeTab === 'write' ? 2.5 : 2} />
                </button>
            </div>
          </div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
            <motion.div 
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-6 left-0 right-0 flex justify-center z-[60] pointer-events-none px-4"
            >
                <div className={`bg-white/10 backdrop-blur-xl border border-white/10 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-3 ${notificationType === 'xp' ? 'border-indigo-500/30 bg-indigo-900/40' : ''}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)] ${notificationType === 'xp' ? 'bg-yellow-400' : 'bg-indigo-400'}`} />
                    {notification}
                    {notificationType === 'xp' && <Sparkles size={14} className="text-yellow-400 ml-1" />}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
