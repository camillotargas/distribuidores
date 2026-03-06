/*
  Warnings:

  - Changed the type of `situacao` on the `tve_manutencoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tve_manutencoes" DROP COLUMN "situacao",
ADD COLUMN     "situacao" SMALLINT NOT NULL;
