/**
 * A collaborator as the share dialog renders it: the stored row plus whatever
 * Clerk knows about that email. `name` and `imageUrl` are `null` when no Clerk
 * account matches, in which case the email is all there is to show.
 */
export interface Collaborator {
  id: string
  email: string
  name: string | null
  imageUrl: string | null
}
