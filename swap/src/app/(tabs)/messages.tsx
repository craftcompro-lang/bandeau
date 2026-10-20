import { MessageCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, StateView } from '@/components/ui';
import { screenPadding, spacing } from '@/theme';

export default function MessagesScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1" accessibilityRole="header">
          Messages
        </AppText>
      </View>
      <View style={styles.center}>
        <StateView
          icon={MessageCircle}
          title="Aucune conversation"
          message="Tes discussions liées aux échanges apparaîtront ici. La messagerie sera activée avec les comptes utilisateurs."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: screenPadding, paddingTop: spacing.md },
  center: { flex: 1, justifyContent: 'center', paddingBottom: spacing.huge },
});
