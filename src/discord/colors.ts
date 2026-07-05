export const colors = {
  default: 0x000000,
} as const;

export type EmbedColor = keyof typeof colors;
