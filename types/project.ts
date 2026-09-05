export interface Project {
  id: string
  name: string
  /**
   * Display-only. The project's `id` is already the slug-plus-suffix room ID,
   * so this is that ID with the generated suffix trimmed off for readability.
   */
  slug: string
  /**
   * Ownership drives which item actions are available. Owned projects can be
   * renamed and deleted; shared projects are read-only from the sidebar.
   */
  isOwner: boolean
}
