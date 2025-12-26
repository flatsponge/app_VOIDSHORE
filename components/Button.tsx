import React from 'react';
import { View, Text, Pressable, PressableProps, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { cn } from '../utils/cn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  delay?: number;
  secondaryAction?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth = true,
  className = '',
  delay = 0,
  secondaryAction,
  variant = 'primary',
  onPress,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  const getBg = () => {
    switch (variant) {
      case 'glass': return 'bg-white/10 border border-white/10';
      case 'secondary': return 'bg-zinc-800';
      default: return 'bg-white';
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case 'glass': return 'text-white';
      case 'secondary': return 'text-white';
      default: return 'text-black';
    }
  }

  return (
    <View
      className="absolute left-0 right-0 px-6 z-50 flex flex-col items-center gap-4"
      pointerEvents="box-none"
      style={{ bottom: insets.bottom + 16 }}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: delay * 1000,
        }}
        className={fullWidth ? 'w-full' : ''}
      >
        <Pressable
          onPress={onPress}
          className={`${getBg()} py-4 rounded-2xl shadow-sm active:opacity-90 active:scale-95 items-center justify-center overflow-hidden relative ${className}`}
          {...props}
        >
          {variant === 'glass' && (
            <BlurView
              intensity={20}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          )}
          <Text className={`${getTextColor()} font-medium text-lg relative z-10`}>
            {children}
          </Text>
        </Pressable>
      </MotiView>

      {secondaryAction && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (delay + 0.2) * 1000, type: 'timing', duration: 600 }}
          pointerEvents="auto"
        >
          {secondaryAction}
        </MotiView>
      )}
    </View>
  );
};
