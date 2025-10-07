import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ====================
// PATCH : modifier un post
// ====================
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      console.error("❌ ID invalide :", params.id);
      return new Response("ID invalide", { status: 400 });
    }

    const { status } = await req.json();
    if (!status) {
      console.error("❌ Statut manquant dans le corps de la requête");
      return new Response("Statut manquant", { status: 400 });
    }

    console.log("🔧 Mise à jour du statut :", { id, status });

    const updated = await prisma.post.update({
      where: { id },
      data: { status: status.toLowerCase() },
    });

    console.log("✅ Statut mis à jour avec succès :", updated);
    return Response.json(updated);
  } catch (error: any) {
    console.error("💥 Erreur lors du PATCH :", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// ====================
// DELETE : supprimer un post
// ====================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      console.error("❌ ID invalide :", params.id);
      return new Response("ID invalide", { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return new Response(JSON.stringify({ error: "Candidature introuvable" }), { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    return new Response(JSON.stringify({ message: "Candidature supprimée avec succès" }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Erreur DELETE /posts/[id] :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
