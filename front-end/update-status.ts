import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dictionnaire de normalisation
const statusMap: Record<string, string> = {
  "refus": "Refusé",
  "refuse": "Refusé",
  "refusé": "Refusé",

  "en attente": "En attente",
  "attente": "En attente",

  "acceptée": "Accepté",
  "acceptées": "Accepté",
  "accepté": "Accepté",
};

async function main() {
  try {
    let totalUpdated = 0;

    for (const [badStatus, normalized] of Object.entries(statusMap)) {
      const result = await prisma.post.updateMany({
        where: {
          status: {
            equals: badStatus,
          },
        },
        data: {
          status: normalized,
        },
      });

      if (result.count > 0) {
        console.log(`🔄 ${result.count} lignes corrigées : "${badStatus}" → "${normalized}"`);
        totalUpdated += result.count;
      }
    }

    console.log(`\n✅ Total corrigé : ${totalUpdated} lignes`);
  } catch (error) {
    console.error("❌ Erreur lors de la normalisation :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
