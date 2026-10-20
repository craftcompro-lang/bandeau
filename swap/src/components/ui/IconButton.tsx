import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes, type ColorToken } from '@/theme';

import { PressableScale } from './PressableScale';

export type IconButtonProps = {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress: () => void;
  variant?: 'plain' | 'soft' | 'surface';
  color?: ColorToken;
  size?: number;
  badge?: boolean;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  variant = 'plain',
  color = 'ink',
  size = sizes.iconButton,
  badge = false,
  filled = false,
  style,
}: IconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      haptic="selection"
      style={style}
    >
      <View
        style={[
          styles.base,
          { width: size, height: size },
          variant === 'soft' && { backgroundColor: colors.mist },
          variant === 'surface' && [styles.surface],
        ]}
      >
        <Icon
          size={Math.round(size * 0.5)}
          color={colors[color]}
          fill={filled ? colors[color] : 'transparent'}
          strokeWidth={2}
        />
        {badge ? <View style={styles.badge} /> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  surface: {
    backgroundColor: colors.white,
    shadowColor: colors.night,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
