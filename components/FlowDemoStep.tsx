import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { FlowEditor } from './FlowEditor';
import { Button } from './Button';
import { Brain, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FlowDemoStepProps {
    onNext: () => void;
}

const { width } = Dimensions.get('window');

export const FlowDemoStep: React.FC<FlowDemoStepProps> = ({ onNext }) => {
    const [hasDrifted, setHasDrifted] = useState(false);

    const handleDemoSend = () => {
        setHasDrifted(true);
    };

    return (
        <View className="flex-1 bg-[#09090b] pt-12">
            <View className="px-6 mb-4 items-center z-20">
                <>
                    {!hasDrifted ? (
                        <MotiView
                            key="intro"
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: -10 }}
                            className="items-center"
                        >
                            <MotiView
                                from={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-12 h-12 bg-indigo-500/10 rounded-full items-center justify-center mb-4"
                            >
                                <Brain size={24} color="#818cf8" />
                            </MotiView>
                            <Text className="text-white text-2xl font-serif italic mb-2 text-center">
                                The Weight of Thought
                            </Text>
                            <Text className="text-zinc-400 text-sm leading-relaxed text-center max-w-xs">
                                Psychology shows that unexpressed thoughts create mental tension.
                            </Text>
                            <Text className="text-white text-sm font-medium text-center mt-1">
                                Releasing them is the cure.
                            </Text>
                        </MotiView>
                    ) : (
                        <MotiView
                            key="outro"
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="items-center"
                        >
                            <MotiView
                                from={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                                className="w-16 h-16 bg-green-500/10 rounded-full items-center justify-center mb-4"
                            >
                                <CheckCircle2 size={32} color="#4ade80" />
                            </MotiView>
                            <Text className="text-white text-2xl font-serif italic mb-2 text-center">
                                Felt that?
                            </Text>
                            <Text className="text-zinc-300 text-sm leading-relaxed text-center max-w-xs">
                                That moment of release is what Drift provides every single day.
                                Clear your mind, improve your sleep.
                            </Text>
                        </MotiView>
                    )}
                </>
            </View>

            {/* The interactive demo */}
            <View className="flex-1 w-full relative">
                {!hasDrifted ? (
                    <FlowEditor
                        isDemo={true}
                        placeholder="Write one thing stressing you out..."
                        onSend={handleDemoSend}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <View className="w-full max-w-xs bg-[#121214] border border-white/10 rounded-2xl p-6 mx-6">
                            <View className="flex-row justify-between items-center mb-4 border-b border-white/5 pb-4">
                                <Text className="text-zinc-500 text-xs uppercase tracking-widest">Scientific Benefit</Text>
                            </View>
                            <View className="gap-3">
                                <View className="flex-row gap-3 items-center">
                                    <Text className="text-green-400 font-bold">✓</Text>
                                    <Text className="text-zinc-300 text-sm">Reduces Cortisol levels</Text>
                                </View>
                                <View className="flex-row gap-3 items-center">
                                    <Text className="text-green-400 font-bold">✓</Text>
                                    <Text className="text-zinc-300 text-sm">Improves emotional regulation</Text>
                                </View>
                                <View className="flex-row gap-3 items-center">
                                    <Text className="text-green-400 font-bold">✓</Text>
                                    <Text className="text-zinc-300 text-sm">Creates mental space</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Overlay gradient at bottom - using expo-linear-gradient */}
                <LinearGradient
                    colors={['transparent', '#09090b']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 128, pointerEvents: 'none' }}
                />
            </View>

            <Button onPress={onNext} variant={hasDrifted ? "primary" : "glass"} delay={hasDrifted ? 0 : 2}>
                {hasDrifted ? "I need this" : "Experience Release"}
            </Button>
        </View>
    );
};
