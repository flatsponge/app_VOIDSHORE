import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { BlurView } from 'expo-blur';
import { Button } from './Button';
import { Check, Star, Shield, Zap, Infinity as InfinityIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaywallStepProps {
    onNext: () => void;
}

export const PaywallStep: React.FC<PaywallStepProps> = ({ onNext }) => {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-[#09090b] relative">

            {/* Background Ambience */}
            <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
            <View className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

            <ScrollView contentContainerStyle={{ paddingBottom: 150, paddingTop: insets.top + 40, paddingHorizontal: 24 }}>
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="items-center mb-8"
                >
                    <View className="py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                        <Text className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                            Early Access Offer
                        </Text>
                    </View>
                    <Text className="text-4xl font-serif text-white mb-2 text-center">Unlock Your Peace</Text>
                    <Text className="text-zinc-400 text-sm text-center">Join 10,000+ others finding clarity today.</Text>
                </MotiView>

                {/* Plan Card */}
                <MotiView
                    from={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 200, type: 'timing' }}
                    className="bg-[#1c1c1f] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-6"
                >
                    {/* Gradient Border Top using absolute view or LinearGradient */}
                    <LinearGradient
                        colors={['transparent', '#6366f1', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, opacity: 0.5 }}
                    />

                    <View className="flex-row justify-between items-end mb-6">
                        <View>
                            <Text className="text-white font-medium text-lg">Void Shore Premium</Text>
                            <View className="flex-row items-center gap-1 mt-1">
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <Text className="text-zinc-500 ml-1 text-xs">(4.9/5)</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-2xl font-bold text-white">$4.99</Text>
                            <Text className="text-zinc-500 text-xs">/ month</Text>
                        </View>
                    </View>

                    <View className="gap-4">
                        <BenefitRow icon={InfinityIcon} text="Unlimited Drifts per day" />
                        <BenefitRow icon={Shield} text="Guaranteed Anonymity" />
                        <BenefitRow icon={Zap} text="Priority Support from Community" />
                        <BenefitRow icon={Check} text="Advanced Mood Analytics" />
                    </View>

                    <View className="mt-6 pt-4 border-t border-white/5 items-center">
                        <Text className="text-xs text-zinc-500 text-center">
                            7-day free trial, then $4.99/mo. Cancel anytime.
                        </Text>
                    </View>
                </MotiView>

                {/* Social Proof */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 400, type: 'timing' }}
                    className="bg-[#121214] rounded-2xl p-4 border border-white/5"
                >
                    <Text className="text-zinc-300 text-sm italic mb-3">"I've tried every journaling app. Void Shore is the only one that actually makes me feel lighter. It's therapy in my pocket."</Text>
                    <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 bg-zinc-700 rounded-full items-center justify-center">
                            <Text className="text-xs text-white font-bold">JD</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-white font-medium">Sarah J.</Text>
                            <Text className="text-[10px] text-zinc-500">Member since 2023</Text>
                        </View>
                    </View>
                </MotiView>
            </ScrollView>

            {/* Fixed Bottom Button Area */}
            <BlurView
                intensity={20}
                tint="dark"
                className="absolute bottom-0 left-0 right-0 px-6 pt-4 border-t border-white/10"
                style={{ paddingBottom: insets.bottom + 20 }}
            >
                <Button onPress={onNext} className="mb-2">
                    Start Free Trial
                </Button>
                <Text className="text-[10px] text-center text-zinc-600 mt-2">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
            </BlurView>
        </View>
    );
};

const BenefitRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <View className="flex-row items-center gap-3">
        <View className="w-6 h-6 rounded-full bg-indigo-500/20 items-center justify-center">
            <Icon size={12} color="#818cf8" strokeWidth={3} />
        </View>
        <Text className="text-zinc-300 text-sm font-medium">{text}</Text>
    </View>
);
