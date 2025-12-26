import React from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Award, Bell, Moon, Shield, LogOut, ChevronRight, Zap, Heart, Map } from 'lucide-react';

interface ProfileModalProps {
  xp: number;
  level: number;
  title: string;
  nextXp: number;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ xp, level, title, nextXp, onClose }) => {
  const progress = Math.min(100, (xp / nextXp) * 100);

  const achievements = [
    { id: 1, icon: Zap, label: "First Drift", unlocked: true },
    { id: 2, icon: Heart, label: "Good Listener", unlocked: xp > 100 },
    { id: 3, icon: Map, label: "Explorer", unlocked: xp > 300 },
    { id: 4, icon: Award, label: "Anchor", unlocked: xp > 600 },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-md bg-[#121214] border-t border-x border-white/10 md:border md:rounded-3xl rounded-t-3xl overflow-hidden h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121214] sticky top-0 z-20">
            <h2 className="text-lg font-serif italic text-white">Identity</h2>
            <button 
                onClick={onClose}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
                <X size={20} className="text-zinc-400" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
            
            {/* ID Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1f] to-[#121214] border border-white/10 p-6">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />
                 
                 <div className="flex items-center gap-5 mb-6">
                    <div className="relative w-20 h-20">
                        {/* Circular Progress */}
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#333" strokeWidth="4" fill="none" />
                            <circle
                                cx="40" cy="40" r="36"
                                stroke="#6366f1"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray="226"
                                strokeDashoffset={226 - (226 * progress) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{level}</span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Current Rank</div>
                        <h1 className="text-3xl text-white font-serif italic">{title}</h1>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400 font-medium">
                        <span>XP Progress</span>
                        <span>{xp} / {nextXp}</span>
                    </div>
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-indigo-500 rounded-full" 
                        />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2 text-center">
                        Earn XP by sending bottles, replying to strangers, and opening daily tides.
                    </p>
                 </div>
            </div>

            {/* Achievements */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Award size={14} /> Achievements
                </h3>
                <div className="grid grid-cols-4 gap-3">
                    {achievements.map((item) => (
                        <div key={item.id} className="flex flex-col items-center gap-2">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${item.unlocked ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/5 text-zinc-700'}`}>
                                <item.icon size={20} />
                            </div>
                            <span className={`text-[10px] text-center font-medium ${item.unlocked ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1c1c1f] p-4 rounded-2xl border border-white/5">
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Bottles Sent</div>
                    <div className="text-2xl text-white font-serif">12</div>
                </div>
                <div className="bg-[#1c1c1f] p-4 rounded-2xl border border-white/5">
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">Lives Touched</div>
                    <div className="text-2xl text-white font-serif">8</div>
                </div>
            </div>

            {/* Settings */}
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Settings size={14} /> Preferences
                </h3>
                <div className="space-y-1">
                    <SettingItem icon={Bell} label="Notifications" toggle />
                    <SettingItem icon={Moon} label="Dark Mode" value="On" />
                    <SettingItem icon={Shield} label="Privacy Policy" />
                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group text-red-400/80 hover:text-red-400">
                        <div className="flex items-center gap-3">
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Reset Journey</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label, value, toggle }: { icon: any, label: string, value?: string, toggle?: boolean }) => (
    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1c1c1f] border border-white/5 mb-2 active:scale-[0.98] transition-all">
        <div className="flex items-center gap-3 text-zinc-300">
            <Icon size={18} className="text-zinc-500" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-xs text-zinc-500">{value}</span>}
            {toggle ? (
                 <div className="w-8 h-5 bg-indigo-500 rounded-full relative">
                    <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                 </div>
            ) : (
                <ChevronRight size={16} className="text-zinc-600" />
            )}
        </div>
    </button>
);