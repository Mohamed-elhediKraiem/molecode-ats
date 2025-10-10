import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server"; // ✅ récupération du user Clerk

const prisma = new PrismaClient();

// ====================
// PATCH : modifier un post (uniquement si c’est le sien)
// ====================
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Authentification Clerk
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
        { status: 401 }
      );
    }

    const userId = user.id;
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return new Response("ID invalide", { status: 400 });
    }

    const { status } = await req.json();
    if (!status) {
      return new Response("Statut manquant", { status: 400 });
    }

    // ✅ Vérification directe avec Prisma (userId + id)
    const existingPost = await prisma.post.findFirst({
      where: { id, userId },
    });

    if (!existingPost) {
      return new Response(
        JSON.stringify({
          error: "Candidature introuvable ou non autorisée.",
        }),
        { status: 404 }
      );
    }

    // ✅ Mise à jour du statut uniquement si le post appartient au user
    const updated = await prisma.post.update({
      where: { id },
      data: { status: status.toLowerCase() },
    });

    return Response.json(updated);
  } catch (error: any) {
    console.error("💥 Erreur lors du PATCH :", error);
    return new Response(
      JSON.stringify({ message: error.message || "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// ====================
// DELETE : supprimer un post (uniquement si c’est le sien)
// ====================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Authentification Clerk
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
        { status: 401 }
      );
    }

    const userId = user.id;
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return new Response("ID invalide", { status: 400 });
    }

    // ✅ Vérification directe que le post appartient au user connecté
    const existingPost = await prisma.post.findFirst({
      where: { id, userId },
    });

    if (!existingPost) {
      return new Response(
        JSON.stringify({
          error: "Candidature introuvable ou non autorisée.",
        }),
        { status: 404 }
      );
    }

    await prisma.post.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "Candidature supprimée avec succès." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur DELETE /posts/[id] :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
