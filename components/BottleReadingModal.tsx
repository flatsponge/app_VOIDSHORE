import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { X, Quote, MapPin, ThumbsUp, ThumbsDown, Flower2, Send } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bottle } from '../types';

interface BottleReadingModalProps {
    bottle: Bottle;
    hasRatedDaily: boolean;
    onClose: () => void;
    onRate: (type: 'up' | 'down' | 'flower') => void;
    onSendReply: (content: string) => void;
}

export const BottleReadingModal: React.FC<BottleReadingModalProps> = ({
    bottle,
    hasRatedDaily,
    onClose,
    onRate,
    onSendReply,
}) => {
    const insets = useSafeAreaInsets();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSendReply = () => {
        if (!replyContent.trim()) return;
        onSendReply(replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

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
                className="absolute top-0 left-0 right-0 h-[40%] opacity-30"
                style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: insets.top + 60,
                        paddingBottom: 150,
                        paddingHorizontal: 24,
                    }}
                >
                    {/* Main Content */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{
                            translateY: isReplying ? -50 : 0,
                            opacity: isReplying ? 0.4 : 1,
                            scale: isReplying ? 0.95 : 1,
                        }}
                        transition={{ type: 'timing', duration: 500 }}
                        className="items-center max-w-sm"
                    >
                        <Quote size={48} color="rgba(99, 102, 241, 0.2)" />

                        <Text className="font-serif text-3xl text-zinc-100 leading-normal italic tracking-wide text-center mt-6">
                            "{bottle.content}"
                        </Text>

                        {/* Location & Author Badge */}
                        <View className="flex-row items-center gap-3 mt-8 px-5 py-2.5 bg-white/5 rounded-full border border-white/5">
                            <MapPin size={14} color="#818cf8" />
                            <Text className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">
                                {bottle.location}
                            </Text>
                            <Text className="text-zinc-600">•</Text>
                            <Text className="text-xs text-zinc-500 uppercase tracking-widest">
                                {bottle.authorRank || 'Drifter'}
                            </Text>
                        </View>

                        {/* Rating Controls */}
                        <View className="flex-row items-center gap-2 mt-6">
                            <Pressable
                                onPress={() => onRate('down')}
                                disabled={hasRatedDaily}
                                className={`p-3 rounded-full bg-white/5 ${hasRatedDaily ? 'opacity-30' : ''}`}
                            >
                                <ThumbsDown size={20} color="#71717a" />
                            </Pressable>

                            <View className="w-px h-8 bg-white/10 mx-2" />

                            <Pressable
                                onPress={() => onRate('up')}
                                disabled={hasRatedDaily}
                                className={`p-3 rounded-full bg-white/5 ${hasRatedDaily ? 'opacity-30' : ''}`}
                            >
                                <ThumbsUp size={20} color={hasRatedDaily ? '#818cf8' : '#a1a1aa'} />
                            </Pressable>

                            <Pressable
                                onPress={() => onRate('flower')}
                                disabled={hasRatedDaily}
                                className={`p-3 rounded-full bg-white/5 ${hasRatedDaily ? 'opacity-30' : ''}`}
                            >
                                <Flower2 size={20} color={hasRatedDaily ? '#f472b6' : '#a1a1aa'} />
                            </Pressable>
                        </View>

                        {hasRatedDaily && (
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Text className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                                    Feedback Sent
                                </Text>
                            </MotiView>
                        )}
                    </MotiView>

                    {/* Reply Input Area (shown when replying) */}
                    {isReplying && (
                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="absolute inset-x-6 items-center justify-center"
                            style={{ top: '30%' }}
                        >
                            <Text className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-6 text-center">
                                Reply to {bottle.authorRank || 'Stranger'}
                            </Text>
                            <TextInput
                                value={replyContent}
                                onChangeText={setReplyContent}
                                placeholder="Write a supportive message..."
                                placeholderTextColor="#3f3f46"
                                multiline
                                autoFocus
                                className="w-full text-2xl text-white font-serif text-center min-h-[200px]"
                                style={{ textAlignVertical: 'top' }}
                            />
                        </MotiView>
                    )}
                </ScrollView>

                {/* Bottom Actions Bar */}
                <View
                    className="absolute left-0 right-0 px-8 z-30"
                    style={{ bottom: insets.bottom + 24 }}
                >
                    <View className="max-w-md mx-auto w-full">
                        {!isReplying ? (
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                            >
                                <Pressable
                                    onPress={() => setIsReplying(true)}
                                    className="w-full py-4 bg-white rounded-full items-center justify-center flex-row gap-2"
                                    style={{ shadowColor: '#fff', shadowOpacity: 0.1, shadowRadius: 30 }}
                                >
                                    <Text className="text-black text-lg font-medium">Write a Reply</Text>
                                </Pressable>
                            </MotiView>
                        ) : (
                            <View className="flex-row gap-4">
                                <Pressable
                                    onPress={() => setIsReplying(false)}
                                    className="flex-1 py-4 bg-zinc-800 rounded-full items-center"
                                >
                                    <Text className="text-zinc-300 font-medium">Cancel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleSendReply}
                                    disabled={!replyContent.trim()}
                                    className={`flex-[2] py-4 bg-white rounded-full items-center flex-row justify-center gap-2 ${!replyContent.trim() ? 'opacity-50' : ''}`}
                                >
                                    <Text className="text-black font-medium">Send</Text>
                                    <Send size={18} color="#000" />
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </MotiView>
    );
};
