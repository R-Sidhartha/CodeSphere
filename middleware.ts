import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/(.*)",
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "question/:id(.*)",
  "/tags(.*)",
  "/tags/:id(.*)",
  "/profile/:id(.*)",
  "/community(.*)",
  "/jobs(.*)",
]);

// const isignoredRoute = createRouteMatcher(["/api/webhooks", "/api/chatgpt"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return; // if it's a public route, do nothing
  await auth.protect(); // for any other route, require auth
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
