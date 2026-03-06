/*
  Warnings:

  - Added the required column `id_consulta` to the `tcc_consulta_clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tcc_consulta_clientes" ADD COLUMN     "id_consulta" INTEGER NOT NULL;
