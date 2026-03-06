/*
  Warnings:

  - You are about to drop the column `empresa_id` on the `tba_usuarios_sistema` table. All the data in the column will be lost.
  - You are about to drop the column `tbaEmpresaId` on the `tba_usuarios_sistema` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tba_usuarios_sistema" DROP CONSTRAINT "tba_usuarios_sistema_tbaEmpresaId_fkey";

-- AlterTable
ALTER TABLE "tba_usuarios_sistema" DROP COLUMN "empresa_id",
DROP COLUMN "tbaEmpresaId";
