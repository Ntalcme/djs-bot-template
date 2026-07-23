export const SUPPORTED_LOCALES = ['en', 'fr'] as const;

/** A language the bot can reply in. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Whether `value` is one of `values`; absorbs the widening every string guard needs. */
export function isOneOf<T extends string>(
  values: readonly T[],
  value: string,
): value is T {
  return (values as readonly string[]).includes(value);
}

/** Narrow an arbitrary string to a {@link SupportedLocale}. */
export function isSupportedLocale(value: string): value is SupportedLocale {
  return isOneOf(SUPPORTED_LOCALES, value);
}
