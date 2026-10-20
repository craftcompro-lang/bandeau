import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { screenPadding, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { IconButton } from '../ui/IconButton';

type Props = { title: string; right?: ReactNode; onBack?: () => void; showBack?: boolean };

/** En-tête des écrans empilés : retour, titre centré, action optionnelle. */
export function ScreenHeader({ title, right, onBack, showBack = true }: Props) {
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack ? <IconButton icon={ChevronLeft} accessibilityLabel="Retour" onPress={goBack} /> : null}
      </View>
      <AppText variant="h3" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding - spacing.md,
  },
  side: { width: 52, alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
