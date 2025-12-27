import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IntroStep } from './components/IntroStep';
import { FlowDemoStep } from './components/FlowDemoStep';
import { BottleStep } from './components/BottleStep';
import { PassportStep } from './components/PassportStep';
import { TopicsStep } from './components/TopicsStep';
import { TideTimeStep } from './components/TideTimeStep';
import { CommunityStep } from './components/CommunityStep';
import { PaywallStep } from './components/PaywallStep';
import { MainApp } from './components/MainApp';
import { AnimatedStep } from './components/AnimatedStep';
import { ProgressSegment } from './components/ProgressSegment';
import { PerspectiveStep } from './components/PerspectiveStep';
import { ReceiveStep } from './components/ReceiveStep';
import './global.css';

export default function App() {
    return (
        <SafeAreaProvider>
            <AppContent />
        </SafeAreaProvider>
    );
}

function AppContent() {
    const [step, setStep] = useState(0);
    const insets = useSafeAreaInsets();

    const nextStep = () => setStep(prev => prev + 1);

    // Define steps
    const stepsContent = [
        { key: 'intro', component: <IntroStep onNext={nextStep} /> },
        { key: 'demo', component: <FlowDemoStep onNext={nextStep} /> },
        { key: 'community', component: <CommunityStep onNext={nextStep} /> },
        { key: 'perspective', component: <PerspectiveStep onNext={nextStep} /> },
        { key: 'bottle', component: <BottleStep onNext={nextStep} /> },
        { key: 'receive', component: <ReceiveStep onNext={nextStep} /> },
        { key: 'passport', component: <PassportStep onNext={nextStep} /> },
        { key: 'topics', component: <TopicsStep onNext={nextStep} /> },
        // TideTimeStep removed from linear flow or moved? Plan didn't specify deletion, but mentioned 9 steps.
        // Let's keep TideTimeStep if it was there, or remove if the plan implies replacement. 
        // The plan listed: Intro, FlowDemo, Community, Perspective, Bottle, Receive, Passport, Topics, Paywall.
        // TideTimeStep was in the original list. I'll keep it before community or maybe after topics? 
        // Actually, let's follow the user's plan strictly: 
        // 1. Intro 2. FlowDemo 3. Community (Moved up) 4. Perspective (New) 5. Bottle 6. Receive (New) 7. Passport 8. Topics 9. Paywall
        // I will remove TideTimeStep from the main flow if it wasn't requested, OR put it before paywall?
        // The user said "expand the pages... more onboarding steps".
        // Use judgment: TideTimeStep sets the notification time. It is useful. I'll put it after Topics.
        { key: 'tide', component: <TideTimeStep onNext={nextStep} /> },
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
                <View
                    className="absolute left-6 right-6 flex-row gap-2 z-50"
                    pointerEvents="none"
                    style={{ top: insets.top + 8 }}
                >
                    {stepsContent.slice(0, stepsContent.length - 1).map((_, i) => (
                        <ProgressSegment key={i} index={i} currentStep={step} />
                    ))}
                </View>
            )}
        </View>
    );
}
