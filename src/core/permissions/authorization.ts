import { isOwner } from './user.js';

/** Who is allowed to run a command. */
export type Authorization = 'everyone' | 'owner';

export interface AuthorizationContext {
  readonly userId: string;
  readonly ownerId: string;
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
      return isOwner(context.userId, context.ownerId);
  }
}
