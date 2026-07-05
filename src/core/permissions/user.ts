/** Whether a user id is the same as the owner id. */
export function isOwner(userId: string, ownerId: string): boolean {
  return ownerId === userId;
}
