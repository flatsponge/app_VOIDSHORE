import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Check, Star, Shield, Zap, Infinity as InfinityIcon } from 'lucide-react';

interface PaywallStepProps {
  onNext: () => void;
}

export const PaywallStep: React.FC<PaywallStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-[#09090b] relative px-6 pt-12 pb-8 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
        >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                Early Access Offer
            </span>
            <h1 className="text-4xl font-serif text-white mb-2">Unlock Your Peace</h1>
            <p className="text-zinc-400 text-sm">Join 10,000+ others finding clarity today.</p>
        </motion.div>

        {/* Plan Card */}
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#1c1c1f] to-[#121214] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-6"
        >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-white font-medium text-lg">Drift Premium</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <span className="text-zinc-500 ml-1">(4.9/5)</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">$4.99</div>
                    <div className="text-zinc-500 text-xs">/ month</div>
                </div>
            </div>

            <div className="space-y-4">
                <BenefitRow icon={InfinityIcon} text="Unlimited Drifts per day" />
                <BenefitRow icon={Shield} text="Guaranteed Anonymity" />
                <BenefitRow icon={Zap} text="Priority Support from Community" />
                <BenefitRow icon={Check} text="Advanced Mood Analytics" />
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-zinc-500">
                    7-day free trial, then $4.99/mo. Cancel anytime.
                </p>
            </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#121214] rounded-2xl p-4 border border-white/5"
        >
            <p className="text-zinc-300 text-sm italic mb-3">"I've tried every journaling app. Drift is the only one that actually makes me feel lighter. It's therapy in my pocket."</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs text-white font-bold">JD</div>
                <div>
                    <div className="text-xs text-white font-medium">Sarah J.</div>
                    <div className="text-[10px] text-zinc-500">Member since 2023</div>
                </div>
            </div>
        </motion.div>

        <div className="flex-1" />
      </div>

      <div className="fixed bottom-8 left-0 right-0 px-6 z-50 flex flex-col gap-3">
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full bg-white text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
            Start Free Trial
        </motion.button>
        <p className="text-[10px] text-center text-zinc-600">
            By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

const BenefitRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Icon size={12} strokeWidth={3} />
        </div>
        <span className="text-zinc-300 text-sm font-medium">{text}</span>
    </div>
);