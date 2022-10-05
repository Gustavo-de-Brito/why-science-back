import prisma from '../databases/postgresSql';

async function clearDatabase() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`
  ]);
}

export const e2eRepository = {
  clearDatabase
};