import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // const thirtyDaySongChallenge = await prisma.template.create({
  //   data: {
  //     name: '30 Day Song Challenge',
  //     description: '30 songs for 30 days, each one with a unique theme',
  //     type: 'EXPLORE',
  //     public: true,
  //     userId: 'Admin',
  //     userName: 'Admin',
  //     color: "bg-cyan-500 hover:bg-cyan-400",
  //     templateEntries: {
  //       createMany: {
  //         data: [
  //           {
  //             entry: 'Day 1: A song you like with a color in the title'
  //           },
  //           {
  //             entry: 'Day 2: A song you like with a number in the title'
  //           },
  //           {
  //             entry: 'Day 3: A song that reminds you of summertime'
  //           },
  //           {
  //             entry: 'Day 4: A song that reminds you of someone you’d rather forget'
  //           },
  //           {
  //             entry: 'Day 5: A song that needs to be played loudly'
  //           },
  //           {
  //             entry: 'Day 6: A song that makes you want to dance'
  //           },
  //           {
  //             entry: 'Day 7: A song to drive to'
  //           },
  //           {
  //             entry: 'Day 8: A song about drugs or alcohol'
  //           },
  //           {
  //             entry: 'Day 9: A song that makes you happy'
  //           },
  //           {
  //             entry: 'Day 10: A song that makes you sad'
  //           },
  //           {
  //             entry: 'Day 11: A song you never get tired of'
  //           },
  //           {
  //             entry: 'Day 12: A song from your pre-teen years'
  //           },
  //           {
  //             entry: 'Day 13: A song you like from the 70s'
  //           },
  //           {
  //             entry: 'Day 14: A song you’d love to be played at your wedding'
  //           },
  //           {
  //             entry: 'Day 15: A song you like that’s a cover by another artist'
  //           },
  //           {
  //             entry: 'Day 16: A song that’s a classic favorite'
  //           },
  //           {
  //             entry: 'Day 17: A song you’d sing as a duet in karaoke'
  //           },
  //           {
  //             entry: 'Day 18: A song from the year you were born'
  //           },
  //           {
  //             entry: 'Day 19: A song that makes you think about life'
  //           },
  //           {
  //             entry: 'Day 20: A song that has many meanings to you'
  //           },
  //           {
  //             entry: 'Day 21: A song you like with a person’s name in the title'
  //           },
  //           {
  //             entry: 'Day 22: A song that moves you forward'
  //           },
  //           {
  //             entry: 'Day 23: A song you think everyone should listen to'
  //           },
  //           {
  //             entry: 'Day 24: A song by a band you wish was still together'
  //           },
  //           {
  //             entry: 'Day 25: A song you like by a dead artist'
  //           },
  //           {
  //             entry: 'Day 26: A song that makes you want to fall in love'
  //           },
  //           {
  //             entry: 'Day 27: A song that breaks your heart'
  //           },
  //           {
  //             entry: 'Day 28: A song by an artist whose voice you love'
  //           },
  //           {
  //             entry: 'Day 29: A song you remember from your childhood'
  //           },
  //           {
  //             entry: 'Day 30: A song that reminds you of yourself.'
  //           }
  //         ]
  //       }
  //     }
  //   }
  // })

  const freshWater = await prisma.template.create({
    data: {
      name: 'Fresh Water',
      description: 'Simple and fresh selection for every occasion',
      type: 'EXPLORE',
      public: true,
      userId: 'Admin',
      userName: 'Admin',
      color: "bg-cyan-500 hover:bg-cyan-400",
      templateEntries: {
        createMany: {
          data: [
            {
              entry: 'A song you know every word of'
            },
            {
              entry: 'A new song you love'
            },
            {
              entry: 'A song in a different language'
            },
            {
              entry: 'A song that makes you happy'
            },
            {
              entry: 'A song that relaxes you'
            },
            {
              entry: 'A song you listen to on repeat'
            },
            {
              entry: 'A song for current mood'
            },
            {
              entry: 'A song from an underrated band'
            },
            {
              entry: 'A song that reminds you of your teens'
            }
          ]
        }
      }
    }
  })
  console.log(freshWater)
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