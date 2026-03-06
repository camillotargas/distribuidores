/*
  Warnings:

  - You are about to alter the column `dia_recorrencia_manutencao_preventiva` on the `tve_veiculos` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Changed the type of `data_proxima_manutencao_preventiva` on the `tve_veiculos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" DROP COLUMN "data_proxima_manutencao_preventiva",
ADD COLUMN     "data_proxima_manutencao_preventiva" DATE NOT NULL,
ALTER COLUMN "dia_recorrencia_manutencao_preventiva" SET DATA TYPE SMALLINT;
