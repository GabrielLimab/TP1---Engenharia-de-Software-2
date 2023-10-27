import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt';

const prisma = new PrismaClient()

async function run() {
  await prisma.user.deleteMany();
  
  const firstUserId = '0730ffac-d039-4194-9571-01aa2aa0efbd';
  const secondUserId = '00880d75-a933-4fef-94ab-e05744435297';

  const firstPassword = await hash('123Seguro&', 10);
  const secondPassword = await hash('123Seguro&', 10);
  /**
   * Create user
   */
  await Promise.all([
    prisma.user.create({
      data: {
        id: firstUserId,
        name: 'Gabriel Lima Barros',
        email: 'lima@gmail.com',
        username: 'gabriellimab',
        password: firstPassword,
        picture: {
          create: {
            picture_url: 'default.png',
            profile_picture: true,
          },
        }
      }
    }),

    prisma.user.create({
      data: {
        id: secondUserId,
        name: 'Gabriel Teixeira Carvalho',
        email: 'teixeira@gmail.com',
        username: 'gteixeirac',
        password: secondPassword,
        picture: {
          create: {
            picture_url: 'default.png',
            profile_picture: true,
          },
        }
      }
    })
  ]);
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })