import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.deleteMany({ where: { username: 'foo' } });
  await prisma.user.deleteMany({ where: { username: 'bar' } });

  await prisma.user.create({
    data: {
      name: 'Foo',
      username: 'foo',
      password: 'foo123456',
      posts: {
        createMany: {
          data: [
            {
              content: 'Test content Foo 1',
            },
            {
              content: 'Test content Foo 2',
            },
            {
              content: 'Test content Foo 3',
            },
          ],
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Bar',
      username: 'bar',
      password: 'bar123456',
      posts: {
        createMany: {
          data: [
            {
              content: 'Test content Bar 1',
            },
            {
              content: 'Test content Bar 2',
            },
            {
              content: 'Test content Bar 3',
            },
            {
              content: 'Test content Bar 4',
            },
          ],
        },
      },
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
