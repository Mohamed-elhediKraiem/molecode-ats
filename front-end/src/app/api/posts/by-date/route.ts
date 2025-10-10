import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Import Clerk

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // ✅ Récupération de l'utilisateur connecté via Clerk
    const user = await currentUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur non connecté." }),
        { status: 401 }
      );
    }

    const userId = user.id;

    // 🔎 Lecture des paramètres de recherche
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "";
    const society = searchParams.get("society") || "";
    const date = searchParams.get("date") || "";
    const status = searchParams.get("status") || "";

    // 🔒 Filtre incluant le userId
    const where: any = { userId };

    if (title) where.title = { contains: title.toLowerCase() };
    if (society) where.society = { contains: society.toLowerCase() };
    if (status) where.status = status.toLowerCase();
    if (date) where.creationDate = new Date(date);

    // 📊 Récupération des posts filtrés
    const posts = await prisma.post.findMany({ where });

    // Regroupement par date
    const grouped: Record<string, number> = {};
    posts.forEach((post) => {
      const isoDate = new Date(post.creationDate).toISOString().split("T")[0];
      grouped[isoDate] = (grouped[isoDate] || 0) + 1;
    });

    // Format final trié
    const result = Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    return Response.json(result);
  } catch (error) {
    console.error("❌ Erreur GET /api/posts/by-date :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}
