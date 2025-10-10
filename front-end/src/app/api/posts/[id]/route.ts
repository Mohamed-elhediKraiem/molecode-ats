import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// ====================
// PATCH : modifier un post (uniquement si c’est le sien)
// ====================
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Désormais c’est une Promise
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const userId = user.id;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return new Response("ID invalide", { status: 400 });
    }

    const { status } = await req.json();
    if (!status) {
      return new Response("Statut manquant", { status: 400 });
    }

    const existingPost = await prisma.post.findFirst({
      where: { id: postId, userId },
    });

    if (!existingPost) {
      return new Response(JSON.stringify({ error: "Non autorisé ou introuvable" }), {
        status: 404,
      });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: status.toLowerCase() },
    });

    return Response.json(updated);
  } catch (error: any) {
    console.error("💥 Erreur PATCH :", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

// ====================
// DELETE : supprimer un post (uniquement si c’est le sien)
// ====================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const userId = user.id;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return new Response("ID invalide", { status: 400 });
    }

    const existingPost = await prisma.post.findFirst({
      where: { id: postId, userId },
    });

    if (!existingPost) {
      return new Response(JSON.stringify({ error: "Non autorisé ou introuvable" }), {
        status: 404,
      });
    }

    await prisma.post.delete({ where: { id: postId } });

    return new Response(JSON.stringify({ message: "Candidature supprimée." }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ Erreur DELETE :", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
