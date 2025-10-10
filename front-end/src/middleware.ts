import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * 🔐 Middleware d’authentification Clerk
 * Protège toutes les routes sauf :
 *   - /
 *   - /sign-in*
 *   - /sign-up*
 * Tu peux personnaliser les routes protégées via `isProtectedRoute`.
 */

// ✅ Liste des routes protégées (toutes sauf publicRoutes)
const isProtectedRoute = createRouteMatcher([
  "/(dashboard)(.*)",
  "/(forum)(.*)",
  "/(profile)(.*)",
  "/(settings)(.*)",
  "/(api)(.*)", // protège aussi tes routes API
]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth();

  // 🧠 Si la route est protégée et l’utilisateur non connecté → redirection
  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // Sinon, on laisse passer la requête
});

/**
 * 🧩 Matcher :
 * - Ignore les fichiers internes (_next, assets…)
 * - Toujours actif sur les routes API/TRPC
 */
export const config = {
  matcher: [
    // ⛔ Ignorer fichiers statiques et internes de Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // ✅ Toujours exécuter le middleware pour les routes API ou tRPC
    "/(api|trpc)(.*)",
  ],
};
