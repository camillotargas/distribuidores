/*
  Warnings:

  - You are about to alter the column `direito` on the `tba_direitos_perfis_usuarios_sistema` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "tba_direitos_perfis_usuarios_sistema" ALTER COLUMN "direito" SET DATA TYPE SMALLINT;

-- AddForeignKey
ALTER TABLE "tba_direitos_perfis_usuarios_sistema" ADD CONSTRAINT "tba_direitos_perfis_usuarios_sistema_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "tsi_modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_direitos_perfis_usuarios_sistema" ADD CONSTRAINT "tba_direitos_perfis_usuarios_sistema_opcao_id_fkey" FOREIGN KEY ("opcao_id") REFERENCES "tsi_opcoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
