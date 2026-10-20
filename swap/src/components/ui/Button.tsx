import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes, spacing, type ColorToken } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'exchange' | 'secondary' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * - primary  : violet — fonctionnalités principales
 * - exchange : corail — actions liées à l'échange
 * - secondary: contour bleu nuit — action secondaire
 */
const variantStyles: Record<Variant, { bg: string; pressed: string; border?: string; text: ColorToken }> = {
  primary: { bg: colors.violet, pressed: colors.violetPressed, text: 'white' },
  exchange: { bg: colors.coralStrong, pressed: colors.coralPressed, text: 'white' },
  secondary: { bg: colors.white, pressed: colors.mist, border: colors.borderStrong, text: 'ink' },
  ghost: { bg: 'transparent', pressed: colors.mist, text: 'violet' },
  danger: { bg: colors.white, pressed: colors.dangerSoft, border: colors.borderStrong, text: 'danger' },
};

const heights: Record<Size, number> = { lg: sizes.buttonLg, md: sizes.buttonMd, sm: sizes.buttonSm };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityHint,
  style,
}: ButtonProps) {
  const v = variantStyles[variant];
  const inactive = disabled || loading;
  const textColor: ColorToken = inactive ? 'inkSecondary' : v.text;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      haptic={variant === 'exchange' || variant === 'primary' ? 'light' : false}
      style={[fullWidth && styles.fullWidth, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            {
              height: heights[size],
              paddingHorizontal: size === 'sm' ? spacing.md : spacing.xl,
              backgroundColor: inactive ? colors.mist : pressed ? v.pressed : v.bg,
              borderColor: inactive ? colors.border : (v.border ?? 'transparent'),
              borderWidth: v.border || inactive ? 1 : 0,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.inkSecondary} />
          ) : (
            <>
              {Icon ? (
                <Icon size={size === 'sm' ? 16 : 20} color={colors[textColor]} strokeWidth={2.2} />
              ) : null}
              <AppText
                variant={size === 'sm' ? 'buttonSmall' : 'button'}
                color={textColor}
                numberOfLines={1}
              >
                {label}
              </AppText>
            </>
          )}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fullWidth: { alignSelf: 'stretch' },
  base: {
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
