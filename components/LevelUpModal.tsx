import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LevelUpModalProps {
    level: number;
    title: string;
    onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Confetti Particle Component
const ConfettiParticle: React.FC<{ index: number }> = ({ index }) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    const isLeft = index % 2 === 0;
    const delay = Math.random() * 1000;
    const duration = 2000 + Math.random() * 1000;
    const xDistance = (isLeft ? -1 : 1) * (30 + Math.random() * 70);
    const yDistance = -(50 + Math.random() * 100);

    useEffect(() => {
        // Start animation loop
        const startAnimation = () => {
            translateY.value = 0;
            translateX.value = 0;
            opacity.value = 0;
            scale.value = 0.5;

            translateY.value = withDelay(
                delay,
                withRepeat(
                    withTiming(yDistance, { duration, easing: Easing.out(Easing.quad) }),
                    -1,
                    false
                )
            );
            translateX.value = withDelay(
                delay,
                withRepeat(
                    withTiming(xDistance, { duration, easing: Easing.out(Easing.quad) }),
                    -1,
                    false
                )
            );
            opacity.value = withDelay(
                delay,
                withRepeat(
                    withSequence(
                        withTiming(1, { duration: duration * 0.3 }),
                        withTiming(0, { duration: duration * 0.7 })
                    ),
                    -1,
                    false
                )
            );
            scale.value = withDelay(
                delay,
                withRepeat(
                    withSequence(
                        withTiming(1, { duration: duration * 0.3 }),
                        withTiming(0.3, { duration: duration * 0.7 })
                    ),
                    -1,
                    false
                )
            );
        };
        startAnimation();
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
    const color = colors[index % colors.length];

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: color,
                    top: '50%',
                    left: '50%',
                },
                animatedStyle,
            ]}
        />
    );
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {
    const badgeScale = useSharedValue(0);
    const badgeRotation = useSharedValue(-180);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        // Animate badge entrance
        badgeScale.value = withSpring(1, { damping: 12, stiffness: 100 });
        badgeRotation.value = withSpring(0, { damping: 15, stiffness: 80 });

        // Fade in content
        contentOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    }, []);

    const badgeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: badgeScale.value },
            { rotate: `${badgeRotation.value}deg` },
        ],
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    return (
        <Modal transparent animationType="fade" visible>
            <View className="flex-1 items-center justify-center px-6">
                {/* Backdrop */}
                <Pressable
                    className="absolute inset-0 bg-black/80"
                    onPress={onClose}
                />

                {/* Modal Content */}
                <View className="relative w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl p-8 items-center overflow-hidden">
                    {/* Background Glow */}
                    <View
                        className="absolute -top-16 left-1/2 w-32 h-32 rounded-full"
                        style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.3)',
                            transform: [{ translateX: -64 }],
                        }}
                    />
                    <View
                        className="absolute -top-8 left-1/2 w-48 h-48 rounded-full opacity-20"
                        style={{
                            backgroundColor: 'rgba(168, 85, 247, 0.3)',
                            transform: [{ translateX: -96 }],
                        }}
                    />

                    {/* Confetti Particles */}
                    {[...Array(8)].map((_, i) => (
                        <ConfettiParticle key={i} index={i} />
                    ))}

                    {/* Animated Badge */}
                    <Animated.View style={badgeAnimatedStyle} className="relative mb-6">
                        <LinearGradient
                            colors={['#6366f1', '#a855f7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-20 h-20 rounded-2xl items-center justify-center"
                            style={{ shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 }}
                        >
                            <Crown size={32} color="white" fill="white" />
                        </LinearGradient>

                        {/* Level Badge */}
                        <View className="absolute -bottom-2 -right-2 bg-white w-7 h-7 rounded-full items-center justify-center border-2 border-[#121214]">
                            <Text className="text-black text-xs font-bold">{level}</Text>
                        </View>
                    </Animated.View>

                    {/* Content */}
                    <Animated.View style={contentAnimatedStyle} className="items-center">
                        <Text className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">
                            Level Up
                        </Text>
                        <Text className="text-3xl font-serif text-white text-center mb-1">
                            You are now a
                        </Text>
                        <Text className="text-3xl font-serif text-indigo-400 italic text-center mb-4">
                            {title}
                        </Text>

                        <Text className="text-zinc-500 text-sm leading-relaxed text-center mb-8">
                            Your words have resonated with others. Your presence helps calm the ocean.
                        </Text>

                        <Pressable
                            onPress={onClose}
                            className="w-full py-4 bg-white rounded-xl items-center active:scale-[0.98]"
                            style={{ shadowColor: '#fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }}
                        >
                            <Text className="font-bold text-black">Continue Journey</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};
