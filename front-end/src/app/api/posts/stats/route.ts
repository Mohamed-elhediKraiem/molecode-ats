import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") || "").toLowerCase();
  const society = (searchParams.get("society") || "").toLowerCase();
  const date = searchParams.get("date") || "";
  const status = (searchParams.get("status") || "").toLowerCase();

  // Récupère tous les posts
  let posts = await prisma.post.findMany();

  // Applique les filtres 
  if (title) {
    posts = posts.filter((p) => p.title?.toLowerCase().includes(title));
  }
  if (society) {
    posts = posts.filter((p) => p.society?.toLowerCase().includes(society));
  }
  if (date) {
    const filterDate = new Date(date).toDateString();
    posts = posts.filter(
      (p) => new Date(p.creationDate).toDateString() === filterDate
    );
  }
  if (status) {
    posts = posts.filter((p) => p.status?.toLowerCase() === status);
  }

  // Calcul des KPI sur les résultats filtrés
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

  return Response.json({ total, enAttente, accepte, refuse });
}
