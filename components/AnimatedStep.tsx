import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface AnimatedStepProps {
    children: React.ReactNode;
    isActive: boolean;
    isMounted: boolean;
}

export function AnimatedStep({
    children,
    isActive,
    isMounted
}: AnimatedStepProps) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(height);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isMounted) {
            opacity.value = withTiming(isActive ? 1 : 0, { duration: 800, easing: Easing.out(Easing.cubic) });
            translateY.value = withTiming(isActive ? 0 : -40, { duration: 800, easing: Easing.out(Easing.cubic) });
            scale.value = withTiming(isActive ? 1 : 0.96, { duration: 800, easing: Easing.out(Easing.cubic) });
        }
    }, [isActive, isMounted]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    if (!isMounted) return null;

    return (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#09090b' }, animatedStyle]}>
            {children}
        </Animated.View>
    );
}
