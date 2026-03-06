/*
  Warnings:

  - Added the required column `data_hora` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_sistema_id` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_sistema_nome` to the `tve_veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tve_veiculos" ADD COLUMN     "data_hora" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuario_sistema_id" INTEGER NOT NULL,
ADD COLUMN     "usuario_sistema_nome" TEXT NOT NULL;
