import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Animated, Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { motion } from '@/theme';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'selection' | false;
};

/** Zone pressable avec léger effet de compression et retour haptique. */
export function PressableScale({
  style,
  scaleTo = motion.pressScale,
  haptic = false,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  children,
  ...props
}: PressableScaleProps) {
  const [scale] = useState(() => new Animated.Value(1));
  const animate = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animate(1);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') {
          if (haptic === 'selection') void Haptics.selectionAsync();
          else
            void Haptics.impactAsync(
              haptic === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
            );
        }
        onPress?.(e);
      }}
    >
      {(state) => (
        <Animated.View style={[style, { transform: [{ scale }] }]}>
          {typeof children === 'function' ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
