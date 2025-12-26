import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Crown, Sparkles, X } from 'lucide-react-native';
import { Button } from './Button';

interface LevelUpModalProps {
    level: number;
    title: string;
    onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {
    return (
        <Modal transparent animationType="fade" visible>
            <View className="flex-1 items-center justify-center bg-black/80 px-8">
                <MotiView 
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl p-8 items-center relative overflow-hidden"
                >
                    {/* Background glow */}
                    <View className="absolute top-0 inset-x-0 h-32 bg-indigo-500/20 blur-2xl" />

                    <MotiView
                        from={{ scale: 0, rotate: '-180deg' }}
                        animate={{ scale: 1, rotate: '0deg' }}
                        transition={{ type: 'spring', delay: 200 }}
                        className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full items-center justify-center mb-6 shadow-xl border-4 border-zinc-900"
                    >
                        <Crown size={40} color="white" fill="white" />
                    </MotiView>

                    <Text className="text-zinc-400 font-medium uppercase tracking-widest mb-2">Level Up!</Text>
                    <Text className="text-white text-4xl font-serif italic mb-6 text-center">{title}</Text>
                    
                    <Text className="text-zinc-500 text-center mb-8 leading-relaxed">
                        You've reached level {level}. Your journey continues to deepen.
                    </Text>

                    <Pressable 
                        onPress={onClose}
                        className="bg-white w-full py-4 rounded-xl items-center active:scale-95 transition-transform"
                    >
                        <Text className="font-bold text-black">Continue Journey</Text>
                    </Pressable>
                </MotiView>
            </View>
        </Modal>
    );
};
