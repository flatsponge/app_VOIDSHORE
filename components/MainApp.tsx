import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlowEditor } from './FlowEditor';
import { BottleReadingModal } from './BottleReadingModal';
import { HistoryBottleModal } from './HistoryBottleModal';
import { Waves, PenLine, Sparkles, Compass, Send, MapPin, ArrowRight, Quote, MessageSquare } from 'lucide-react-native';
import { Bottle, SentBottle, Reply } from '../types';
import { LevelUpModal } from './LevelUpModal';
import { ProfileModal } from './ProfileModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularProgress } from './CircularProgress';

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

// Mock data generator for received bottles
const getRandomBottle = (): Bottle => {
    const content = [
        "I lost in battleground and I am so sad. It feels like the world has turned its back on me, and every step forward is a struggle against an invisible tide. I don't know if I have the strength to keep fighting this war alone.",
        "How I see darkness and so much darkness now in winter. The cold seems to seep into my very bones, and the long nights stretch out endlessly before me. I search for a flicker of light, a single spark to warm my hands, but all I find is the deepening shadow of the season."
    ];

    const locations = [
        "North Atlantic",
        "South Pacific",
        "Mediterranean Sea",
        "Tasman Sea",
        "Indian Ocean",
        "Caribbean Sea",
        "Baltic Sea",
        "Gulf of Mexico",
        "Coral Sea"
    ];

    const ranks = ["Drifter", "Listener", "Guide", "Drifter", "Anchor"];

    const randomDaysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - randomDaysAgo);

    return {
        id: Math.random().toString(36).substr(2, 9),
        content: content[Math.floor(Math.random() * content.length)],
        author: "Stranger",
        authorRank: ranks[Math.floor(Math.random() * ranks.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: timestamp,
        isRead: false
    };
};

const MOCK_REPLIES = [
    "I needed to hear this today. Thank you.",
    "Sending you strength from across the ocean.",
    "You are not alone in feeling this.",
    "This is beautiful. Keep going.",
    "I feel the exact same way.",
    "Your words resonated with me deeply."
];

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const MainApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'write' | 'shore'>('write');
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<'info' | 'xp'>('info');

    const [xp, setXp] = useState(0);
    const userLevel = getCurrentLevel(xp);

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Cooldown states
    const [nextSendTime, setNextSendTime] = useState<number | null>(null);
    const [nextReceiveTime, setNextReceiveTime] = useState<number | null>(null);

    // Bottle states
    const [dailyBottle, setDailyBottle] = useState<Bottle | null>(null);
    const [isReadingBottle, setIsReadingBottle] = useState(false);
    const [hasRatedDaily, setHasRatedDaily] = useState(false);

    // History states
    const [sentBottles, setSentBottles] = useState<SentBottle[]>([]);
    const [selectedHistoryBottle, setSelectedHistoryBottle] = useState<SentBottle | null>(null);

    const insets = useSafeAreaInsets();

    // Timer state for UI updates
    const [_, setTick] = useState(0);

    // Timer updater for cooldown countdown
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedSend = await AsyncStorage.getItem('drift_next_send');
                const storedReceive = await AsyncStorage.getItem('drift_next_receive');
                const storedBottle = await AsyncStorage.getItem('drift_daily_bottle');
                const storedXp = await AsyncStorage.getItem('drift_xp');
                const storedHistory = await AsyncStorage.getItem('drift_sent_history');

                if (storedSend) {
                    const time = parseInt(storedSend);
                    if (time > Date.now()) setNextSendTime(time);
                }

                if (storedReceive) {
                    const time = parseInt(storedReceive);
                    if (time > Date.now()) setNextReceiveTime(time);
                }

                if (storedBottle) {
                    setDailyBottle(JSON.parse(storedBottle));
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

    // Save sent bottles history
    useEffect(() => {
        AsyncStorage.setItem('drift_sent_history', JSON.stringify(sentBottles));
    }, [sentBottles]);

    // Check for level up
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

    const loseXp = (amount: number, reason: string) => {
        setXp(prev => Math.max(0, prev - amount));
        showNotification(`${reason} -${amount} XP`, 'info');
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

        // Simulate receiving a reply (Demo feature)
        setTimeout(() => {
            const replyText = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
            const newReply: Reply = {
                id: Math.random().toString(36).substr(2, 9),
                content: replyText,
                author: "Stranger",
                authorRank: "Listener",
                timestamp: new Date(),
                vote: null
            };

            setSentBottles(prev => prev.map(b => {
                if (b.id === newBottle.id) {
                    return {
                        ...b,
                        replies: [...b.replies, newReply],
                        hasUnreadReplies: true
                    };
                }
                return b;
            }));
            showNotification("Someone found your bottle!");
        }, 8000);
    };

    const handleOpenBottle = () => {
        if (!dailyBottle || (nextReceiveTime && Date.now() > nextReceiveTime)) {
            const newBottle = getRandomBottle();
            setDailyBottle(newBottle);
            setHasRatedDaily(false);
            AsyncStorage.setItem('drift_daily_bottle', JSON.stringify(newBottle));

            const nextTime = Date.now() + COOLDOWN_MS;
            setNextReceiveTime(nextTime);
            AsyncStorage.setItem('drift_next_receive', nextTime.toString());
        }
        setIsReadingBottle(true);
    };

    const handleCloseBottle = () => {
        setIsReadingBottle(false);
    };

    const handleRateStranger = (type: 'up' | 'down' | 'flower') => {
        if (hasRatedDaily) return;
        setHasRatedDaily(true);
        gainXp(10, "Feedback given");
    };

    const handleSendReply = (content: string) => {
        setIsReadingBottle(false);
        gainXp(30, "Reply sent");
        showNotification("Reply sent to the stranger.");
        simulateIncomingFeedback();
    };

    const handleReplyAction = (replyId: string, action: 'up' | 'down' | 'super') => {
        if (!selectedHistoryBottle) return;

        setSentBottles(prev => prev.map(bottle => {
            if (bottle.id !== selectedHistoryBottle.id) return bottle;

            return {
                ...bottle,
                replies: bottle.replies.map(reply => {
                    if (reply.id !== replyId) return reply;

                    // If clicking the same action, toggle it off (except super)
                    if (reply.vote === action && action !== 'super') {
                        return { ...reply, vote: null };
                    }

                    return { ...reply, vote: action };
                })
            };
        }));

        // Update selected bottle view
        setSelectedHistoryBottle(prev => {
            if (!prev) return null;
            return {
                ...prev,
                replies: prev.replies.map(reply => {
                    if (reply.id !== replyId) return reply;
                    if (reply.vote === action && action !== 'super') {
                        return { ...reply, vote: null };
                    }
                    return { ...reply, vote: action };
                })
            };
        });

        if (action === 'super') {
            gainXp(15, "Super Thanks Sent");
            showNotification("Gratitude sent!");
        } else if (action === 'up') {
            showNotification("Marked as helpful");
        }
    };

    const simulateIncomingFeedback = () => {
        const delay = 4000 + Math.random() * 3000;

        setTimeout(() => {
            const roll = Math.random();
            if (roll > 0.7) {
                gainXp(50, "Stranger found your advice helpful!");
            } else if (roll > 0.9) {
                gainXp(150, "You received a Flower!");
            } else if (roll < 0.1) {
                loseXp(20, "Advice marked unhelpful");
            }
        }, delay);
    };

    const handleOpenHistoryBottle = (bottle: SentBottle) => {
        if (bottle.hasUnreadReplies) {
            const updated = { ...bottle, hasUnreadReplies: false };
            setSentBottles(prev => prev.map(b => b.id === bottle.id ? updated : b));
            setSelectedHistoryBottle(updated);
        } else {
            setSelectedHistoryBottle(bottle);
        }
    };

    const getFormatTimeLeft = (targetTime: number) => {
        const diff = targetTime - Date.now();
        if (diff <= 0) return null;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const receiveTimeLeft = nextReceiveTime ? getFormatTimeLeft(nextReceiveTime) : null;
    const canReceive = !receiveTimeLeft;

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

            {/* Bottle Reading Modal */}
            {isReadingBottle && dailyBottle && (
                <BottleReadingModal
                    bottle={dailyBottle}
                    hasRatedDaily={hasRatedDaily}
                    onClose={handleCloseBottle}
                    onRate={handleRateStranger}
                    onSendReply={handleSendReply}
                />
            )}

            {/* History Bottle Modal */}
            {selectedHistoryBottle && (
                <HistoryBottleModal
                    bottle={selectedHistoryBottle}
                    onClose={() => setSelectedHistoryBottle(null)}
                    onReplyAction={handleReplyAction}
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
                    <Text className="text-white/90 text-xl font-serif italic tracking-wide">Void Shore</Text>
                </MotiView>

                <Pressable onPress={() => setShowProfile(true)}>
                    <MotiView
                        from={{ translateY: -20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ delay: 200 }}
                        className="rounded-full overflow-hidden"
                    >
                        <BlurView intensity={20} tint="dark" className="p-1.5 pr-4 flex-row items-center gap-3 border border-white/10">
                            {/* Animated Circular Progress Level Indicator */}
                            <View className="relative w-9 h-9 items-center justify-center">
                                {/* Glow Effect */}
                                <View
                                    className="absolute w-9 h-9 rounded-full opacity-30"
                                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.5)' }}
                                />
                                {/* Circular Progress */}
                                <CircularProgress
                                    size={36}
                                    strokeWidth={2.5}
                                    progress={xpProgress}
                                    trackColor="#333"
                                >
                                    <Text className="text-[11px] font-bold text-white">{userLevel.level}</Text>
                                </CircularProgress>
                            </View>

                            <View className="justify-center">
                                <View className="flex-row items-center gap-1.5">
                                    <Text className="text-[11px] font-bold text-white tracking-wide uppercase">{userLevel.title}</Text>
                                    <Sparkles size={10} color="#facc15" fill="rgba(250, 204, 21, 0.5)" />
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
                            className="flex-1"
                            style={{ paddingTop: insets.top + 80 }}
                        >
                            <ScrollView
                                className="flex-1 px-6"
                                contentContainerStyle={{ paddingBottom: 150 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Shore Hero Section */}
                                <View className="items-center justify-center mb-12">
                                    <Text className="text-3xl text-white font-serif mb-2">The Shore</Text>
                                    <Text className="text-zinc-500 text-sm font-light">Messages wash ashore with the tide.</Text>

                                    {/* Open Bottle or Cooldown */}
                                    <View className="mt-10">
                                        {canReceive ? (
                                            <Pressable onPress={handleOpenBottle} className="items-center">
                                                <View className="relative w-40 h-40 items-center justify-center">
                                                    {/* Blur glow effect */}
                                                    <MotiView
                                                        from={{ scale: 0.8, opacity: 0.3 }}
                                                        animate={{ scale: 1.2, opacity: 0.15 }}
                                                        transition={{
                                                            loop: true,
                                                            type: 'timing',
                                                            duration: 2500,
                                                            repeatReverse: true,
                                                        }}
                                                        className="absolute w-40 h-40 rounded-full"
                                                        style={{ backgroundColor: 'rgba(99, 102, 241, 0.4)' }}
                                                    />

                                                    {/* Gradient overlay */}
                                                    <View
                                                        className="absolute w-44 h-44 rounded-full opacity-20"
                                                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                                                    />

                                                    {/* Main button */}
                                                    <View className="w-32 h-32 bg-white/5 border border-white/10 rounded-full items-center justify-center overflow-hidden">
                                                        {/* Ping animation inside button */}
                                                        <MotiView
                                                            from={{ scale: 0.8, opacity: 0.3 }}
                                                            animate={{ scale: 1.5, opacity: 0 }}
                                                            transition={{
                                                                loop: true,
                                                                type: 'timing',
                                                                duration: 2000,
                                                            }}
                                                            className="absolute w-32 h-32 bg-white/10 rounded-full"
                                                        />
                                                        <Compass size={40} color="#c7d2fe" strokeWidth={1} />
                                                    </View>

                                                    {/* Shadow glow */}
                                                    <View
                                                        className="absolute w-32 h-32 rounded-full"
                                                        style={{
                                                            shadowColor: '#ffffff',
                                                            shadowOffset: { width: 0, height: 0 },
                                                            shadowOpacity: 0.05,
                                                            shadowRadius: 50,
                                                        }}
                                                    />
                                                </View>
                                                <Text className="mt-6 text-indigo-200 text-sm tracking-widest uppercase opacity-80">
                                                    Open Bottle
                                                </Text>
                                            </Pressable>
                                        ) : (
                                            <View className="items-center gap-8 py-8">
                                                {/* Background glow for waves */}
                                                <View className="relative">
                                                    <View
                                                        className="absolute inset-0 rounded-full opacity-10"
                                                        style={{
                                                            backgroundColor: 'rgba(99, 102, 241, 0.3)',
                                                            transform: [{ scale: 2 }]
                                                        }}
                                                    />
                                                    <MotiView
                                                        from={{ translateY: 0 }}
                                                        animate={{ translateY: -5 }}
                                                        transition={{
                                                            loop: true,
                                                            type: 'timing',
                                                            duration: 4000,
                                                            repeatReverse: true,
                                                        }}
                                                        style={{ opacity: 0.3 }}
                                                    >
                                                        <Waves size={64} color="#71717a" strokeWidth={1} />
                                                    </MotiView>
                                                </View>

                                                <View className="flex-row items-center gap-2.5 bg-zinc-900/80 px-5 py-2.5 rounded-full border border-white/5">
                                                    {/* Pulsing dot */}
                                                    <MotiView
                                                        from={{ opacity: 0.3 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            loop: true,
                                                            type: 'timing',
                                                            duration: 1000,
                                                            repeatReverse: true,
                                                        }}
                                                        className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                                                    />
                                                    <Text className="text-zinc-400 font-mono text-xs tracking-wider uppercase">
                                                        High tide in {receiveTimeLeft}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Your Drifts (History) */}
                                <View className="mt-8">
                                    <View className="flex-row items-center justify-between mb-8 opacity-60 px-2">
                                        <View className="flex-row items-center gap-2">
                                            <Send size={14} color="#a1a1aa" />
                                            <Text className="text-sm font-medium uppercase tracking-widest text-zinc-400">Your Drifts</Text>
                                        </View>
                                        <Text className="text-xs font-serif text-zinc-500 italic">{sentBottles.length} Memories</Text>
                                    </View>

                                    {sentBottles.length === 0 ? (
                                        <View className="items-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5 mx-2">
                                            <Text className="text-zinc-500 font-serif italic">You haven't cast any bottles yet.</Text>
                                        </View>
                                    ) : (
                                        <View className="gap-4">
                                            {sentBottles.map((bottle, index) => (
                                                <MotiView
                                                    key={bottle.id}
                                                    from={{ opacity: 0, translateY: 20 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ delay: index * 50 }}
                                                >
                                                    <Pressable
                                                        onPress={() => handleOpenHistoryBottle(bottle)}
                                                        className="bg-[#1a1a1c]/60 border border-white/5 p-6 rounded-2xl"
                                                    >
                                                        <View className="flex-row justify-between items-start mb-4">
                                                            <Text className="text-xs font-medium text-zinc-500 tracking-wider uppercase">
                                                                {formatDate(bottle.timestamp)}
                                                            </Text>

                                                            {bottle.hasUnreadReplies ? (
                                                                <View className="flex-row items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                                                                    {/* Ping animation for unread */}
                                                                    <View className="relative w-2 h-2">
                                                                        <MotiView
                                                                            from={{ scale: 1, opacity: 0.75 }}
                                                                            animate={{ scale: 2, opacity: 0 }}
                                                                            transition={{
                                                                                loop: true,
                                                                                type: 'timing',
                                                                                duration: 1000,
                                                                            }}
                                                                            className="absolute inset-0 bg-indigo-400 rounded-full"
                                                                        />
                                                                        <View className="absolute inset-0 bg-indigo-500 rounded-full" />
                                                                    </View>
                                                                    <Text className="text-[9px] font-bold text-indigo-300 uppercase tracking-wide">Reply</Text>
                                                                </View>
                                                            ) : bottle.replies.length > 0 && (
                                                                <View className="flex-row items-center gap-1">
                                                                    <MessageSquare size={12} color="#52525b" />
                                                                    <Text className="text-[10px] font-medium text-zinc-600">{bottle.replies.length}</Text>
                                                                </View>
                                                            )}
                                                        </View>

                                                        <View className="relative">
                                                            <Quote size={16} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: -4, left: -4 }} />
                                                            <Text
                                                                className="text-zinc-200 font-serif text-xl leading-relaxed pl-4 italic opacity-90"
                                                                numberOfLines={2}
                                                            >
                                                                {bottle.content}
                                                            </Text>
                                                        </View>

                                                        <View className="mt-4 pt-4 border-t border-white/5 flex-row items-center justify-between">
                                                            <View className="flex-row items-center gap-1">
                                                                <MapPin size={10} color="#52525b" />
                                                                <Text className="text-xs text-zinc-600">{bottle.location}</Text>
                                                            </View>
                                                            <View className="bg-white/5 rounded-full p-1">
                                                                <ArrowRight size={12} color="#71717a" />
                                                            </View>
                                                        </View>
                                                    </Pressable>
                                                </MotiView>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </MotiView>
                    )}
                </>
            </View>

            {/* Navigation Dock */}
            {!isReadingBottle && !selectedHistoryBottle && (
                <View
                    className="absolute bottom-0 left-0 right-0 h-28 items-center justify-end z-40"
                    pointerEvents="box-none"
                    style={{ paddingBottom: insets.bottom + 8 }}
                >
                    <View className="rounded-full overflow-hidden shadow-xl border border-white/10">
                        <BlurView intensity={30} tint="dark" className="px-8 py-4 flex-row items-center gap-12">
                            <Pressable
                                onPress={() => setActiveTab('shore')}
                                className="items-center justify-center gap-1 relative"
                            >
                                <Waves size={26} color={activeTab === 'shore' ? 'white' : '#52525b'} strokeWidth={activeTab === 'shore' ? 2.5 : 2} />
                                {canReceive && activeTab !== 'shore' && (
                                    <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#09090b]" />
                                )}
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
            )}

            {/* Notification Toast */}
            <>
                {notification && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{
                            type: 'timing',
                            duration: 450,
                        }}
                        className="absolute left-0 right-0 items-center z-50 pointer-events-none"
                        style={{ top: insets.top + 8 }}
                    >
                        <View className={`bg-zinc-800/90 border border-white/10 px-5 py-3 rounded-2xl shadow-2xl flex-row items-center gap-3 ${notificationType === 'xp' ? 'border-indigo-500/30 bg-indigo-900/90' : ''}`}>
                            {notificationType === 'xp' ? (
                                <MotiView
                                    from={{ scale: 1, opacity: 0.7 }}
                                    animate={{ scale: 1.3, opacity: 1 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 600,
                                        loop: true,
                                        repeatReverse: true,
                                    }}
                                    className="w-2 h-2 rounded-full bg-yellow-400"
                                />
                            ) : (
                                <View className="w-2 h-2 rounded-full bg-indigo-400" />
                            )}
                            <Text className="text-white text-sm font-medium">{notification}</Text>
                        </View>
                    </MotiView>
                )}
            </>
        </View>
    );
};