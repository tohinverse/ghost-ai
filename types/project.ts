export interface Project {
  id: string
  name: string
  slug: string
  /**
   * Ownership drives which item actions are available. Owned projects can be
   * renamed and deleted; shared projects are read-only from the sidebar.
   */
  isOwner: boolean
}
