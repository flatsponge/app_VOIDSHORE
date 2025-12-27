import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Button } from './Button';
import { Lightbulb } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

interface PerspectiveStepProps {
    onNext: () => void;
}

const { width } = Dimensions.get('window');
const PARTICLE_COUNT = 40;
const CIRCLE_RADIUS = 120;

// Generate random initial positions (Chaos)
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    // Chaos positions: spread randomly across screen
    chaosX: (Math.random() - 0.5) * width * 1.5,
    chaosY: (Math.random() - 0.5) * width * 1.5,
    // Constellation positions: Perfect circle
    targetX: Math.cos((i / PARTICLE_COUNT) * Math.PI * 2) * CIRCLE_RADIUS,
    targetY: Math.sin((i / PARTICLE_COUNT) * Math.PI * 2) * CIRCLE_RADIUS,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 1000,
}));

export const PerspectiveStep: React.FC<PerspectiveStepProps> = ({ onNext }) => {
    const insets = useSafeAreaInsets();
    const progress = useSharedValue(0);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Start animation loop: Chaos -> Order -> Chaos
        const animate = () => {
            progress.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 2500 }), // Form circle
                    withDelay(1000, withTiming(0, { duration: 2000 })) // Break apart
                ),
                -1,
                true
            );
        };

        // Initial delay before starting the cycle
        setTimeout(animate, 500);
        setTimeout(() => setShowButton(true), 1500);
    }, []);

    return (
        <View
            className="flex-1 items-center justify-center bg-[#09090b] px-6 relative overflow-hidden"
            style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }}
        >
            {/* Visual Centerpiece */}
            <View className="flex-1 items-center justify-center w-full relative">

                {/* Background Nebula/Glow */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1.2 }}
                    transition={{
                        type: 'timing',
                        duration: 4000,
                        loop: true,
                        repeatReverse: true
                    }}
                    className="absolute w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"
                />

                {/* Particles Container */}
                <View className="items-center justify-center">
                    {particles.map((p) => (
                        <Particle
                            key={p.id}
                            data={p}
                            progress={progress}
                        />
                    ))}

                    {/* Central Meaning/Icon - appears when order is established */}
                    <Animated.View style={useAnimatedStyle(() => ({
                        opacity: interpolate(progress.value, [0.7, 1], [0, 1]),
                        transform: [{ scale: interpolate(progress.value, [0.5, 1], [0.5, 1]) }]
                    }))} className="absolute z-20">
                        <View className="bg-black/40 p-6 rounded-full border border-indigo-200/20 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                            <Lightbulb size={40} color="#fbbf24" strokeWidth={2} />
                        </View>
                    </Animated.View>
                </View>

            </View>

            {/* Text Content - with proper bottom margin for button spacing */}
            <View className="w-full relative z-10 items-center gap-4 mb-24">
                <View className="items-center">
                    <MotiText
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200, type: 'spring', damping: 20 }}
                        className="font-serif italic text-4xl text-white text-center mb-2"
                    >
                        Find Clarity.
                    </MotiText>
                    <MotiText
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 400, type: 'timing', duration: 1000 }}
                        className="text-zinc-400 text-lg text-center font-light px-4"
                    >
                        When thoughts are tangled,
                    </MotiText>
                </View>

                <MotiView
                    from={{ width: 0, opacity: 0 }}
                    animate={{ width: 60, opacity: 1 }}
                    transition={{ delay: 600, type: 'timing', duration: 800 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                />

                <MotiText
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 800, type: 'timing' }}
                    className="text-zinc-300 text-base leading-relaxed font-light text-center px-8"
                >
                    A fresh perspective aligns the stars.
                </MotiText>
            </View>

            {/* Button moved to root level for proper absolute positioning */}
            <Button onPress={onNext} delay={1} variant="glass">See Clearly</Button>
        </View>
    );
};

const Particle = ({ data, progress }: { data: any, progress: Animated.SharedValue<number> }) => {
    const style = useAnimatedStyle(() => {
        const x = interpolate(progress.value, [0, 1], [data.chaosX, data.targetX]);
        const y = interpolate(progress.value, [0, 1], [data.chaosY, data.targetY]);
        const opacity = interpolate(progress.value, [0, 0.5, 1], [0.3, 0.6, 0.9]);
        const scale = interpolate(progress.value, [0, 1], [1, 1.2]);
        const colorInput = interpolate(progress.value, [0, 1], [0, 1]); // Could toggle colors

        return {
            transform: [
                { translateX: x },
                { translateY: y },
                { scale }
            ],
            opacity,
            width: data.size,
            height: data.size,
            borderRadius: data.size / 2,
        };
    });

    return (
        <Animated.View
            style={[style, { position: 'absolute', backgroundColor: '#e0e7ff', shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4 }]}
        />
    );
};
