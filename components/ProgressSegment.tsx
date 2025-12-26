import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface ProgressSegmentProps {
    index: number;
    currentStep: number;
}

export function ProgressSegment({ index, currentStep }: ProgressSegmentProps) {
    const width = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (index < currentStep) {
            width.value = withTiming(100, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        } else if (index === currentStep) {
            width.value = withTiming(100, { duration: 4000 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            width.value = 0;
            opacity.value = 0;
        }
    }, [currentStep, index]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
        opacity: opacity.value,
    }));

    return (
        <View className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
            <Animated.View style={animatedStyle} className="h-full bg-white rounded-full" />
        </View>
    );
}
