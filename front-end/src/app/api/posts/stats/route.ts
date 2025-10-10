import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Import Clerk

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // ✅ Vérification de l'utilisateur connecté
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur non connecté." }),
        { status: 401 }
      );
    }

    const userId = user.id; // Identifiant unique Clerk

    // 🔍 Récupération des filtres depuis l'URL
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get("title") || "").toLowerCase();
    const society = (searchParams.get("society") || "").toLowerCase();
    const date = searchParams.get("date") || "";
    const status = (searchParams.get("status") || "").toLowerCase();

    // 🧩 Construction dynamique du filtre Prisma (filtrage côté base)
    const where: any = { userId }; // 🔒 On limite aux posts de l’utilisateur connecté

    if (title) where.title = { contains: title };
    if (society) where.society = { contains: society };
    if (status) where.status = status;
    if (date) where.creationDate = new Date(date);

    // 📦 Récupération des posts filtrés directement via Prisma
    const posts = await prisma.post.findMany({ where });

    // 📊 Calcul des KPI sur les résultats filtrés
    const total = posts.length;
    const enAttente = posts.filter(
      (p) => p.status?.toLowerCase() === "en attente"
    ).length;
    const accepte = posts.filter(
      (p) => p.status?.toLowerCase() === "accepté"
    ).length;
    const refuse = posts.filter((p) =>
      ["refus", "refusé"].includes(p.status?.toLowerCase())
    ).length;

    // ✅ Réponse JSON structurée
    return Response.json({ total, enAttente, accepte, refuse });
  } catch (error) {
    console.error("❌ Erreur GET /api/posts/stats :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}
