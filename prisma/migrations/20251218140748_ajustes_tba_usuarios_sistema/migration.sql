/*
  Warnings:

  - Made the column `cpf` on table `tba_usuarios_sistema` required. This step will fail if there are existing NULL values in that column.
  - Made the column `setor_id` on table `tba_usuarios_sistema` required. This step will fail if there are existing NULL values in that column.
  - Made the column `empresa_id` on table `tba_usuarios_sistema` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."tba_usuarios_sistema" DROP CONSTRAINT "tba_usuarios_sistema_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tba_usuarios_sistema" DROP CONSTRAINT "tba_usuarios_sistema_setor_id_fkey";

-- AlterTable
ALTER TABLE "tba_usuarios_sistema" ALTER COLUMN "cpf" SET NOT NULL,
ALTER COLUMN "setor_id" SET NOT NULL,
ALTER COLUMN "empresa_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "tba_empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "tba_setores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
