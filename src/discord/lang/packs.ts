import { ping as pingEn } from './en/ping.js';
import { ping as pingFr } from './fr/ping.js';

/**
 * Every command's language pack, both locales listed side by side so adding a
 * feature here is the only place to touch - neither locale can be forgotten.
 */
export const commandPacks = {
  en: {
    commandPing: pingEn,
  },
  fr: {
    commandPing: pingFr,
  },
} as const;
