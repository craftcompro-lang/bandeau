import { router } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { StateView } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <StateView
          icon={Compass}
          title="Page introuvable"
          message="Ce lien ne mène nulle part."
          actionLabel="Retour à l’accueil"
          onAction={() => router.replace('/')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center' } });
