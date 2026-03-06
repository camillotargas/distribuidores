-- CreateTable
CREATE TABLE "tba_direitos_perfis_usuarios_sistema" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "perfil_usuario_sistema_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "opcao_id" INTEGER NOT NULL,
    "direito" INTEGER NOT NULL,

    CONSTRAINT "tba_direitos_perfis_usuarios_sistema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tba_direitos_perfis_usuarios_sistema" ADD CONSTRAINT "tba_direitos_perfis_usuarios_sistema_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_direitos_perfis_usuarios_sistema" ADD CONSTRAINT "tba_direitos_perfis_usuarios_sistema_perfil_usuario_sistem_fkey" FOREIGN KEY ("perfil_usuario_sistema_id") REFERENCES "tba_perfis_usuarios_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
