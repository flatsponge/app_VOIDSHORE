import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Button } from './Button';
import { User } from 'lucide-react-native';
import Svg, { Line, Circle as SvgCircle, G } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, withDelay, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedG = Animated.createAnimatedComponent(G);

interface CommunityStepProps {
    onNext: () => void;
}

const { width } = Dimensions.get('window');

// --- Main Component ---

export const CommunityStep: React.FC<CommunityStepProps> = ({ onNext }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 items-center justify-center bg-[#09090b] px-6 relative overflow-hidden"
            style={{ paddingTop: insets.top + 40 }}
        >

            <View className="items-center z-10 mb-12 max-w-sm">
                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="text-3xl font-serif text-white mb-4 text-center"
                >
                    Gain New Perspective.
                </MotiText>
                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 200, type: 'timing' }}
                    className="text-gray-400 font-light text-center"
                >
                    Receive wisdom from strangers who have walked your path. Zero judgment.
                </MotiText>
            </View>

            <View className="relative w-full h-[500px] items-center justify-center">
                <NetworkWeb />
            </View>

            <Button onPress={onNext} variant="glass">Enter The Shore</Button>
        </View>
    );
};

// --- Helper Components & Logic ---

const NODE_COUNT = 8; // Fewer nodes for cleaner impact
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RADIUS = SCREEN_WIDTH * 0.55; // Much larger radius to fill/bleed edges

interface Node {
    x: number;
    y: number;
    id: number;
    delay: number;
}

const NetworkWeb = () => {
    // Generate nodes in a semi-random distribution
    const nodes: Node[] = React.useMemo(() => {
        return Array.from({ length: NODE_COUNT }).map((_, i) => {
            // Use golden angle for even distribution but add some randomness
            const angle = i * 2.4 + (Math.random() * 0.5);
            // Varying distance from center, keeping away from very center (r > 100 to clear the avatar)
            const r = 100 + Math.random() * (RADIUS - 100);
            return {
                id: i,
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r,
                delay: i * 80
            };
        });
    }, []);

    // Generate connections
    const connections = React.useMemo(() => {
        const lines: { from: { x: number, y: number }, to: { x: number, y: number }, key: string, delay: number }[] = [];

        // 1. Connect Center to some nodes (not all, to look organic)
        nodes.forEach((node, i) => {
            if (Math.random() > 0.3) { // Increased chance of center connection
                lines.push({
                    from: { x: 0, y: 0 },
                    to: { x: node.x, y: node.y },
                    key: `center-${node.id}`,
                    delay: node.delay + 200
                });
            }
        });

        // 2. Inter-node connections for nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dist = Math.sqrt(Math.pow(n2.x - n1.x, 2) + Math.pow(n2.y - n1.y, 2));

                // Connect if close enough (increased distance threshold)
                if (dist < 100) {
                    lines.push({
                        from: { x: n1.x, y: n1.y },
                        to: { x: n2.x, y: n2.y },
                        key: `node-${n1.id}-${n2.id}`,
                        delay: Math.max(n1.delay, n2.delay) + 400
                    });
                }
            }
        }
        return lines;
    }, [nodes]);

    return (
        <View className="items-center justify-center h-[500px]">
            <View className="absolute inset-0 items-center justify-center pointer-events-none">
                <Svg height={RADIUS * 2 + 100} width={RADIUS * 2 + 100} style={{ overflow: 'visible' }}>
                    <G x={RADIUS + 50} y={RADIUS + 50}>
                        {/* Connecting Lines */}
                        {connections.map((line) => (
                            <ConnectionLine key={line.key} from={line.from} to={line.to} delay={line.delay} />
                        ))}

                        {/* Nodes */}
                        {nodes.map((node) => (
                            <NetworkNode key={node.id} x={node.x} y={node.y} delay={node.delay} />
                        ))}
                    </G>
                </Svg>
            </View>

            {/* Central YOU Node */}
            <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 200, type: 'spring' }}
                className="relative z-20 items-center"
            >
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg shadow-indigo-500/20">
                    <User size={28} color="#000" />
                </View>
                <Text className="absolute -bottom-8 text-[10px] font-bold uppercase tracking-widest text-white/50">You</Text>
            </MotiView>
        </View>
    );
};

const ConnectionLine = ({ from, to, delay }: { from: { x: number, y: number }, to: { x: number, y: number }, delay: number }) => {
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        opacity.value = withDelay(delay, withTiming(0.25, { duration: 1500 }));
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        strokeOpacity: opacity.value
    }));

    return (
        <AnimatedLine
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#a5b4fc"
            strokeWidth="0.5"
            animatedProps={animatedProps}
        />
    );
};

const NetworkNode = ({ x, y, delay }: { x: number, y: number, delay: number }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        scale.value = withDelay(delay, withSpring(1));
        opacity.value = withDelay(delay, withTiming(1));
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        transform: [
            { translateX: x },
            { translateY: y },
            { scale: scale.value }
        ],
        opacity: opacity.value
    }));

    return (
        <AnimatedG animatedProps={animatedProps}>
            <SvgCircle r="5" fill="#818cf8" opacity="0.9" />
            <SvgCircle r="12" fill="#818cf8" opacity="0.2" />
        </AnimatedG>
    );
};
