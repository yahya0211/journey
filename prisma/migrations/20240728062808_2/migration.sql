/*
  Warnings:

  - A unique constraint covering the columns `[journeyId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_journeyId_key" ON "Bookmark"("journeyId");
