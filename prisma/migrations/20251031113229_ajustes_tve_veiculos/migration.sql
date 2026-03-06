/*
  Warnings:

  - Added the required column `disponivel` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao_manutencao` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" ADD COLUMN     "disponivel" TEXT NOT NULL,
ADD COLUMN     "situacao_manutencao" TEXT NOT NULL;
