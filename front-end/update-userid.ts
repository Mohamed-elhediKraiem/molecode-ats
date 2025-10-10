// scripts/updateUserId.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🧩 Remplace ici par ton userId Clerk
  const userId = "user_33rtvM5sHNTI6O9FwDmNmgeOi9w";

  if (!userId) {
    console.error("❌ Aucun userId fourni !");
    process.exit(1);
  }

  console.log("🔄 Mise à jour de tous les posts avec userId =", userId);

  // Récupère tous les posts existants
  const posts = await prisma.post.findMany();
  console.log(`🗂️ ${posts.length} posts trouvés.`);

  // Mets à jour chaque post
  for (const post of posts) {
    await prisma.post.update({
      where: { id: post.id },
      data: { userId },
    });
  }

  console.log("✅ Tous les posts ont été mis à jour avec succès !");
}

main()
  .catch((error) => {
    console.error("💥 Erreur lors de la mise à jour :", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
