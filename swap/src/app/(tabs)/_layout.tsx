import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/layout/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="explorer" options={{ title: 'Explorer' }} />
      <Tabs.Screen name="ajouter" options={{ title: 'Publier' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
