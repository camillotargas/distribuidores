/*
  Warnings:

  - A unique constraint covering the columns `[perfil_usuario_sistema_id,modulo_id,opcao_id]` on the table `tba_direitos_perfis_usuarios_sistema` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tba_direitos_perfis_usuarios_sistema_perfil_usuario_sistema_key" ON "tba_direitos_perfis_usuarios_sistema"("perfil_usuario_sistema_id", "modulo_id", "opcao_id");
