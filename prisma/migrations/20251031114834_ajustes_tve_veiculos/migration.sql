/*
  Warnings:

  - Changed the type of `situacao_manutencao` on the `tve_veiculos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" DROP COLUMN "situacao_manutencao",
ADD COLUMN     "situacao_manutencao" SMALLINT NOT NULL;
