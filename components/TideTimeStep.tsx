import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Button } from './Button';
import { Waves } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TideTimeStepProps {
    onNext: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const ITEM_HEIGHT = 64;

export const TideTimeStep: React.FC<TideTimeStepProps> = ({ onNext }) => {
    const [selectedHour, setSelectedHour] = useState('09');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 bg-black px-6 relative"
            style={{ paddingTop: insets.top + 24 }}
        >
            <View className="items-center mb-10 z-10">
                <Text className="text-3xl font-bold text-white mb-3">
                    The Daily Tide 🌊
                </Text>
                <Text className="text-gray-400 text-sm leading-relaxed text-center px-4">
                    Choose a time for the tide to bring new bottles to your shore.
                </Text>
            </View>

            {/* Ocean BG - Approximate gradient */}
            <View className="absolute top-0 left-0 right-0 h-1/2 bg-blue-900 opacity-10 pointer-events-none" />

            {/* Main Card Container */}
            <View className="border border-white/10 rounded-[40px] p-2 bg-black relative shadow-2xl mx-1 z-10">

                {/* Top Section: Picker */}
                <View className="relative h-48 flex-row justify-center items-center overflow-hidden rounded-[32px] bg-[#050505] mb-2">

                    {/* Dark Highlight Bar */}
                    <View className="absolute w-full h-16 bg-[#121214] border-y border-white/5 z-0 top-1/2 transform -translate-y-1/2 rounded-xl pointer-events-none" style={{ marginTop: -32 }} />

                    <View className="flex-row gap-4 z-10 h-full items-center">
                        {/* Hours */}
                        <ScrollColumn
                            items={HOURS}
                            value={selectedHour}
                            onChange={setSelectedHour}
                            initialScrollIndex={HOURS.indexOf('09')}
                        />

                        <Text className="text-white text-4xl font-semibold pb-2 opacity-50">:</Text>

                        {/* Minutes */}
                        <ScrollColumn
                            items={MINUTES}
                            value={selectedMinute}
                            onChange={setSelectedMinute}
                            initialScrollIndex={MINUTES.indexOf('00')}
                        />
                    </View>
                </View>

                {/* Bottom Section: Notification Preview */}
                <View className="px-4 pb-6">
                    <View className="bg-[#1C1C1E] rounded-2xl p-4 flex-row items-center gap-3 border border-white/5 relative overflow-hidden shadow-lg">
                        {/* App Icon Mockup */}
                        <View className="w-10 h-10 bg-[#09090b] rounded-lg items-center justify-center border border-white/10">
                            <Waves size={18} color="white" />
                        </View>

                        {/* Text Content */}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-baseline mb-0.5">
                                <Text className="font-semibold text-white text-[15px]">
                                    Drift
                                </Text>
                                <Text className="text-[12px] text-gray-500">now</Text>
                            </View>
                            <Text className="text-white/80 text-[13px] leading-tight" numberOfLines={1}>
                                High tide. A bottle has washed ashore.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <Button
                onPress={onNext}
                secondaryAction={
                    <Text
                        onPress={onNext}
                        className="text-zinc-500 text-sm py-2 text-center mt-2"
                    >
                        I prefer not to say
                    </Text>
                }
            >
                Set Tide Time
            </Button>
        </View>
    );
};

// --- Scroll Column Component ---
interface ScrollColumnProps {
    items: string[];
    value: string;
    onChange: (val: string) => void;
    initialScrollIndex?: number;
}

const ScrollColumn: React.FC<ScrollColumnProps> = ({ items, value, onChange, initialScrollIndex = 0 }) => {

    // Add empty items for padding start/end
    const data = ['', ...items, ''];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        // data index is shifted by 1 due to padding
        const item = items[index];
        if (item && item !== value) {
            onChange(item);
        }
    };

    return (
        <View style={{ height: ITEM_HEIGHT * 3, width: 80 }}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const isSelected = item === value;
                    if (item === '') return <View style={{ height: ITEM_HEIGHT }} />;

                    return (
                        <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                className={`font-serif italic transition-all ${isSelected ? 'text-white text-5xl opacity-100' : 'text-zinc-700 text-4xl opacity-30'}`}
                            >
                                {item}
                            </Text>
                        </View>
                    );
                }}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                initialScrollIndex={initialScrollIndex}
                getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
            />
        </View>
    );
};
