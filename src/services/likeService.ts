import { Like } from "@prisma/client";
import { likeRepository } from "../repositories/likeRepository";

async function findLike(questionId: number, userId: number)
  :Promise<Like | null>
{
  const like:Like | null = await likeRepository.getLikeByUserQuestionId(
    questionId, userId
  );

  return like;
}

async function addLike(questionId: number, userId: number) {
  await likeRepository.insert(questionId, userId)
}

async function removeLike(likeId: number) {
  await likeRepository.deleteLike(likeId);
}

export const likeService = {
  findLike,
  addLike,
  removeLike
};