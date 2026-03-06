/*
  Warnings:

  - Changed the type of `tipo` on the `tsi_opcoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tsi_opcoes" DROP COLUMN "tipo",
ADD COLUMN     "tipo" SMALLINT NOT NULL;
