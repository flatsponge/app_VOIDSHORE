import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { Button } from './Button';
import { Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface ReceiveStepProps {
    onNext: () => void;
}

export const ReceiveStep: React.FC<ReceiveStepProps> = ({ onNext }) => {
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (!isOpen) setIsOpen(true);
    };

    return (
        <View
            className="flex-1 items-center justify-center bg-[#09090b] relative overflow-hidden"
            style={{ paddingBottom: insets.bottom + 20, paddingTop: insets.top + 40 }}
        >
            {/* Deep Space Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#0a0a0f', '#09090b']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            {/* Main Center Stage */}
            <View className="flex-1 items-center justify-center w-full z-20 px-6">
                <Pressable onPress={handleOpen} style={{ alignItems: 'center', width: '100%' }}>
                    <AnimatePresence>
                        {!isOpen ? (
                            /* === CLOSED STATE: The Cosmic Orb === */
                            <MotiView
                                key="orb"
                                from={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 2 }} // Flash out
                                transition={{ type: 'timing', duration: 800 }}
                                className="items-center justify-center"
                            >
                                {/* Outer Ring 3 */}
                                <MotiView
                                    from={{ scale: 1, opacity: 0.1 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ type: 'timing', duration: 3000, loop: true, repeatReverse: false }}
                                    className="absolute w-48 h-48 bg-indigo-500/20 rounded-full"
                                />
                                {/* Outer Ring 2 */}
                                <MotiView
                                    from={{ scale: 1, opacity: 0.2 }}
                                    animate={{ scale: 1.3, opacity: 0 }}
                                    transition={{ type: 'timing', duration: 3000, loop: true, delay: 1000, repeatReverse: false }}
                                    className="absolute w-40 h-40 bg-indigo-400/20 rounded-full"
                                />

                                {/* Core Glow */}
                                <View className="w-32 h-32 bg-indigo-500/10 rounded-full items-center justify-center border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.3)] backdrop-blur-md">
                                    {/* Inner Light */}
                                    <MotiView
                                        from={{ scale: 0.8, opacity: 0.6 }}
                                        animate={{ scale: 1.1, opacity: 1 }}
                                        transition={{ type: 'timing', duration: 2000, loop: true, repeatReverse: true }}
                                        className="w-16 h-16 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                                    />
                                </View>

                                {/* Instruction Text */}
                                <MotiText
                                    from={{ opacity: 0.4 }}
                                    animate={{ opacity: 0.8 }}
                                    transition={{ type: 'timing', duration: 2000, loop: true, repeatReverse: true }}
                                    className="text-indigo-200/50 text-xs font-medium tracking-[4px] uppercase mt-12 text-center"
                                >
                                    Tap the Light
                                </MotiText>
                            </MotiView>
                        ) : (
                            /* === OPENED STATE: Message Card === */
                            <MotiView
                                key="message"
                                from={{ opacity: 0, scale: 0.95, translateY: 30 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                transition={{ type: 'timing', duration: 600 }}
                                className="w-full items-center"
                            >
                                {/* Subtle glow backdrop */}
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 0.15 }}
                                    transition={{ type: 'timing', duration: 1500 }}
                                    className="absolute -z-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-[80px]"
                                />

                                {/* Message Card */}
                                <View className="w-full max-w-sm bg-[#111114] border border-white/5 rounded-3xl p-8 items-center shadow-2xl">

                                    {/* Icon */}
                                    <View className="mb-6">
                                        <Sparkles size={28} color="#a5b4fc" />
                                    </View>

                                    {/* Quote */}
                                    <Text className="font-serif italic text-2xl text-white text-center leading-relaxed mb-8">
                                        "Your quiet strength is louder than you know."
                                    </Text>

                                    {/* Footer */}
                                    <View className="flex-row items-center gap-2 border-t border-white/5 pt-6 w-full justify-center">
                                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        <Text className="text-zinc-500 text-[10px] uppercase tracking-widest font-medium">
                                            Received from London
                                        </Text>
                                    </View>
                                </View>
                            </MotiView>
                        )}
                    </AnimatePresence>
                </Pressable>
            </View>

            {/* Text Content */}
            <View className="w-full relative z-10 items-center gap-4 px-6 mb-24">
                <AnimatePresence>
                    {!isOpen ? (
                        <MotiView
                            key="intro-text"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="items-center"
                        >
                            <Text className="font-serif italic text-3xl text-white text-center mb-2">
                                A Signal Returns.
                            </Text>
                            <Text className="text-zinc-400 text-base text-center font-light">
                                Connect with the quiet wisdom of others.
                            </Text>
                        </MotiView>
                    ) : (
                        <MotiView
                            key="outro-text"
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="items-center"
                        >
                            <Text className="font-serif italic text-3xl text-white text-center mb-2">
                                Shared Light.
                            </Text>
                            <Text className="text-zinc-400 text-base text-center font-light max-w-xs">
                                You are never truly drifting alone.
                            </Text>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>

            {/* Button */}
            <Button
                onPress={isOpen ? onNext : handleOpen}
                variant={isOpen ? "primary" : "glass"}
                delay={0}
            >
                {isOpen ? "Continue" : "Receive Signal"}
            </Button>
        </View>
    );
};
