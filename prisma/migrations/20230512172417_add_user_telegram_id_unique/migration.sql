/*
  Warnings:

  - A unique constraint covering the columns `[telegramID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_telegramID_key" ON "User"("telegramID");
