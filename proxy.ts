import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  `${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}(.*)`,
  `${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}(.*)`,
])

/**
 * API routes enforce auth inside their own handlers so they can answer with a
 * JSON `401`. `auth.protect()` would pre-empt that with a sign-in redirect or a
 * `404`, depending on the request headers, so it is scoped to page routes.
 */
const isApiRoute = createRouteMatcher(["/api/(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !isApiRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/(api|trpc)(.*)",
  ],
}
