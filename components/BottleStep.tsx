import React, { useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Button } from './Button';
import { HeartHandshake } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BottleStepProps {
  onNext: () => void;
}

const { width } = Dimensions.get('window');

export const BottleStep: React.FC<BottleStepProps> = ({ onNext }) => {
  return (
    <View className="flex-1 items-center justify-center bg-[#09090b] overflow-hidden">
      
      {/* Background Ocean Effect */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
            colors={['transparent', 'rgba(30, 58, 138, 0.2)']}
            style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%' }}
        />
        {/* Animated Waves */}
        {[...Array(3)].map((_, i) => (
             <MotiView
                key={i}
                from={{ rotate: i % 2 === 0 ? '-5deg' : '5deg', translateY: 0 }}
                animate={{ rotate: i % 2 === 0 ? '5deg' : '-5deg', translateY: 20 }}
                transition={{ 
                    loop: true,
                    type: 'timing',
                    duration: 4000 + i * 1000,
                    repeatReverse: true,
                }}
                style={{ 
                    position: 'absolute',
                    left: '-50%',
                    bottom: -100 + (i * 40),
                    width: '200%',
                    height: 400,
                    borderTopWidth: 1,
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderRadius: width, // large border radius for curve
                }}
             />
        ))}
      </View>

      {/* The Bottle */}
      <MotiView
        from={{ translateY: 20, opacity: 0, rotate: '-10deg' }}
        animate={{ translateY: 0, opacity: 1, rotate: '10deg' }}
        transition={{ 
            type: 'timing',
            duration: 4000,
            loop: true,
            repeatReverse: true,
        }}
        className="z-10 w-32 h-64 border border-white/20 bg-white/5 rounded-full items-center justify-center mb-12 shadow-lg"
        style={{
             borderTopLeftRadius: 16, 
             borderTopRightRadius: 16,
             backdropFilter: 'blur(4px)' // Note: RN doesn't support backdropFilter directly without Skia, but keeping prop for web compatibility or just ignoring
        }}
      >
        <View className="absolute top-[-10px] w-12 h-8 bg-white/10 border border-white/20 rounded-sm" />
        
        {/* Paper Scroll inside */}
        <MotiView 
            from={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 500, type: 'timing', duration: 1000 }}
            className="w-20 h-32 bg-[#f4f4f5] opacity-80 rounded-sm"
            style={{ originY: 100 }} // Origin bottom equivalent
        >
             <View className="w-full h-full p-2 gap-2">
                <View className="w-full h-1 bg-black/10 rounded-full" />
                <View className="w-3/4 h-1 bg-black/10 rounded-full" />
                <View className="w-full h-1 bg-black/10 rounded-full" />
                <View className="w-1/2 h-1 bg-black/10 rounded-full" />
             </View>
        </MotiView>
      </MotiView>

      {/* Text Content */}
      <View className="z-10 items-center px-8 max-w-sm">
        <MotiView 
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800, type: 'timing' }}
            className="flex-row items-center gap-2 mb-4"
        >
            <HeartHandshake size={20} color="#93c5fd" />
            <Text className="text-blue-300 text-sm font-medium tracking-widest uppercase">Shared Humanity</Text>
        </MotiView>

        <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1000, type: 'timing' }}
        >
            <Text className="text-3xl text-white font-serif italic mb-4 text-center">
                You are not alone.
            </Text>
        </MotiView>
        
        <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1200, type: 'timing' }}
        >
            <Text className="text-zinc-400 font-light leading-relaxed text-center">
                Your thoughts drift anonymously to kind strangers. 
            </Text>
            <Text className="text-zinc-400 font-light leading-relaxed text-center">
                Receive support without judgment.
            </Text>
        </MotiView>
      </View>

      <Button onPress={onNext} variant="glass">Connect to the Ocean</Button>
    </View>
  );
};
