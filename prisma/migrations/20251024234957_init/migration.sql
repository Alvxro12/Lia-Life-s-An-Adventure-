/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Progress" DROP CONSTRAINT "Progress_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_boardId_fkey";

-- DropTable
DROP TABLE "public"."Board";

-- DropTable
DROP TABLE "public"."Progress";

-- DropTable
DROP TABLE "public"."Task";

-- DropTable
DROP TABLE "public"."User";
