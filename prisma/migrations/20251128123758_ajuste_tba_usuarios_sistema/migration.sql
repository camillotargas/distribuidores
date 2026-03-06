/*
  Warnings:

  - Made the column `data_hora_cadastro` on table `tba_usuarios_sistema` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tba_usuarios_sistema" ALTER COLUMN "data_hora_cadastro" SET NOT NULL;
