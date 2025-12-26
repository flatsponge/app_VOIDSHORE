import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlowEditor } from './FlowEditor';
import { Waves, PenLine, Sparkles } from 'lucide-react-native';
import { SentBottle } from '../types';
import { LevelUpModal } from './LevelUpModal';
import { ProfileModal } from './ProfileModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Levels Configuration
const LEVELS = [
    { title: "Drifter", threshold: 0 },
    { title: "Listener", threshold: 100 },
    { title: "Guide", threshold: 300 },
    { title: "Anchor", threshold: 600 },
    { title: "Lighthouse", threshold: 1000 },
    { title: "Ocean Keeper", threshold: 2000 },
];

const getCurrentLevel = (xp: number) => {
    let current = LEVELS[0];
    let levelIndex = 1;
    let nextXp = LEVELS[1].threshold;

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].threshold) {
            current = LEVELS[i];
            levelIndex = i + 1;
            nextXp = LEVELS[i + 1]?.threshold || xp * 1.5;
        }
    }
    return { level: levelIndex, title: current.title, nextXp };
};

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const MainApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'write' | 'shore'>('write');
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<'info' | 'xp'>('info');

    const [xp, setXp] = useState(0);
    const userLevel = getCurrentLevel(xp);

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [nextSendTime, setNextSendTime] = useState<number | null>(null);
    const [sentBottles, setSentBottles] = useState<SentBottle[]>([]);
    const insets = useSafeAreaInsets();

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedSend = await AsyncStorage.getItem('drift_next_send');
                const storedXp = await AsyncStorage.getItem('drift_xp');
                const storedHistory = await AsyncStorage.getItem('drift_sent_history');

                if (storedSend) {
                    const time = parseInt(storedSend);
                    if (time > Date.now()) setNextSendTime(time);
                }
                if (storedXp) setXp(parseInt(storedXp));
                if (storedHistory) {
                    const history = JSON.parse(storedHistory).map((b: any) => ({
                        ...b,
                        timestamp: new Date(b.timestamp),
                        replies: b.replies.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) }))
                    }));
                    setSentBottles(history);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            }
        };
        loadData();
    }, []);

    // Save Data
    useEffect(() => {
        AsyncStorage.setItem('drift_sent_history', JSON.stringify(sentBottles));
    }, [sentBottles]);

    useEffect(() => {
        const checkLevelUp = async () => {
            const storedXp = await AsyncStorage.getItem('drift_xp');
            const prevLevel = getCurrentLevel(parseInt(storedXp || '0')).level;

            AsyncStorage.setItem('drift_xp', xp.toString());

            if (userLevel.level > prevLevel && xp > 0) {
                setShowLevelUp(true);
            }
        }
        checkLevelUp();
    }, [xp]);

    const showNotification = (msg: string, type: 'info' | 'xp' = 'info') => {
        setNotification(msg);
        setNotificationType(type);
        setTimeout(() => setNotification(null), 4000);
    }

    const gainXp = (amount: number, reason: string) => {
        setXp(prev => prev + amount);
        showNotification(`${reason} +${amount} XP`, 'xp');
    };

    const handleSend = (content: string) => {
        const newBottle: SentBottle = {
            id: Math.random().toString(36).substr(2, 9),
            content: content,
            timestamp: new Date(),
            replies: [],
            location: "Drifting...",
            hasUnreadReplies: false
        };

        setSentBottles(prev => [newBottle, ...prev]);

        const nextTime = Date.now() + COOLDOWN_MS;
        setNextSendTime(nextTime);
        AsyncStorage.setItem('drift_next_send', nextTime.toString());

        gainXp(20, "Bottle cast");
    };

    const xpProgress = Math.min(100, (xp / userLevel.nextXp) * 100);

    return (
        <View className="flex-1 bg-[#09090b] relative">

            {/* Modals */}
            {showLevelUp && (
                <LevelUpModal
                    level={userLevel.level}
                    title={userLevel.title}
                    onClose={() => setShowLevelUp(false)}
                />
            )}

            {showProfile && (
                <ProfileModal
                    xp={xp}
                    level={userLevel.level}
                    title={userLevel.title}
                    nextXp={userLevel.nextXp}
                    onClose={() => setShowProfile(false)}
                />
            )}

            {/* Background Ambience */}
            <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                <View className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-900 opacity-10 rounded-full" />
                <View className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-900 opacity-10 rounded-full" />
            </View>

            {/* HEADER */}
            <View
                className="absolute left-0 right-0 px-6 z-30 flex-row justify-between items-start"
                pointerEvents="box-none"
                style={{ top: insets.top + 12 }}
            >
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    className="flex-col pt-1"
                >
                    <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text className="text-white/90 text-xl font-serif italic tracking-wide">Drift</Text>
                </MotiView>

                <Pressable onPress={() => setShowProfile(true)}>
                    <MotiView
                        from={{ translateY: -20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ delay: 200 }}
                        className="rounded-full overflow-hidden"
                    >
                        <BlurView intensity={20} tint="dark" className="p-1.5 pr-4 flex-row items-center gap-3 border border-white/10">
                            {/* Level Circle */}
                            <View className="relative w-9 h-9 items-center justify-center">
                                <View className="absolute inset-0 rounded-full border-2 border-[#333]" />
                                <View className="absolute inset-0 rounded-full border-2 border-indigo-500" style={{ opacity: xpProgress / 100 }} />
                                <Text className="text-[11px] font-bold text-white z-10">{userLevel.level}</Text>
                            </View>

                            <View className="justify-center">
                                <View className="flex-row items-center gap-1.5">
                                    <Text className="text-[11px] font-bold text-white tracking-wide uppercase">{userLevel.title}</Text>
                                    <Sparkles size={10} color="#facc15" />
                                </View>
                                <Text className="text-[9px] text-zinc-500 font-medium font-mono">{xp} / {userLevel.nextXp} XP</Text>
                            </View>
                        </BlurView>
                    </MotiView>
                </Pressable>
            </View>

            {/* Main Content Area */}
            <View className="flex-1">
                <>
                    {activeTab === 'write' ? (
                        <MotiView
                            key="write"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1"
                        >
                            <FlowEditor onSend={handleSend} nextSendTime={nextSendTime} />
                        </MotiView>
                    ) : (
                        <MotiView
                            key="shore"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 pt-32 px-6"
                        >
                            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }}>
                                <View className="items-center justify-center mb-12">
                                    <Text className="text-3xl text-white font-serif mb-2">The Shore</Text>
                                    <Text className="text-zinc-500 text-sm font-light">Messages wash ashore with the tide.</Text>
                                </View>

                                {/* History List */}
                                <View className="mt-8">
                                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Your Drifts</Text>
                                    {sentBottles.map((bottle) => (
                                        <View key={bottle.id} className="bg-[#1a1a1c] p-6 rounded-2xl mb-4 border border-white/5">
                                            <Text className="text-zinc-200 font-serif text-lg italic mb-2" numberOfLines={2}>
                                                "{bottle.content}"
                                            </Text>
                                            <View className="flex-row justify-between items-center">
                                                <Text className="text-zinc-600 text-xs">{bottle.timestamp.toLocaleDateString()}</Text>
                                                <Text className="text-zinc-600 text-xs">{bottle.location}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    {sentBottles.length === 0 && (
                                        <View className="border border-dashed border-white/10 rounded-2xl p-8 items-center">
                                            <Text className="text-zinc-500 italic">No bottles cast yet.</Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </MotiView>
                    )}
                </>
            </View>

            {/* Navigation Dock */}
            <View
                className="absolute bottom-0 left-0 right-0 h-28 items-center justify-end z-40"
                pointerEvents="box-none"
                style={{ paddingBottom: insets.bottom + 8 }}
            >
                <View className="rounded-full overflow-hidden shadow-xl border border-white/10">
                    <BlurView intensity={30} tint="dark" className="px-8 py-4 flex-row items-center gap-12">
                        <Pressable
                            onPress={() => setActiveTab('shore')}
                            className="items-center justify-center gap-1"
                        >
                            <Waves size={26} color={activeTab === 'shore' ? 'white' : '#52525b'} strokeWidth={activeTab === 'shore' ? 2.5 : 2} />
                        </Pressable>
                        <View className="w-px h-6 bg-white/10" />
                        <Pressable
                            onPress={() => setActiveTab('write')}
                            className="items-center justify-center gap-1"
                        >
                            <PenLine size={26} color={activeTab === 'write' ? 'white' : '#52525b'} strokeWidth={activeTab === 'write' ? 2.5 : 2} />
                        </Pressable>
                    </BlurView>
                </View>
            </View>

            {/* Notification Toast */}
            <>
                {notification && (
                    <MotiView
                        from={{ opacity: 0, translateY: -50, scale: 0.9 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute left-0 right-0 items-center z-50 pointer-events-none"
                        style={{ top: insets.top + 8 }}
                    >
                        <View className={`bg-zinc-800 border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex-row items-center gap-3 ${notificationType === 'xp' ? 'border-indigo-500/30 bg-indigo-900' : ''}`}>
                            <View className={`w-2 h-2 rounded-full ${notificationType === 'xp' ? 'bg-yellow-400' : 'bg-indigo-400'}`} />
                            <Text className="text-white text-sm font-medium">{notification}</Text>
                        </View>
                    </MotiView>
                )}
            </>
        </View>
    );
};