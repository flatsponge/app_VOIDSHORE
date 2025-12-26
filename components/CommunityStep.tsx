import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Button } from './Button';
import { Heart, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CommunityStepProps {
    onNext: () => void;
}

const { width } = Dimensions.get('window');

export const CommunityStep: React.FC<CommunityStepProps> = ({ onNext }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 items-center justify-center bg-[#09090b] px-6 relative overflow-hidden"
            style={{ paddingTop: insets.top + 24 }}
        >

            <View className="items-center z-10 mb-12 max-w-sm">
                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="text-3xl font-serif text-white mb-4 text-center"
                >
                    You are not alone.
                </MotiText>
                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 200, type: 'timing' }}
                    className="text-gray-400 font-light text-center"
                >
                    Receive anonymous support from strangers who listen without judgment.
                </MotiText>
            </View>

            <View className="relative w-full h-72 items-center justify-center">
                {/* Center: YOU */}
                <MotiView
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 400, type: 'spring' }}
                    className="relative z-20 items-center"
                >
                    <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg">
                        <User size={32} color="black" />
                    </View>
                    <Text className="absolute -bottom-8 text-xs font-bold uppercase tracking-widest text-white/50">You</Text>
                </MotiView>

                {/* Orbiting Strangers */}
                {[...Array(5)].map((_, index) => {
                    const angle = (index / 5) * 2 * Math.PI;
                    const radius = 100;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <MotiView
                            key={index}
                            from={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 600 + index * 100, type: 'spring' }}
                            style={{
                                position: 'absolute',
                                transform: [{ translateX: x }, { translateY: y }]
                            }}
                        >
                            {/* Connection Line - using a rotated view */}
                            <MotiView
                                from={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 0.2, width: radius }}
                                transition={{ delay: 1000 + index * 100, type: 'timing', duration: 1000 }}
                                style={{
                                    position: 'absolute',
                                    height: 1,
                                    backgroundColor: '#6366f1', // indigo-500
                                    top: 20, // center of the circle (40/2)
                                    left: 20, // center of the circle (40/2)
                                    transformOrigin: 'left',
                                    transform: [
                                        { rotate: `${angle + Math.PI}rad` }, // Rotate to point inwards
                                        { translateX: 0 } // Pivot from left
                                    ],
                                    zIndex: -1
                                }}
                            />

                            <View className="w-10 h-10 bg-indigo-900/40 border border-indigo-500/30 rounded-full items-center justify-center">
                                <Heart size={14} color="#a5b4fc" fill="rgba(165, 180, 252, 0.5)" />
                            </View>
                        </MotiView>
                    );
                })}

                {/* Pulsing rings */}
                <View className="absolute inset-0 items-center justify-center pointer-events-none">
                    <MotiView
                        from={{ scale: 1, opacity: 0.1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 4000, loop: true, type: 'timing' }}
                        className="w-40 h-40 border border-white/10 rounded-full absolute"
                    />
                    <MotiView
                        from={{ scale: 1.2, opacity: 0.05 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 4000, delay: 1000, loop: true, type: 'timing' }}
                        className="w-40 h-40 border border-white/5 rounded-full absolute"
                    />
                </View>
            </View>

            <Button onPress={onNext} variant="glass">Enter The Shore</Button>
        </View>
    );
};
