import { z } from 'zod';

/**
 * Variables publiques (EXPO_PUBLIC_*) — embarquées dans l'app, donc jamais secrètes.
 * Les clés secrètes (service_role, Stripe secret...) restent côté serveur.
 */
const envSchema = z.object({
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().min(20).optional(),
  dataMode: z.enum(['demo', 'live']).optional(),
});

const parsed = envSchema.safeParse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || undefined,
  dataMode: process.env.EXPO_PUBLIC_DATA_MODE || undefined,
});

if (!parsed.success && __DEV__) {
  console.warn('[env] Variables EXPO_PUBLIC_* invalides :', parsed.error.issues.map((i) => i.path.join('.')));
}

const env = parsed.success ? parsed.data : {};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/**
 * "demo" : annonces fictives signalées à l'écran (développement).
 * "live" : vraies données Supabase (activé en phase 2).
 * Les données fictives ne sont jamais mélangées aux données réelles.
 */
export const dataMode: 'demo' | 'live' = env.dataMode ?? (isSupabaseConfigured ? 'live' : 'demo');

export const supabaseConfig = isSupabaseConfigured
  ? { url: env.supabaseUrl as string, anonKey: env.supabaseAnonKey as string }
  : null;
