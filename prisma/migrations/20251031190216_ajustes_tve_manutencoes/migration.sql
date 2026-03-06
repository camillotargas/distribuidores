/*
  Warnings:

  - Changed the type of `tipo` on the `tve_manutencoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tve_manutencoes" DROP COLUMN "tipo",
ADD COLUMN     "tipo" SMALLINT NOT NULL;
