/*
  Warnings:

  - You are about to drop the column `profile_pic_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_profile_pic_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_pic_id",
ADD COLUMN     "profile_pic" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "cloud_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
