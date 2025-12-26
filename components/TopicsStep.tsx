import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, DimensionValue } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Button } from './Button';
import { 
  CloudRain, Heart, Sparkles, Brain, 
  Coffee, Moon, Sun, BookOpen 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopicsStepProps {
  onNext: () => void;
}

const topics = [
  { id: 'anxiety', label: 'Anxiety', Icon: CloudRain, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.2)' },
  { id: 'love', label: 'Love', Icon: Heart, color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)', border: 'rgba(244, 114, 182, 0.2)' },
  { id: 'dreams', label: 'Dreams', Icon: Sparkles, color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)', border: 'rgba(192, 132, 252, 0.2)' },
  { id: 'vent', label: 'Vent', Icon: Brain, color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.2)' },
  { id: 'hope', label: 'Hope', Icon: Sun, color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.2)' },
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.2)' },
  { id: 'sleep', label: 'Sleep', Icon: Moon, color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)', border: 'rgba(129, 140, 248, 0.2)' },
  { id: 'life', label: 'Life', Icon: BookOpen, color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)' },
];

// Optimized positions to prevent overlap
const positions: { top: DimensionValue; left: DimensionValue }[] = [
    { top: '20%', left: '15%' },
    { top: '20%', left: '65%' },
    { top: '35%', left: '10%' },
    { top: '35%', left: '70%' },
    { top: '50%', left: '40%' }, // Center item
    { top: '60%', left: '20%' },
    { top: '60%', left: '75%' },
    { top: '75%', left: '40%' },
];

const { width } = Dimensions.get('window');

export const TopicsStep: React.FC<TopicsStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const MIN_SELECTION = 3;
  const isComplete = selected.length >= MIN_SELECTION;
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black relative overflow-hidden">
      <View
        className="px-6 z-20 items-center pointer-events-none"
        style={{ paddingTop: insets.top + 20 }}
      >
        <MotiText 
             from={{ opacity: 0, translateY: -10 }}
             animate={{ opacity: 1, translateY: 0 }}
             className="text-2xl font-bold text-white mb-2"
        >
            What's on your mind?
        </MotiText>
        <MotiText 
             from={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 200, type: 'timing' }}
             className="text-gray-400 text-sm text-center"
        >
            Select topics to guide the bottles you find.
        </MotiText>
        
        {/* Selection Counter */}
        <MotiView 
            className="mt-6 flex-row items-center gap-2 px-4 py-1.5 rounded-full border border-white/5"
            animate={{ 
                borderColor: isComplete ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isComplete ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }}
        >
            <Text className={`text-xs font-bold ${isComplete ? 'text-green-400' : 'text-zinc-500'}`}>
                {selected.length} / {MIN_SELECTION} Selected
            </Text>
        </MotiView>
      </View>

      <View className="flex-1 relative mt-4">
        {topics.map((topic, index) => {
            const isSelected = selected.includes(topic.id);
            const pos = positions[index] || { top: '50%', left: '50%' };
            
            return (
                <MotiView
                    key={topic.id}
                    from={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: 1, 
                        scale: isSelected ? 1.1 : 1,
                        translateY: isSelected ? -5 : 0 
                    }}
                    transition={{ 
                        type: 'spring',
                        delay: index * 50,
                    }}
                    style={{ 
                        position: 'absolute',
                        top: pos.top, 
                        left: pos.left, 
                        zIndex: isSelected ? 10 : 0
                    }}
                >
                    <Pressable
                        onPress={() => toggleTopic(topic.id)}
                        className={`flex-row items-center gap-2 px-4 py-3 rounded-full transition-all ${isSelected ? 'border-2' : 'border border-white/5 bg-[#1a1a1a]/80'}`}
                        style={{
                            backgroundColor: isSelected ? topic.bg : undefined,
                            borderColor: isSelected ? topic.color : 'rgba(255,255,255,0.05)',
                        }}
                    >
                         <topic.Icon size={16} color={isSelected ? topic.color : '#6b7280'} />
                         <Text className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                             {topic.label}
                         </Text>
                    </Pressable>
                </MotiView>
            );
        })}
        
        {/* Background Particles - simplified for RN */}
        {[...Array(10)].map((_, i) => (
             <MotiView 
                key={i}
                from={{ opacity: 0.1, scale: 0.5 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ loop: true, type: 'timing', duration: 2000 + Math.random() * 2000, repeatReverse: true }}
                className="absolute bg-white/10 rounded-full"
                style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                }}
             />
        ))}
      </View>

      <Button 
        onPress={onNext} 
        disabled={!isComplete} 
        className={!isComplete ? "opacity-50" : ""}
      >
        Continue
      </Button>
    </View>
  );
};
