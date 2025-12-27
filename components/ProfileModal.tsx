import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable, ScrollView, Switch, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import {
    X,
    Settings,
    Award,
    Bell,
    Moon,
    Shield,
    LogOut,
    ChevronRight,
    Zap,
    Heart,
    Map,
    Sparkles
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularProgress } from './CircularProgress';

interface ProfileModalProps {
    xp: number;
    level: number;
    title: string;
    nextXp: number;
    onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Achievement Item Component
const AchievementItem: React.FC<{
    icon: typeof Zap;
    label: string;
    unlocked: boolean;
}> = ({ icon: Icon, label, unlocked }) => (
    <View className="items-center gap-2">
        <View
            className={`w-14 h-14 rounded-2xl items-center justify-center border ${unlocked
                ? 'bg-indigo-500/10 border-indigo-500/30'
                : 'bg-white/5 border-white/5'
                }`}
        >
            <Icon size={20} color={unlocked ? '#818cf8' : '#3f3f46'} />
        </View>
        <Text
            className={`text-[10px] text-center font-medium ${unlocked ? 'text-zinc-300' : 'text-zinc-700'
                }`}
        >
            {label}
        </Text>
    </View>
);

// Setting Item Component
const SettingItem: React.FC<{
    icon: typeof Bell;
    label: string;
    value?: string;
    isToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
    isDestructive?: boolean;
    onPress?: () => void;
}> = ({ icon: Icon, label, value, isToggle, toggleValue, onToggle, isDestructive, onPress }) => (
    <Pressable
        onPress={onPress}
        className={`flex-row items-center justify-between p-4 rounded-xl bg-[#1c1c1f] border border-white/5 mb-2 active:opacity-80 ${isDestructive ? 'bg-transparent border-transparent' : ''
            }`}
    >
        <View className="flex-row items-center gap-3">
            <Icon size={18} color={isDestructive ? '#f87171' : '#71717a'} />
            <Text className={`text-sm font-medium ${isDestructive ? 'text-red-400' : 'text-zinc-300'}`}>
                {label}
            </Text>
        </View>
        <View className="flex-row items-center gap-2">
            {value && <Text className="text-xs text-zinc-500">{value}</Text>}
            {isToggle ? (
                <View
                    className={`w-10 h-6 rounded-full relative ${toggleValue ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                >
                    <View
                        className="absolute w-4 h-4 bg-white rounded-full top-1"
                        style={{ left: toggleValue ? 20 : 4 }}
                    />
                </View>
            ) : !isDestructive && (
                <ChevronRight size={16} color="#52525b" />
            )}
        </View>
    </Pressable>
);

export const ProfileModal: React.FC<ProfileModalProps> = ({
    xp,
    level,
    title,
    nextXp,
    onClose
}) => {
    const insets = useSafeAreaInsets();
    const progress = Math.min(100, (xp / nextXp) * 100);

    const progressBarWidth = useSharedValue(0);

    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    // Achievements based on XP
    const achievements = [
        { id: 1, icon: Zap, label: "First Drift", unlocked: true },
        { id: 2, icon: Heart, label: "Good Listener", unlocked: xp > 100 },
        { id: 3, icon: Map, label: "Explorer", unlocked: xp > 300 },
        { id: 4, icon: Award, label: "Anchor", unlocked: xp > 600 },
    ];

    useEffect(() => {
        // Animate progress bar
        progressBarWidth.value = withDelay(
            400,
            withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressBarWidth.value}%`,
    }));

    return (
        <Modal transparent animationType="slide" visible>
            <View className="flex-1 justify-end">
                {/* Backdrop */}
                <Pressable
                    className="absolute inset-0 bg-black/80"
                    onPress={onClose}
                />

                {/* Modal Content */}
                <View
                    style={{
                        height: SCREEN_HEIGHT * 0.85,
                        paddingBottom: insets.bottom || 20,
                    }}
                    className="bg-[#121214] border-t border-white/10 rounded-t-3xl overflow-hidden"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-white/5">
                        <Text className="text-lg font-serif italic text-white">Identity</Text>
                        <Pressable
                            onPress={onClose}
                            className="p-2 bg-white/5 rounded-full active:bg-white/10"
                        >
                            <X size={20} color="#a1a1aa" />
                        </Pressable>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        className="flex-1 p-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {/* ID Card */}
                        <View className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1f] to-[#121214] border border-white/10 p-6 mb-8">


                            <View className="flex-row items-center gap-5 mb-6">
                                {/* Animated Circular Progress */}
                                <CircularProgress
                                    size={80}
                                    strokeWidth={4}
                                    progress={progress}
                                >
                                    <Text className="text-2xl font-bold text-white">{level}</Text>
                                </CircularProgress>

                                <View className="flex-1">
                                    <Text className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">
                                        Current Rank
                                    </Text>
                                    <Text className="text-3xl text-white font-serif italic">{title}</Text>
                                </View>
                            </View>

                            {/* XP Progress */}
                            <View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-xs text-zinc-400 font-medium">XP Progress</Text>
                                    <Text className="text-xs text-zinc-400 font-mono">{Math.floor(xp)} / {nextXp}</Text>
                                </View>
                                <View className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <Animated.View
                                        style={progressAnimatedStyle}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </View>
                                <Text className="text-[10px] text-zinc-600 mt-2 text-center">
                                    Earn XP by sending bottles, replying to strangers, and opening daily tides.
                                </Text>
                            </View>
                        </View>

                        {/* Achievements */}
                        <View className="mb-8">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Award size={14} color="#71717a" />
                                <Text className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                    Achievements
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                {achievements.map((item) => (
                                    <AchievementItem
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        unlocked={item.unlocked}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Stats Grid */}
                        <View className="flex-row gap-3 mb-8">
                            <View className="flex-1 bg-[#1c1c1f] p-4 rounded-2xl border border-white/5">
                                <Text className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">
                                    Bottles Sent
                                </Text>
                                <Text className="text-2xl text-white font-serif">12</Text>
                            </View>
                            <View className="flex-1 bg-[#1c1c1f] p-4 rounded-2xl border border-white/5">
                                <Text className="text-zinc-500 text-[10px] uppercase tracking-wide mb-1">
                                    Lives Touched
                                </Text>
                                <Text className="text-2xl text-white font-serif">8</Text>
                            </View>
                        </View>

                        {/* Settings */}
                        <View>
                            <View className="flex-row items-center gap-2 mb-4">
                                <Settings size={14} color="#71717a" />
                                <Text className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                    Preferences
                                </Text>
                            </View>

                            <SettingItem
                                icon={Bell}
                                label="Notifications"
                                isToggle
                                toggleValue={notificationsEnabled}
                                onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                            />
                            <SettingItem
                                icon={Moon}
                                label="Dark Mode"
                                value="On"
                            />
                            <SettingItem
                                icon={Shield}
                                label="Privacy Policy"
                            />
                            <SettingItem
                                icon={LogOut}
                                label="Reset Journey"
                                isDestructive
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
