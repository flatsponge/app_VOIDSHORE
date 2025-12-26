import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Button } from './Button';
import { Waves } from 'lucide-react-native';
import { cn } from '../utils/cn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IntroStepProps {
  onNext: () => void;
}

const { width, height } = Dimensions.get('window');

export const IntroStep: React.FC<IntroStepProps> = ({ onNext }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
        className="flex-1 items-center justify-center bg-[#09090b] relative overflow-hidden px-8"
        style={{ paddingBottom: insets.bottom }}
    >
       {/* Background gradient orb - pulsating */}
       {/* Note: Blur effect is approximated with low opacity and layering in RN if not using Skia/SVG */}
       <MotiView 
         from={{ scale: 1, opacity: 0.1 }}
         animate={{ scale: 1.2, opacity: 0.15 }}
         transition={{ 
            type: 'timing', 
            duration: 4000, 
            loop: true, 
            repeatReverse: true 
         }}
         className="absolute top-[-20%] left-[-20%] bg-blue-900 rounded-full" 
         style={{ width: width * 1.4, height: height * 0.8 }}
       />

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="relative z-10 mb-12 items-center"
      >
        <View className="relative items-center justify-center">
            <MotiView 
                from={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ 
                    type: 'timing',
                    duration: 2000, 
                    loop: true, 
                    repeatReverse: true 
                }}
                className="absolute w-full h-full bg-white/5 rounded-full"
                style={{ width: 100, height: 100 }}
            />
            <View className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/10 z-10">
                <Waves size={40} color="white" strokeWidth={1.5} />
            </View>
        </View>
      </MotiView>

      <View className="w-full relative z-10 items-center gap-8">
        <View className="items-center">
            <MotiText 
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200, type: 'timing', duration: 800 }}
                className="font-serif italic text-6xl text-white leading-tight tracking-tight text-center"
            >
                Quiet
            </MotiText>
            <MotiText 
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 300, type: 'timing', duration: 800 }}
                className="font-serif text-zinc-500 text-5xl text-center"
            >
                the Noise.
            </MotiText>
        </View>
        
        <MotiView 
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600, type: 'timing', duration: 1000 }}
            className="w-12 h-[1px] bg-white/20" 
        />
        
        <MotiView 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800, type: 'timing' }}
            className="gap-4 items-center"
        >
            <Text className="text-zinc-300 text-lg leading-relaxed font-light text-center">
                Your mind is constantly running.
            </Text>
            <Text className="text-zinc-300 text-lg leading-relaxed font-light text-center">
                It's time to let it rest.
            </Text>
        </MotiView>
      </View>
      
      <Button onPress={onNext} delay={1.2} variant="glass">Begin Journey</Button>
    </View>
  );
};
