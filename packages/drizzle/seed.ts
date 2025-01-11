/*import { db } from './db'
import { pokemon } from './schemas'

async function seed() {
  let insertedCompany

  const insertedCompanies = await db
    .insert(pokemon)
    .values({
      id:1,
      name: 'Rocketseat',
      type: 'rocketseat.team',
    })
    .onConflictDoNothing()
    .returning()

  if (insertedCompanies.length > 0) {
    insertedCompany = insertedCompanies[0]
  }

  if (!insertedCompany) {
    insertedCompany = await db.query.name.findFirst({
      where(fields, { eq }) {
        return eq(fields.domain, 'rocketseat.team')
      },
    })
  }

  if (insertedCompany) {
    await db
      .insert(pokemon)
      .values({
        id:2,
        name: 'Admin',
        type:'333'
      })
      .onConflictDoNothing()
  }
}

seed()
*/