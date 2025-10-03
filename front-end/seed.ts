import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Normalisation des statuts...");

  // Mettre à jour tous les "Refus" -> "refusé"
  const result = await prisma.post.updateMany({
    where: { status: "Refus" },
    data: { status: "refusé" },
  });

  console.log(`✅ ${result.count} lignes mises à jour`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
