import { isOwner } from './user.js';

/**
 * Who is allowed to run a command. Swap this union for an ordered rank scale
 * (comparing levels here) once the bot grows several privilege tiers.
 */
export type Authorization = 'everyone' | 'owner';

/** The per-user facts an authorization check reads. */
export interface AuthorizationContext {
  /** The invoking user's Discord id. */
  readonly userId: string;
}

/** Whether the invoking user satisfies the command's authorization level. */
export function isAuthorized(
  authorization: Authorization,
  context: AuthorizationContext,
): boolean {
  switch (authorization) {
    case 'everyone':
      return true;
    case 'owner':
      return isOwner(context.userId);
  }
}
