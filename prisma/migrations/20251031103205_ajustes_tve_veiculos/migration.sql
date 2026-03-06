/*
  Warnings:

  - You are about to drop the column `km_proxima_manutencao` on the `tve_veiculos` table. All the data in the column will be lost.
  - You are about to drop the column `km_recorrencia_manutencao` on the `tve_veiculos` table. All the data in the column will be lost.
  - You are about to drop the column `km_ultima_manutencao` on the `tve_veiculos` table. All the data in the column will be lost.
  - Added the required column `data_proxima_manutencao_preventiva` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dia_recorrencia_manutencao_preventiva` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `km_proxima_manutencao_preventiva` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `km_recorrencia_manutencao_preventiva` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" DROP COLUMN "km_proxima_manutencao",
DROP COLUMN "km_recorrencia_manutencao",
DROP COLUMN "km_ultima_manutencao",
ADD COLUMN     "data_proxima_manutencao_preventiva" INTEGER NOT NULL,
ADD COLUMN     "dia_recorrencia_manutencao_preventiva" INTEGER NOT NULL,
ADD COLUMN     "km_proxima_manutencao_preventiva" INTEGER NOT NULL,
ADD COLUMN     "km_recorrencia_manutencao_preventiva" INTEGER NOT NULL;
