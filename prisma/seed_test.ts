import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {

  for (let index = 0; index < 40; index++) {
    const test = await prisma.template.create({
      data: {
        name: faker.animal.bear(),
        description: faker.animal.dog(),
        type: 'EXPLORE',
        userId: 'admin',
        public: true,
        userName: faker.person.fullName(),
        color: 'bg-blue-500',
        author: {
          create: {
            type: 'ADMIN',
            name: faker.person.fullName(),
          }
        },
        templateEntries: {
          createMany: {
            data: [
              {
                entry: faker.music.songName()
              },
            ]
          }
        }
      }
    })

    console.log(test)
  }

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })