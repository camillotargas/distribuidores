/*
  Warnings:

  - You are about to drop the column `data` on the `tve_manutencoes` table. All the data in the column will be lost.
  - Added the required column `data_inicio` to the `tve_manutencoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao` to the `tve_manutencoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_manutencoes" DROP COLUMN "data",
ADD COLUMN     "data_fim" DATE,
ADD COLUMN     "data_inicio" DATE NOT NULL,
ADD COLUMN     "situacao" TEXT NOT NULL,
ALTER COLUMN "km" DROP NOT NULL,
ALTER COLUMN "memorando" DROP NOT NULL;
