import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MotiView } from 'moti';
import { Send, Clock, Feather, ArrowUp } from 'lucide-react-native';
import { cn } from '../utils/cn';

interface FlowEditorProps {
    onSend?: (content: string) => void;
    isDemo?: boolean;
    placeholder?: string;
    nextSendTime?: number | null;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({
    onSend,
    isDemo = false,
    placeholder = "Let your thoughts drift...",
    nextSendTime = null
}) => {
    const [content, setContent] = useState('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isSending, setIsSending] = useState(false);

    // Timer logic
    useEffect(() => {
        if (!nextSendTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const diff = nextSendTime - now;

            if (diff <= 0) {
                setTimeLeft('');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [nextSendTime]);

    const handleSend = async () => {
        if (nextSendTime && Date.now() < nextSendTime) return;
        if (!content.trim()) return;

        setIsSending(true);
        Keyboard.dismiss();

        // Allow animation to play
        await new Promise(resolve => setTimeout(resolve, 800));

        if (onSend) onSend(content);
        setContent('');
        setIsSending(false);
    };

    const getFontSize = () => {
        const len = content.length;
        if (len < 50) return 32; // text-3xl/4xl
        if (len < 100) return 24; // text-2xl/3xl
        return 20; // text-xl/2xl
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className={`flex-1 w-full relative ${isDemo ? '' : 'pt-24 pb-32'}`}>

                {/* Text Input Area */}
                <View className="flex-1 justify-center px-8 relative z-20">
                    <>
                        {!isSending ? (
                            <MotiView
                                key="input"
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, translateY: -50 }}
                                transition={{ type: 'timing', duration: 500 }}
                                className="w-full"
                            >
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder={placeholder}
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    multiline
                                    style={{
                                        fontFamily: 'serif', // Ensure serif font is loaded or use system serif
                                        fontSize: getFontSize(),
                                        color: '#f4f4f5', // zinc-100
                                        textAlign: 'center',
                                        minHeight: 60,
                                        maxHeight: '60%'
                                    }}
                                    selectionColor="rgba(99, 102, 241, 0.3)"
                                />
                            </MotiView>
                        ) : (
                            <MotiView
                                key="sending"
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="items-center justify-center gap-4"
                            >
                                <MotiView
                                    from={{ translateY: 0, opacity: 1 }}
                                    animate={{ translateY: -100, opacity: 0 }}
                                    transition={{ type: 'timing', duration: 1500 }}
                                >
                                    <Text className="font-serif italic text-2xl text-zinc-500">
                                        Drifting away...
                                    </Text>
                                </MotiView>
                            </MotiView>
                        )}
                    </>
                </View>

                {/* Controls Area */}
                {!isDemo && !isSending && (
                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 flex items-center justify-end gap-6 z-30">

                        {/* Context/Timer */}
                        <View className="h-8 items-center justify-center">
                            <>
                                {timeLeft ? (
                                    <MotiView
                                        key="timer"
                                        from={{ opacity: 0, translateY: 10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        exit={{ opacity: 0, translateY: -10 }}
                                        className="flex-row items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full"
                                    >
                                        <Clock size={12} color="#71717a" />
                                        <Text className="text-zinc-500 font-mono text-xs">{timeLeft}</Text>
                                    </MotiView>
                                ) : content.length === 0 ? (
                                    <MotiView
                                        key="hint"
                                        from={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-row items-center gap-2"
                                    >
                                        <Feather size={12} color="#52525b" />
                                        <Text className="text-zinc-600 text-xs font-medium tracking-widest uppercase">Unburden your mind</Text>
                                    </MotiView>
                                ) : null}
                            </>
                        </View>

                        {/* Main Action Button */}
                        <View className="h-16 items-center justify-center">
                            <>
                                {content.trim().length > 0 && !timeLeft && (
                                    <MotiView
                                        key="send"
                                        from={{ opacity: 0, scale: 0.8, translateY: 20 }}
                                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, translateY: 10 }}
                                    >
                                        <Pressable
                                            onPress={handleSend}
                                            className="flex-row items-center gap-3 bg-white pl-6 pr-5 py-3 rounded-full shadow-lg active:scale-95 transition-all"
                                        >
                                            <Text className="font-medium text-lg tracking-wide text-black">Drift</Text>
                                            <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                                                <ArrowUp size={16} color="white" />
                                            </View>
                                        </Pressable>
                                    </MotiView>
                                )}
                            </>
                        </View>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};
