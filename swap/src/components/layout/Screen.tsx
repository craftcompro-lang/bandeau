import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type Props = { children: ReactNode; edges?: Edge[]; style?: StyleProp<ViewStyle>; background?: string };

/** Conteneur d'écran avec zones de sécurité (encoche, Dynamic Island). */
export function Screen({ children, edges = ['top'], style, background = colors.background }: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      <View style={[styles.root, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
