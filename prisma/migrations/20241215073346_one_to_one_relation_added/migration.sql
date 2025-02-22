/*
  Warnings:

  - You are about to drop the column `property_id` on the `contact_info` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `propertyType` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contact_info_id]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location_id]` on the table `properties` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "contact_info" DROP CONSTRAINT "contact_info_property_id_fkey";

-- DropForeignKey
ALTER TABLE "location" DROP CONSTRAINT "location_property_id_fkey";

-- DropIndex
DROP INDEX "contact_info_property_id_key";

-- DropIndex
DROP INDEX "location_property_id_key";

-- AlterTable
ALTER TABLE "contact_info" DROP COLUMN "property_id";

-- AlterTable
ALTER TABLE "location" DROP COLUMN "property_id";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyType",
ADD COLUMN     "contact_info_id" TEXT,
ADD COLUMN     "location_id" TEXT,
ADD COLUMN     "property_type" "PropertyType";

-- CreateIndex
CREATE UNIQUE INDEX "properties_contact_info_id_key" ON "properties"("contact_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_location_id_key" ON "properties"("location_id");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_contact_info_id_fkey" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
