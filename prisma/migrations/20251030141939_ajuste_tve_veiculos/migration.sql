/*
  Warnings:

  - Added the required column `km_recorrencia_manutencao` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `km_ultima_manutencao` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" ADD COLUMN     "km_recorrencia_manutencao" INTEGER NOT NULL,
ADD COLUMN     "km_ultima_manutencao" INTEGER NOT NULL;
