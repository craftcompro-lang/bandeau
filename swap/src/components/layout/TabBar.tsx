import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { router } from 'expo-router';
import { House, MessageCircle, Plus, Search, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, shadows, sizes, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Accueil', icon: House },
  explorer: { label: 'Explorer', icon: Search },
  ajouter: { label: 'Publier', icon: Plus },
  messages: { label: 'Messages', icon: MessageCircle },
  profil: { label: 'Profil', icon: User },
};

/** Barre d'onglets SWAP : 4 onglets + bouton central « Publier » mis en évidence. */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]} role="tablist">
      {state.routes.map((route, index) => {
        const config = TABS[route.name];
        if (!config) return null;
        const focused = index === state.index;

        if (route.name === 'ajouter') {
          return (
            <View key={route.key} style={styles.item}>
              <PressableScale
                onPress={() => router.push('/publier')}
                haptic="medium"
                accessibilityRole="button"
                accessibilityLabel="Publier un objet"
                style={styles.addButton}
              >
                <Plus size={26} color={colors.white} strokeWidth={2.6} />
              </PressableScale>
            </View>
          );
        }

        const Icon = config.icon;
        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            role="tab"
            accessibilityRole="tab"
            accessibilityLabel={config.label}
            accessibilityState={{ selected: focused }}
            style={styles.item}
          >
            <Icon size={sizes.icon} color={focused ? colors.violet : colors.inkTertiary} strokeWidth={focused ? 2.4 : 2} />
            <AppText variant="micro" color={focused ? 'violet' : 'inkTertiary'} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              {config.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderStrong,
    paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 48 },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.coralStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing.lg,
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.coralGlow,
  },
});
