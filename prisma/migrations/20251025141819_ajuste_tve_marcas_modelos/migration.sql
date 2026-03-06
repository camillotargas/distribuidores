/*
  Warnings:

  - You are about to drop the column `tsiClienteSistemaId` on the `tve_marcas_modelos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tve_marcas_modelos" DROP CONSTRAINT "tve_marcas_modelos_tsiClienteSistemaId_fkey";

-- AlterTable
ALTER TABLE "tve_marcas_modelos" DROP COLUMN "tsiClienteSistemaId";
