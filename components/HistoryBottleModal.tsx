import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { X, Waves, Quote, Heart, HeartCrack, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SentBottle, Reply } from '../types';

interface HistoryBottleModalProps {
    bottle: SentBottle;
    onClose: () => void;
    onReplyAction: (replyId: string, action: 'up' | 'down' | 'super') => void;
}

export const HistoryBottleModal: React.FC<HistoryBottleModalProps> = ({
    bottle,
    onClose,
    onReplyAction,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            className="absolute inset-0 z-50 bg-[#0c0c0e]"
        >
            {/* Background gradient */}
            <View
                className="absolute top-0 left-0 right-0 h-[40%]"
                style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
            />

            {/* Close Button */}
            <View
                className="absolute right-6 z-50"
                style={{ top: insets.top + 12 }}
            >
                <Pressable
                    onPress={onClose}
                    className="p-3 rounded-full overflow-hidden"
                >
                    <BlurView intensity={20} tint="dark" className="absolute inset-0" />
                    <X size={20} color="#a1a1aa" />
                </Pressable>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingTop: insets.top + 80,
                    paddingBottom: insets.bottom + 40,
                    paddingHorizontal: 24,
                }}
            >
                {/* Your Memory (Original Bottle) */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="mb-12"
                >
                    <View className="flex-row items-center gap-2 mb-4 opacity-60">
                        <View className="w-6 h-px bg-zinc-600" />
                        <Text className="text-xs uppercase tracking-widest text-zinc-400">Your Memory</Text>
                    </View>

                    <View className="border-l-2 border-white/10 pl-6 py-2">
                        <Text className="font-serif text-2xl text-zinc-400 leading-relaxed italic">
                            "{bottle.content}"
                        </Text>
                    </View>
                </MotiView>

                {/* Echoes from the Shore (Replies) */}
                <View>
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center gap-2 opacity-80">
                            <Waves size={16} color="#818cf8" />
                            <Text className="text-sm font-bold uppercase tracking-widest text-indigo-300">
                                Echoes from the Shore
                            </Text>
                        </View>
                        <View className="bg-zinc-900 px-2 py-1 rounded">
                            <Text className="text-xs text-zinc-600">{bottle.replies.length} replies</Text>
                        </View>
                    </View>

                    {bottle.replies.length > 0 ? (
                        <View className="gap-4">
                            {bottle.replies.map((reply, i) => (
                                <ReplyCard
                                    key={reply.id}
                                    reply={reply}
                                    index={i}
                                    onAction={(action) => onReplyAction(reply.id, action)}
                                />
                            ))}
                        </View>
                    ) : (
                        <View className="items-center py-12 border border-dashed border-white/10 rounded-2xl">
                            <Waves size={24} color="#52525b" style={{ marginBottom: 12 }} />
                            <Text className="text-sm text-zinc-500">Your bottle is still drifting...</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </MotiView>
    );
};

interface ReplyCardProps {
    reply: Reply;
    index: number;
    onAction: (action: 'up' | 'down' | 'super') => void;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ reply, index, onAction }) => {
    const isDownvoted = reply.vote === 'down';
    const isSuper = reply.vote === 'super';

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: 'timing' }}
            className={`rounded-2xl p-6 border overflow-hidden ${isDownvoted
                    ? 'bg-[#121214] border-white/5 opacity-50'
                    : 'bg-[#1a1a1c] border-white/10'
                }`}
        >
            {/* Background Glow for Super Thanks */}
            {isSuper && (
                <View
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
                />
            )}

            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 z-10">
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center border border-white/10">
                        <Text className="text-[10px] text-zinc-300">
                            {reply.author.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                            {reply.authorRank || 'Drifter'}
                        </Text>
                        <Text className="text-[10px] text-zinc-600">Just now</Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <Text className={`font-serif text-lg leading-relaxed mb-6 z-10 ${isDownvoted ? 'text-zinc-500' : 'text-zinc-100'}`}>
                "{reply.content}"
            </Text>

            {/* Actions */}
            <View className="flex-row items-center justify-between pt-2 z-10">
                <View className="flex-row items-center gap-1 bg-black/20 rounded-full p-1 border border-white/5">
                    {/* Upvote */}
                    <Pressable
                        onPress={() => onAction('up')}
                        className={`p-2 rounded-full flex-row items-center gap-2 ${reply.vote === 'up' ? 'bg-pink-500/10' : ''
                            }`}
                    >
                        <Heart
                            size={16}
                            color={reply.vote === 'up' ? '#f472b6' : '#71717a'}
                            fill={reply.vote === 'up' ? '#f472b6' : 'none'}
                        />
                        {reply.vote === 'up' && (
                            <Text className="text-[10px] font-bold text-pink-400 pr-1">Helpful</Text>
                        )}
                    </Pressable>

                    <View className="w-px h-4 bg-white/10 mx-1" />

                    {/* Downvote */}
                    <Pressable
                        onPress={() => onAction('down')}
                        className={`p-2 rounded-full ${reply.vote === 'down' ? 'bg-white/5' : ''}`}
                    >
                        <HeartCrack
                            size={16}
                            color={reply.vote === 'down' ? '#a1a1aa' : '#71717a'}
                        />
                    </Pressable>
                </View>

                {/* Super Thanks */}
                <Pressable
                    onPress={() => onAction('super')}
                    className={`flex-row items-center gap-2 px-3 py-2 rounded-full border ${isSuper
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'border-transparent'
                        }`}
                >
                    <Sparkles
                        size={14}
                        color={isSuper ? '#facc15' : '#52525b'}
                        fill={isSuper ? '#facc15' : 'none'}
                    />
                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${isSuper ? 'text-yellow-400' : 'text-zinc-600'
                        }`}>
                        Send Thanks
                    </Text>
                </Pressable>
            </View>
        </MotiView>
    );
};
