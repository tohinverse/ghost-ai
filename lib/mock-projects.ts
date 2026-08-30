import type { Project } from "@/types/project"

/**
 * Placeholder project data for the dialogs and sidebar UI. Replaced by real
 * Prisma-backed queries once project persistence lands.
 */
export const MOCK_OWNED_PROJECTS: Project[] = [
  { id: "p_1", name: "Payments Platform", slug: "payments-platform", isOwner: true },
  { id: "p_2", name: "Event Pipeline", slug: "event-pipeline", isOwner: true },
  { id: "p_3", name: "Search Service", slug: "search-service", isOwner: true },
]

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "p_4", name: "Billing Rewrite", slug: "billing-rewrite", isOwner: false },
  { id: "p_5", name: "Notifications Fanout", slug: "notifications-fanout", isOwner: false },
]
