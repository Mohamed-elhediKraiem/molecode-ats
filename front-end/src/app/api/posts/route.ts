import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// ====================
// GET : liste des posts de l'utilisateur connecté
// ====================
export async function GET(req: Request) {
  // ✅ Récupération de l'ID utilisateur Clerk
  const user  = await currentUser();
  

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
      { status: 401 }
    );
  }
  const userId = user.id;
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const title = searchParams.get("title") || "";
  const society = searchParams.get("society") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  // ✅ Filtrer uniquement les posts du user connecté
  const where: any = { userId };

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
// POST : ajouter un post pour l'utilisateur connecté
// ====================
export async function POST(req: Request) {
  try {
    // ✅ Authentification Clerk
    const user = await currentUser(); // 🔥 ajout du await
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
        { status: 401 }
      );
    }

    const userId = user.id;

    // ✅ Lecture du corps de la requête
    const body = await req.json();
    const { title, society, url, status } = body;

    // ✅ Validation minimale des champs
    if (!title || !society || !url) {
      return new Response(
        JSON.stringify({
          error: "Tous les champs obligatoires ne sont pas remplis.",
        }),
        { status: 400 }
      );
    }

    // ✅ Création du post associé à l'utilisateur Clerk
    const newPost = await prisma.post.create({
      data: {
        title,
        society,
        url,
        status: (status || "en attente").toLowerCase(),
        creationDate: new Date(),
        userId, // 🔥 association directe à l'utilisateur connecté
      },
    });

    // ✅ Réponse standardisée
    return Response.json({
      message: "Candidature ajoutée avec succès",
      post: newPost,
    });
  } catch (error) {
    console.error("❌ Erreur API POST /posts :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}
