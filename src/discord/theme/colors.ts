/** Accent colors available to containers; extend with the bot's own palette. */
export const colors = {
  default: 0x000000,
  brand: 0x5865f2,
  success: 0x57f287,
  warning: 0xfee75c,
  cancel: 0xed4245,
} as const;

/** A named entry of {@link colors}. */
export type ColorName = keyof typeof colors;
