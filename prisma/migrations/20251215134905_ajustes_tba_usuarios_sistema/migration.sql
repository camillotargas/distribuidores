/*
  Warnings:

  - You are about to drop the column `teste` on the `tba_usuarios_sistema` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tba_usuarios_sistema" DROP CONSTRAINT "tba_usuarios_sistema_empresa_id_fkey";

-- AlterTable
ALTER TABLE "tba_usuarios_sistema" DROP COLUMN "teste",
ADD COLUMN     "tbaEmpresaId" INTEGER;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_tbaEmpresaId_fkey" FOREIGN KEY ("tbaEmpresaId") REFERENCES "tba_empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
