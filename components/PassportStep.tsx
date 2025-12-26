import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Button } from './Button';
import { Fingerprint, Shield, RefreshCw, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PassportStepProps {
    onNext: () => void;
}

const ALIASES = [
    "Mystic River", "Silent Echo", "Wandering Soul",
    "Velvet Night", "Cosmic Dust", "Ocean Whisper",
    "Azure Sky", "Lunar Tide", "Solar Flare", "Neon Rain"
];

const GRADIENT_COLORS = [
    ['rgba(99,102,241,0.2)', 'transparent', 'rgba(236,72,153,0.2)'], // Indigo -> Pink
    ['rgba(16,185,129,0.2)', 'transparent', 'rgba(14,165,233,0.2)'], // Emerald -> Sky
    ['rgba(245,158,11,0.2)', 'transparent', 'rgba(244,63,94,0.2)'], // Amber -> Rose
    ['rgba(139,92,246,0.2)', 'transparent', 'rgba(217,70,239,0.2)'], // Violet -> Fuchsia
];

export const PassportStep: React.FC<PassportStepProps> = ({ onNext }) => {
    const [identity, setIdentity] = useState({
        alias: "Unknown",
        gradient: GRADIENT_COLORS[0],
        id: "---"
    });
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(() => {
        handleShuffle();
    }, []);

    const handleShuffle = () => {
        setIsShuffling(true);
        let count = 0;
        const interval = setInterval(() => {
            setIdentity({
                alias: ALIASES[Math.floor(Math.random() * ALIASES.length)],
                gradient: GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)],
                id: Math.random().toString(36).substr(2, 6).toUpperCase()
            });
            count++;
            if (count > 8) {
                clearInterval(interval);
                setIsShuffling(false);
            }
        }, 50);
    };

    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 items-center px-6 bg-black"
            style={{ paddingTop: insets.top + 20 }}
        >

            <View className="items-center mb-8 z-10">
                <Text className="text-3xl font-bold text-white mb-2">Anonymous Identity</Text>
                <Text className="text-gray-400 text-sm">You are free to be yourself.</Text>
            </View>

            {/* Drifter Pass Card */}
            <Pressable onPress={handleShuffle}>
                <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: 1 }} // Could add hover effect if wanted
                    className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-8"
                    style={{ height: 280, width: Dimensions.get('window').width - 48 }}
                >
                    {/* Holographic effect */}
                    <LinearGradient
                        colors={identity.gradient as any}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ position: 'absolute', inset: 0 }}
                    />

                    <View className="p-8 relative z-10 flex-1 justify-between">
                        <View className="flex-row justify-between items-start mb-12">
                            <View>
                                <Text className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Drifter Pass</Text>
                                <>
                                    <MotiView
                                        key={identity.alias}
                                        from={{ opacity: 0, translateY: 5 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        exit={{ opacity: 0, translateY: -5 }}
                                    >
                                        <Text className="text-2xl font-serif text-white italic">
                                            {identity.alias}
                                        </Text>
                                    </MotiView>
                                </>
                            </View>
                            <View className="w-12 h-12 rounded-full border border-white/20 items-center justify-center bg-black/20">
                                <Fingerprint size={24} color="#a1a1aa" />
                            </View>
                        </View>

                        <View className="gap-4">
                            <View className="flex-row justify-between border-b border-white/5 pb-2">
                                <Text className="text-zinc-500 text-xs uppercase tracking-wide">Status</Text>
                                <Text className="text-white text-sm font-mono">Drifter (Lvl 1)</Text>
                            </View>
                            <View className="flex-row justify-between border-b border-white/5 pb-2">
                                <Text className="text-zinc-500 text-xs uppercase tracking-wide">ID</Text>
                                <Text className="text-white text-sm font-mono font-bold tracking-widest">{identity.id}</Text>
                            </View>
                            <View className="flex-row justify-between border-b border-white/5 pb-2">
                                <Text className="text-zinc-500 text-xs uppercase tracking-wide">Joined</Text>
                                <Text className="text-white text-sm font-mono">{new Date().toLocaleDateString()}</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-end mt-4">
                            <Shield size={16} color="#52525b" />
                            <View className="flex-row items-center gap-1">
                                <Sparkles size={10} color="#52525b" />
                                <Text className="text-[10px] text-zinc-600 font-mono tracking-widest">ENCRYPTED</Text>
                            </View>
                        </View>
                    </View>
                </MotiView>
            </Pressable>

            {/* Interactive Controls */}
            <View className="w-full max-w-sm flex-row items-center justify-between mb-8 px-2">
                <Text className="text-xs text-zinc-500">Tap card to shuffle identity</Text>
                <Pressable
                    onPress={handleShuffle}
                    className="flex-row items-center gap-2"
                >
                    <MotiView animate={{ rotate: isShuffling ? '360deg' : '0deg' }} transition={{ loop: isShuffling, type: 'timing', duration: 1000 }}>
                        <RefreshCw size={12} color="#818cf8" />
                    </MotiView>
                    <Text className="text-xs font-medium text-indigo-400">
                        Generate New
                    </Text>
                </Pressable>
            </View>

            <Button onPress={onNext}>Confirm Identity</Button>
        </View>
    );
};
