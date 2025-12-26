import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Button } from './Button';
import { Fingerprint, Shield, RefreshCw, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
    interpolate,
    useDerivedValue,
} from 'react-native-reanimated';

interface PassportStepProps {
    onNext: () => void;
}

const ALIASES = [
    "Mystic River", "Silent Echo", "Wandering Soul",
    "Velvet Night", "Cosmic Dust", "Ocean Whisper",
    "Azure Sky", "Lunar Tide", "Solar Flare", "Neon Rain"
];

// Gradient color sets with RGB values for smooth interpolation
const GRADIENT_SETS = [
    { start: [99, 102, 241], end: [236, 72, 153] },   // Indigo -> Pink
    { start: [16, 185, 129], end: [14, 165, 233] },   // Emerald -> Sky
    { start: [245, 158, 11], end: [244, 63, 94] },    // Amber -> Rose
    { start: [139, 92, 246], end: [217, 70, 239] },   // Violet -> Fuchsia
];

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ID_LENGTH = 6;

// Animated slot character with smooth rolling animation
const SlotCharacter: React.FC<{
    targetChar: string;
    delay: number;
    isSpinning: boolean;
}> = ({ targetChar, delay, isSpinning }) => {
    const [displayChar, setDisplayChar] = useState(targetChar);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isSpinning) {
            let spinCount = 0;
            const maxSpins = 8 + Math.floor(delay / 40);

            // Delayed start for staggered effect
            const startTimeout = setTimeout(() => {
                const spinInterval = setInterval(() => {
                    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    setDisplayChar(randomChar);

                    // Smooth rolling animation
                    translateY.value = withSequence(
                        withTiming(-6, { duration: 20, easing: Easing.out(Easing.quad) }),
                        withTiming(6, { duration: 0 }),
                        withTiming(0, { duration: 20, easing: Easing.out(Easing.quad) })
                    );

                    spinCount++;
                    if (spinCount >= maxSpins) {
                        clearInterval(spinInterval);
                        // Final settle with bounce
                        setDisplayChar(targetChar);
                        translateY.value = withSequence(
                            withTiming(-8, { duration: 50, easing: Easing.out(Easing.quad) }),
                            withTiming(2, { duration: 60, easing: Easing.inOut(Easing.quad) }),
                            withTiming(0, { duration: 80, easing: Easing.out(Easing.quad) })
                        );
                    }
                }, 35);

                return () => clearInterval(spinInterval);
            }, delay);

            return () => clearTimeout(startTimeout);
        } else {
            setDisplayChar(targetChar);
        }
    }, [isSpinning, targetChar, delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.Text style={[styles.idChar, animatedStyle]}>
            {displayChar}
        </Animated.Text>
    );
};

// Animated ID display with slot machine effect
const AnimatedID: React.FC<{ id: string; isSpinning: boolean }> = ({ id, isSpinning }) => {
    return (
        <View style={styles.idContainer}>
            {id.split('').map((char, index) => (
                <SlotCharacter
                    key={`${index}-${id}`}
                    targetChar={char}
                    delay={index * 80}
                    isSpinning={isSpinning}
                />
            ))}
        </View>
    );
};

// Animated name with smooth crossfade
const AnimatedName: React.FC<{ name: string; isSpinning: boolean }> = ({ name, isSpinning }) => {
    const [displayName, setDisplayName] = useState(name);
    const opacity = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isSpinning) {
            let spinCount = 0;
            const interval = setInterval(() => {
                // Smooth transition animation
                opacity.value = withTiming(0.6, { duration: 40 });
                translateY.value = withTiming(-3, { duration: 40 });

                setTimeout(() => {
                    setDisplayName(ALIASES[Math.floor(Math.random() * ALIASES.length)]);
                    translateY.value = 3;
                    translateY.value = withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) });
                    opacity.value = withTiming(1, { duration: 40 });
                }, 40);

                spinCount++;
                if (spinCount >= 10) {
                    clearInterval(interval);
                    setDisplayName(name);
                    // Final settle
                    opacity.value = withTiming(1, { duration: 100 });
                    translateY.value = withSequence(
                        withTiming(-4, { duration: 60 }),
                        withTiming(0, { duration: 100, easing: Easing.out(Easing.quad) })
                    );
                }
            }, 70);
            return () => clearInterval(interval);
        } else {
            setDisplayName(name);
        }
    }, [isSpinning, name]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.Text style={[styles.aliasText, animatedStyle]}>
            {displayName}
        </Animated.Text>
    );
};

