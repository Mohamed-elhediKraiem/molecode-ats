import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import csv from 'csv-parser'

const prisma = new PrismaClient()

async function main() {
  const results: any[] = []

  fs.createReadStream('RécapRecherche.csv')
    .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => {
      // Nettoyage des valeurss
      const cleaned: any = {}
      for (const key in data) {
        cleaned[key] = data[key]?.trim()
      }
      if (cleaned['Titre du poste']) {
        results.push(cleaned)
      }
    })
    .on('end', async () => {
      try {
        // ⚠️ Supprimer tous les anciens enregistrements avant l'import
        await prisma.post.deleteMany({})
        console.log("🗑️ Table Post vidée")

        for (const row of results) {
          try {
            await prisma.post.create({
              data: {
                title: row['Titre du poste'],
                society: row['Entreprise'],
                url: row['Url'],
                status: row['Reponse'],
                creationDate: new Date(
                  row['Date creation'].split('/').reverse().join('-')
                ),
              },
            })
            console.log(`✅ Ajouté: ${row['Titre du poste']}`)
          } catch (e) {
            console.error(`❌ Erreur avec ${row['Titre du poste']}:`, e)
          }
        }
      } finally {
        await prisma.$disconnect()
      }
    })
}

main()
