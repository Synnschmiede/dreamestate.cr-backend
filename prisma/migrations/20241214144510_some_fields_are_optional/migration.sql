-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "propertyType" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "overview" DROP NOT NULL,
ALTER COLUMN "propertyDetails" DROP NOT NULL;