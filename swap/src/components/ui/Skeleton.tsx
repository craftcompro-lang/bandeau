import { useEffect, useState } from 'react';
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/theme';

type Props = { width?: DimensionValue; height: DimensionValue; radius?: number; style?: StyleProp<ViewStyle> };

/** Bloc de chargement à pulsation discrète. */
export function Skeleton({ width = '100%', height, radius = radii.sm, style }: Props) {
  const [opacity] = useState(() => new Animated.Value(0.55));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.mist, opacity }, style]}
    />
  );
}
