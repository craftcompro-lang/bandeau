import { BellOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StateView } from '@/components/ui';
import { spacing } from '@/theme';

export default function NotificationsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Notifications" />
      <View style={styles.center}>
        <StateView
          icon={BellOff}
          tone="neutral"
          title="Aucune notification"
          message="Les propositions reçues, réponses et messages s’afficheront ici."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', paddingBottom: spacing.huge } });
