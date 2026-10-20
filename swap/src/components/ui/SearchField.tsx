import { Search, X } from 'lucide-react-native';
import type { Ref } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fontFamily, radii, sizes, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = Omit<TextInputProps, 'style' | 'ref'> & {
  onClear?: () => void;
  ref?: Ref<TextInputInstance>;
};

/** Champ de recherche éditable. */
export function SearchField({ value, onClear, ref, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Search size={sizes.iconSm} color={colors.inkTertiary} strokeWidth={2.2} />
      <TextInput
        ref={ref}
        value={value}
        placeholderTextColor={colors.inkTertiary}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        maxFontSizeMultiplier={1.3}
        accessibilityLabel={props.placeholder ?? 'Rechercher'}
        {...props}
        style={styles.input}
      />
      {value && onClear ? (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
          hitSlop={10}
          style={styles.clear}
        >
          <X size={14} color={colors.white} strokeWidth={3} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Variante non éditable qui ouvre l'écran de recherche (Accueil). */
export function SearchLauncher({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.container, pressed && { backgroundColor: colors.border }]}
    >
      <Search size={sizes.iconSm} color={colors.inkTertiary} strokeWidth={2.2} />
      <AppText variant="callout" color="inkTertiary" numberOfLines={1} style={styles.launcherText}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: sizes.input,
    borderRadius: radii.pill,
    backgroundColor: colors.mist,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.ink,
    padding: 0,
  },
  launcherText: { flex: 1 },
  clear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.inkTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
