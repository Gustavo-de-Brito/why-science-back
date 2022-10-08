import { Like } from '@prisma/client';
import prisma from '../databases/postgresSql';

async function getLikeByUserQuestionId(questionId: number, userId: number)
  :Promise<Like | null>
{
  const like:Like | null = await prisma.like.findFirst(
    {
      where: {
        userId,
        questionId
      }
    }
  );

  return like;
}

async function insert(questionId: number, userId: number) {
  await prisma.like.create({ data: { userId, questionId }});
}

async function deleteLike(likeId: number) {
  await prisma.like.delete({ where: { id: likeId }});
}

export const likeRepository = {
  getLikeByUserQuestionId,
  insert,
  deleteLike
};