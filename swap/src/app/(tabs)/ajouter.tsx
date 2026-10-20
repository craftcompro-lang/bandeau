import { Redirect } from 'expo-router';

/** L'onglet central ouvre le parcours de publication en modal (voir TabBar). */
export default function AddTab() {
  return <Redirect href="/publier" />;
}
