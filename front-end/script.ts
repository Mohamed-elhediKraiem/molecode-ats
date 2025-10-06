import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const results: any[] = [];

  fs.createReadStream('RécapRecherche.csv')
    .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => {
      // Nettoyage des valeurs
      const cleaned: any = {};
      for (const key in data) {
        cleaned[key] = data[key]?.trim();
      }
      if (cleaned['Titre du poste']) {
        results.push(cleaned);
      }
    })
    .on('end', async () => {
      try {
        // ⚠️ Supprimer tous les anciens enregistrements avant l'import
        await prisma.post.deleteMany({});
        console.log('🗑️ Table Post vidée');

        for (const row of results) {
          try {
            // Normalisation du statut
            let status = row['Reponse']?.trim().toLowerCase() || '';

            // Harmonisation des variations possibles
            if (status.includes('refus')) status = 'refusé';
            if (status.includes('attente')) status = 'en attente';
            if (status.includes('accept')) status = 'accepté';

            await prisma.post.create({
              data: {
                title: row['Titre du poste'],
                society: row['Entreprise'],
                url: row['Url'],
                status,
                creationDate: new Date(
                  row['Date creation'].split('/').reverse().join('-')
                ),
              },
            });

            console.log(`✅ Ajouté: ${row['Titre du poste']} (${status})`);
          } catch (e) {
            console.error(`❌ Erreur avec ${row['Titre du poste']}:`, e);
          }
        }
      } finally {
        await prisma.$disconnect();
        console.log('🏁 Import terminé et connexion Prisma fermée');
      }
    });
}

main();
