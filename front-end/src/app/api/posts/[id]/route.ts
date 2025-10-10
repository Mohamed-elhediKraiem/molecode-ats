import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"; // ✅ pour récupérer userId

const prisma = new PrismaClient();

// ====================
// PATCH : modifier un post (uniquement si c’est le sien)
// ====================
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Authentification Clerk
    const { userId } = auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      console.error("❌ ID invalide :", params.id);
      return new Response("ID invalide", { status: 400 });
    }

    const { status } = await req.json();
    if (!status) {
      return new Response("Statut manquant", { status: 400 });
    }

    // ✅ Vérifier que le post appartient à l’utilisateur connecté
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return new Response(
        JSON.stringify({ error: "Candidature introuvable" }),
        { status: 404 }
      );
    }

    if (existingPost.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "Accès refusé — ce post ne vous appartient pas." }),
        { status: 403 }
      );
    }

    // ✅ Mise à jour du statut
    const updated = await prisma.post.update({
      where: { id },
      data: { status: status.toLowerCase() },
    });

    return Response.json(updated);
  } catch (error: any) {
    console.error("💥 Erreur lors du PATCH :", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// ====================
// DELETE : supprimer un post (uniquement si c’est le sien)
// ====================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // ✅ Authentification Clerk
    const { userId } = auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Non autorisé — utilisateur manquant." }),
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new Response("ID invalide", { status: 400 });
    }

    // ✅ Vérifier que le post appartient à l’utilisateur
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return new Response(
        JSON.stringify({ error: "Candidature introuvable" }),
        { status: 404 }
      );
    }

    if (existingPost.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "Accès refusé — ce post ne vous appartient pas." }),
        { status: 403 }
      );
    }

    await prisma.post.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "Candidature supprimée avec succès" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur DELETE /posts/[id] :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
}
