import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { X, Trophy, Zap, Clock } from 'lucide-react-native';

interface ProfileModalProps {
    xp: number;
    level: number;
    title: string;
    nextXp: number;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ xp, level, title, nextXp, onClose }) => {
    const progress = (xp / nextXp) * 100;

    return (
        <Modal transparent animationType="slide" visible>
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0 bg-black/60" onPress={onClose} />
                
                <MotiView 
                    from={{ translateY: 500 }}
                    animate={{ translateY: 0 }}
                    className="bg-zinc-900 rounded-t-3xl border-t border-white/10 p-8 pb-12"
                >
                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-white text-xl font-serif">Your Journey</Text>
                        <Pressable onPress={onClose} className="bg-white/5 p-2 rounded-full">
                            <X size={20} color="#a1a1aa" />
                        </Pressable>
                    </View>

                    <View className="flex-row items-center gap-6 mb-8">
                        <View className="w-20 h-20 rounded-full border-2 border-indigo-500 items-center justify-center">
                            <Text className="text-white text-3xl font-bold">{level}</Text>
                        </View>
                        <View>
                            <Text className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Current Rank</Text>
                            <Text className="text-white text-2xl font-serif italic">{title}</Text>
                        </View>
                    </View>

                    <View className="mb-8">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-zinc-500 text-xs font-mono">XP Progress</Text>
                            <Text className="text-zinc-300 text-xs font-mono">{Math.floor(xp)} / {nextXp}</Text>
                        </View>
                        <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                        </View>
                    </View>

                    <View className="grid grid-cols-2 gap-4 flex-row">
                        <View className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Trophy size={20} color="#fbbf24" className="mb-2" />
                            <Text className="text-zinc-500 text-xs mb-1">Total XP</Text>
                            <Text className="text-white text-lg font-bold">{xp}</Text>
                        </View>
                        <View className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Zap size={20} color="#818cf8" className="mb-2" />
                            <Text className="text-zinc-500 text-xs mb-1">Streak</Text>
                            <Text className="text-white text-lg font-bold">1 Day</Text>
                        </View>
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};
