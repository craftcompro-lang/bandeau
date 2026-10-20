import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { supabaseConfig } from './env';

let client: SupabaseClient | null = null;

/**
 * Client Supabase côté app (clé publique "anon" uniquement, protégée par RLS).
 * Retourne null tant que le projet n'est pas configuré (.env.local).
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfig) return null;
  if (!client) {
    client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    // Rafraîchit la session uniquement quand l'app est au premier plan.
    AppState.addEventListener('change', (state) => {
      if (!client) return;
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });
  }
  return client;
}