// Animated gradient overlay component
const AnimatedGradientOverlay: React.FC<{
    fromColors: number[][];
    toColors: number[][];
    progress: Animated.SharedValue<number>;
}> = ({ fromColors, toColors, progress }) => {
    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <>
            {/* Base gradient (from) */}
            <LinearGradient
                colors={[
                    `rgba(${fromColors[0][0]},${fromColors[0][1]},${fromColors[0][2]},0.25)`,
                    'transparent',
                    `rgba(${fromColors[1][0]},${fromColors[1][1]},${fromColors[1][2]},0.25)`,
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Target gradient (to) - fades in */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedOpacity]}>
                <LinearGradient
                    colors={[
                        `rgba(${toColors[0][0]},${toColors[0][1]},${toColors[0][2]},0.25)`,
                        'transparent',
                        `rgba(${toColors[1][0]},${toColors[1][1]},${toColors[1][2]},0.25)`,
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </>
    );
};

export const PassportStep: React.FC<PassportStepProps> = ({ onNext }) => {
    const [identity, setIdentity] = useState({
        alias: "Unknown",
        gradientIndex: 0,
        id: "------"
    });
    const [prevGradientIndex, setPrevGradientIndex] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);

    // Animated gradient transition
    const gradientProgress = useSharedValue(1);
    const rotateAnim = useSharedValue(0);

    useEffect(() => {
        handleShuffle();
    }, []);

    const handleShuffle = useCallback(() => {
        if (isShuffling) return;

        setIsShuffling(true);

        // Animate refresh icon
        rotateAnim.value = 0;
        rotateAnim.value = withTiming(360, {
            duration: 800,
            easing: Easing.inOut(Easing.cubic)
        });

        // Pick new target values
        const newAlias = ALIASES[Math.floor(Math.random() * ALIASES.length)];
        const newGradientIndex = Math.floor(Math.random() * GRADIENT_SETS.length);
        const newId = Array.from({ length: ID_LENGTH }, () =>
            CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
        ).join('');

        // Start gradient transition
        setPrevGradientIndex(identity.gradientIndex);
        gradientProgress.value = 0;
        gradientProgress.value = withTiming(1, {
            duration: 600,
            easing: Easing.inOut(Easing.cubic)
        });

        // Update identity
        setIdentity({
            alias: newAlias,
            gradientIndex: newGradientIndex,
            id: newId
        });

        // End shuffling after animations complete
        setTimeout(() => {
            setIsShuffling(false);
        }, 850);
    }, [isShuffling, identity.gradientIndex]);

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotateAnim.value}deg` }],
    }));

    const insets = useSafeAreaInsets();
    const currentGradient = GRADIENT_SETS[identity.gradientIndex];
    const prevGradient = GRADIENT_SETS[prevGradientIndex];

    return (
        <View
            className="flex-1 items-center px-6 bg-black"
            style={{ paddingTop: insets.top + 24 }}
        >

            <View className="items-center mb-8 z-10">
                <Text className="text-3xl font-bold text-white mb-2">Anonymous Identity</Text>
                <Text className="text-gray-400 text-sm">You are free to be yourself.</Text>
            </View>

            {/* Drifter Pass Card */}
            <Pressable onPress={handleShuffle}>
                <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-8"
                    style={{ height: 280, width: Dimensions.get('window').width - 48 }}
                >
                    {/* Animated holographic gradient effect */}
                    <AnimatedGradientOverlay
                        fromColors={[prevGradient.start, prevGradient.end]}
                        toColors={[currentGradient.start, currentGradient.end]}
                        progress={gradientProgress}
                    />

                    <View className="p-8 relative z-10 flex-1 justify-between">
                        <View className="flex-row justify-between items-start mb-12">
                            <View>
                                <Text className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Drifter Pass</Text>
                                <AnimatedName name={identity.alias} isSpinning={isShuffling} />
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
                                <AnimatedID id={identity.id} isSpinning={isShuffling} />
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
                    <Animated.View style={rotateStyle}>
                        <RefreshCw size={12} color="#818cf8" />
                    </Animated.View>
                    <Text className="text-xs font-medium text-indigo-400">
                        Generate New
                    </Text>
                </Pressable>
            </View>

            <Button onPress={onNext}>Confirm Identity</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    aliasText: {
        fontSize: 24,
        fontStyle: 'italic',
        color: 'white',
        fontFamily: 'serif',
    },
    idContainer: {
        flexDirection: 'row',
    },
    idChar: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        letterSpacing: 2,
        minWidth: 12,
        textAlign: 'center',
    },
});
