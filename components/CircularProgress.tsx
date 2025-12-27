import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    useDerivedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    progress: number; // 0-100
    gradientColors?: [string, string];
    trackColor?: string;
    children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size,
    strokeWidth,
    progress,
    gradientColors = ['#6366f1', '#a855f7'],
    trackColor = '#333',
    children,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Animate progress changes
    const animatedProgress = useDerivedValue(() => {
        return withTiming(progress, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg
                width={size}
                height={size}
                style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
            >
                <Defs>
                    <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={gradientColors[0]} />
                        <Stop offset="100%" stopColor={gradientColors[1]} />
                    </LinearGradient>
                </Defs>

                {/* Track */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>

            {/* Content (level number, etc) */}
            {children}
        </View>
    );
};
