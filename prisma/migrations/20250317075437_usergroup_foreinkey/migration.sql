/*
  Warnings:

  - You are about to drop the column `userId` on the `UserGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userGroupId" INTEGER;

-- AlterTable
ALTER TABLE "UserGroup" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete_perm" BOOLEAN,
ADD COLUMN     "edit_perm" BOOLEAN,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_perm" BOOLEAN,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "write_perm" BOOLEAN;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "UserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
