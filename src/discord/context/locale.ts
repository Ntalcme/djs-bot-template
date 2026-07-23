import { isSupportedLocale } from '@/core/types.js';
import type { SupportedLocale } from '@/core/types.js';

/** Locale used when the caller's Discord locale is unknown or unsupported. */
const DEFAULT_LOCALE: SupportedLocale = 'en';

/**
 * Map a Discord locale (an interaction's, or a guild's `preferredLocale`) to a
 * supported one, falling back to {@link DEFAULT_LOCALE}. No persistence here:
 * swap this for a per-user lookup once you add a database.
 */
export function resolveLocale(discordLocale?: string): SupportedLocale {
  const base = (discordLocale ?? '').split('-')[0] ?? '';
  return isSupportedLocale(base) ? base : DEFAULT_LOCALE;
}
