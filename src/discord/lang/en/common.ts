import type { CommandScope } from '@/core/permissions/index.js';
import type { LangNode } from '../types.js';

/** Cross-cutting user-facing strings */
export const commonLang = {
  permissionDenied: 'You do not have permission to use this command.',
  unexpectedError:
    'An unexpected error has occurred. The incident has been logged.',
  gateDenied: 'You do not have access to this command at the moment.',
  interactionNotAllowed: 'You cannot interact with this message.',
  scopeDenied: (scope: CommandScope): string => {
    switch (scope) {
      case 'guild':
        return 'This command can only be used on a server.';
      case 'dm':
        return 'This command can only be used in private messages.';
      case 'mainGuildOnly':
        return 'This command can only be used on the main server.';
      case 'anywhere':
        return 'This command cannot be used here.';
    }
  },
  dmFailed:
    'Your DMs are inaccessible, this command could not be executed correctly.',
  dmSuccess: 'Sent successfully to your DMs.',
} as const satisfies LangNode;
