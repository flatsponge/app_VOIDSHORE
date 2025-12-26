import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { IntroStep } from './components/IntroStep';
import { FlowDemoStep } from './components/FlowDemoStep';
import { BottleStep } from './components/BottleStep';
import { PassportStep } from './components/PassportStep';
import { TopicsStep } from './components/TopicsStep';
import { TideTimeStep } from './components/TideTimeStep';
import { CommunityStep } from './components/CommunityStep';
import { PaywallStep } from './components/PaywallStep';
import { MainApp } from './components/MainApp';
import './global.css';

const { height } = Dimensions.get('window');

// Animated step wrapper component
function AnimatedStep({
    children,
    isActive,
    isMounted
}: {
    children: React.ReactNode;
    isActive: boolean;
    isMounted: boolean;
}) {
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

// Progress bar segment component
function ProgressSegment({ index, currentStep }: { index: number; currentStep: number }) {
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

export default function App() {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(prev => prev + 1);

    // Define steps
    const stepsContent = [
        { key: 'intro', component: <IntroStep onNext={nextStep} /> },
        { key: 'demo', component: <FlowDemoStep onNext={nextStep} /> },
        { key: 'bottle', component: <BottleStep onNext={nextStep} /> },
        { key: 'passport', component: <PassportStep onNext={nextStep} /> },
        { key: 'topics', component: <TopicsStep onNext={nextStep} /> },
        { key: 'tide', component: <TideTimeStep onNext={nextStep} /> },
        { key: 'community', component: <CommunityStep onNext={nextStep} /> },
        { key: 'paywall', component: <PaywallStep onNext={nextStep} /> },
        { key: 'main', component: <MainApp /> }
    ];

    return (
        <View className="flex-1 bg-[#09090b]">
            <StatusBar style="light" />

            {/* Container for Steps */}
            <View style={StyleSheet.absoluteFill}>
                {stepsContent.map((item, index) => {
                    // Only render current and previous step for transitions
                    const isMounted = index <= step && step - index <= 1;
                    const isActive = step === index;

                    return (
                        <AnimatedStep
                            key={item.key}
                            isActive={isActive}
                            isMounted={isMounted}
                        >
                            {item.component}
                        </AnimatedStep>
                    );
                })}
            </View>

            {/* Progress Bar - Only show for onboarding steps */}
            {step < stepsContent.length - 1 && (
                <View className="absolute top-12 left-6 right-6 flex-row gap-2 z-50" pointerEvents="none">
                    {stepsContent.slice(0, stepsContent.length - 1).map((_, i) => (
                        <ProgressSegment key={i} index={i} currentStep={step} />
                    ))}
                </View>
            )}
        </View>
    );
}
