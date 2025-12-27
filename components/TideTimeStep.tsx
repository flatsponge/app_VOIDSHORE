import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Waves } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    runOnJS,
    SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface TideTimeStepProps {
    onNext: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 3;

export const TideTimeStep: React.FC<TideTimeStepProps> = ({ onNext }) => {
    const [selectedHour, setSelectedHour] = React.useState('10');
    const [selectedMinute, setSelectedMinute] = React.useState('10');
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 bg-black px-6 relative"
            style={{ paddingTop: insets.top + 40 }}
        >
            {/* Ocean BG - Approximate gradient */}
            <View className="absolute top-0 left-0 right-0 h-1/2 bg-blue-900 opacity-10 pointer-events-none" />

            {/* Flex spacer to push content down and center it */}
            <View className="flex-1 justify-center">
                <View className="items-center mb-10 z-10">
                    <Text className="text-3xl font-bold text-white mb-3">
                        The Daily Tide 🌊
                    </Text>
                    <Text className="text-gray-400 text-sm leading-relaxed text-center px-4">
                        Choose a time for the tide to bring new bottles to your shore.
                    </Text>
                </View>

                {/* Main Card Container */}
                <View className="border border-white/10 rounded-[40px] p-2 bg-black relative shadow-2xl mx-1 z-10">

                    {/* Top Section: Picker */}
                    <View style={styles.pickerContainer}>
                        {/* Selection Indicator */}
                        <View style={styles.selectionIndicator} />

                        <View style={styles.pickersRow}>
                            {/* Hours */}
                            <WheelPicker
                                items={HOURS}
                                selectedValue={selectedHour}
                                onValueChange={setSelectedHour}
                            />

                            <Text style={styles.colon}>:</Text>

                            {/* Minutes */}
                            <WheelPicker
                                items={MINUTES}
                                selectedValue={selectedMinute}
                                onValueChange={setSelectedMinute}
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

// --- Apple-style Wheel Picker Component ---
interface WheelPickerProps {
    items: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

const WheelPicker: React.FC<WheelPickerProps> = ({ items, selectedValue, onValueChange }) => {
    // Calculate initial offset first so we can initialize scrollY correctly
    const initialIndex = items.indexOf(selectedValue);
    const initialOffset = initialIndex >= 0 ? initialIndex * ITEM_HEIGHT : 0;

    const scrollY = useSharedValue(initialOffset);
    const scrollRef = useRef<Animated.ScrollView>(null);
    const lastHapticIndex = useRef(-1);

    const triggerHaptic = useCallback(() => {
        Haptics.selectionAsync();
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;

            // Calculate current index for haptic feedback
            const currentIndex = Math.round(event.contentOffset.y / ITEM_HEIGHT);
            if (currentIndex !== lastHapticIndex.current && currentIndex >= 0 && currentIndex < items.length) {
                lastHapticIndex.current = currentIndex;
                runOnJS(triggerHaptic)();
            }
        },
        onMomentumEnd: (event) => {
            const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
            if (index >= 0 && index < items.length) {
                runOnJS(onValueChange)(items[index]);
            }
        },
    });

    return (
        <View style={styles.wheelContainer}>
            <Animated.ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingVertical: ITEM_HEIGHT, // One item padding top and bottom
                }}
                contentOffset={{ x: 0, y: initialOffset }}
            >
                {items.map((item, index) => (
                    <WheelItem
                        key={index}
                        item={item}
                        index={index}
                        scrollY={scrollY}
                    />
                ))}
            </Animated.ScrollView>
        </View>
    );
};

// --- Individual Wheel Item with Animations ---
interface WheelItemProps {
    item: string;
    index: number;
    scrollY: Animated.SharedValue<number>;
}

const WheelItem: React.FC<WheelItemProps> = ({ item, index, scrollY }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
        ];

        // Scale: 1.0 at center, smaller at edges
        const scale = interpolate(
            scrollY.value,
            inputRange,
            [0.6, 0.8, 1.0, 0.8, 0.6],
            Extrapolation.CLAMP
        );

        // Opacity: full at center, fades at edges
        const opacity = interpolate(
            scrollY.value,
            inputRange,
            [0.2, 0.4, 1.0, 0.4, 0.2],
            Extrapolation.CLAMP
        );

        // 3D rotation effect for depth
        const rotateX = interpolate(
            scrollY.value,
            inputRange,
            [45, 25, 0, -25, -45],
            Extrapolation.CLAMP
        );

        // Slight vertical translation for curved wheel effect
        const translateY = interpolate(
            scrollY.value,
            inputRange,
            [8, 4, 0, -4, -8],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { scale },
                { translateY },
                { perspective: 500 },
                { rotateX: `${rotateX}deg` },
            ],
            opacity,
        };
    });

    return (
        <View style={styles.itemContainer}>
            <Animated.Text style={[styles.itemText, animatedStyle]}>
                {item}
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        borderRadius: 32,
        backgroundColor: '#050505',
        marginBottom: 8,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    selectionIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: ITEM_HEIGHT,
        height: ITEM_HEIGHT,
        backgroundColor: '#121214',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginHorizontal: 8,
    },
    pickersRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    colon: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 36,
        fontWeight: '600',
    },
    wheelContainer: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: 80,
        overflow: 'hidden',
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 40,
        fontWeight: '300',
        color: '#ffffff',
        fontStyle: 'italic',
        fontFamily: 'System',
    },
});
