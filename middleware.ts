import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define your protected pages
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/"
]);

// Webhook must ALWAYS be public
const isPublicRoute = createRouteMatcher([
  "/api/webhooks/clerk(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;   // allow webhook through
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
