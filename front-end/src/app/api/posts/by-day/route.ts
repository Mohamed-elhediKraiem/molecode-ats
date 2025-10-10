import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Import Clerk pour authentifier l’utilisateur

const prisma = new PrismaClient();

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

// Helper pour convertir une date JS en jour de la semaine (Lundi=0)
function getDayName(date: Date) {
  const index = (date.getDay() + 6) % 7; // Décale pour que Lundi soit le premier
  return daysOfWeek[index];
}

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

    // 🔍 Lecture des paramètres
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title")?.toLowerCase() || "";
    const society = searchParams.get("society")?.toLowerCase() || "";
    const date = searchParams.get("date") || "";
    const status = searchParams.get("status")?.toLowerCase() || "";

    // 🔒 Filtrage avec userId
    const where: any = { userId };

    if (title) where.title = { contains: title };
    if (society) where.society = { contains: society };
    if (status) where.status = { equals: status };
    if (date) where.creationDate = new Date(date);

    // 📊 Récupération des candidatures filtrées
    const posts = await prisma.post.findMany({
      where,
      select: { creationDate: true },
    });

    // 📅 Comptage par jour de la semaine
    const grouped: Record<string, number> = {};
    posts.forEach((p) => {
      const day = getDayName(p.creationDate);
      grouped[day] = (grouped[day] || 0) + 1;
    });

    // 🔁 Structuration pour affichage du chart
    const chartData = daysOfWeek.map((day) => ({
      name: day,
      value: grouped[day] || 0,
    }));

    // ✅ Réponse finale
    return Response.json({
      total: posts.length,
      data: chartData,
    });
  } catch (error) {
    console.error("❌ Erreur GET /api/posts/by-day :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}
