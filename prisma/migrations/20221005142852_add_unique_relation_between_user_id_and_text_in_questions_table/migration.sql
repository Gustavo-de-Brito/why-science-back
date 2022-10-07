/*
  Warnings:

  - A unique constraint covering the columns `[text,userId]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "questions_text_userId_key" ON "questions"("text", "userId");
