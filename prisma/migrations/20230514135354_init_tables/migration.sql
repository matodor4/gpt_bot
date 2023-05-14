-- CreateEnum
CREATE TYPE "messageType" AS ENUM ('TEXT', 'VOICE');

-- CreateEnum
CREATE TYPE "messageFrom" AS ENUM ('USER', 'GPT');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "telegramID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "chatID" INTEGER NOT NULL,
    "type" "messageType" NOT NULL,
    "from" "messageFrom" NOT NULL,
    "deleted" BOOLEAN,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dialog" (
    "id" TEXT NOT NULL,
    "telegramID" INTEGER NOT NULL,
    "title" TEXT,
    "discription" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dialog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegramID_key" ON "user"("telegramID");

-- CreateIndex
CREATE UNIQUE INDEX "dialog_telegramID_key" ON "dialog"("telegramID");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
