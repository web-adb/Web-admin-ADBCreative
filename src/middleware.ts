import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Definisikan rute publik
const isPublicRoute = createRouteMatcher(['/login(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // Periksa apakah rute saat ini adalah rute publik
  if (!isPublicRoute(request)) {
    // Jika bukan rute publik, lakukan proteksi
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};