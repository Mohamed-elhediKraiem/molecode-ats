import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ====================
// GET : liste des posts
// ====================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const title = searchParams.get("title") || "";
  const society = searchParams.get("society") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};

  if (title) where.title = { contains: title.toLowerCase() };
  if (society) where.society = { contains: society.toLowerCase() };
  if (status) where.status = status.toLowerCase();
  if (date) where.creationDate = new Date(date);

  const total = await prisma.post.count({ where });
  const data = await prisma.post.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { creationDate: "desc" },
  });

  return Response.json({
    data,
    meta: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  });
}

// ====================
// POST : ajouter un post
// ====================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, society, url, status } = body;

    if (!title || !society || !url) {
      return new Response(
        JSON.stringify({ error: "Tous les champs obligatoires ne sont pas remplis." }),
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        society,
        url,
        status: (status || "en attente").toLowerCase(),
        creationDate: new Date(),
      },
    });

    return Response.json({ message: "Candidature ajoutée avec succès", post: newPost });
  } catch (error) {
    console.error("❌ Erreur API POST /posts :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
