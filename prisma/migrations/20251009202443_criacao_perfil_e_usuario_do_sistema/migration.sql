-- CreateTable
CREATE TABLE "tba_perfis_usuarios_sistema" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tba_perfis_usuarios_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tba_usuarios_sistema" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "usuario" TEXT,
    "senha" TEXT,
    "perfil_usuario_sistema_id" INTEGER,
    "administrador_sistema" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tba_usuarios_sistema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tba_perfis_usuarios_sistema" ADD CONSTRAINT "tba_perfis_usuarios_sistema_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_usuarios_sistema" ADD CONSTRAINT "tba_usuarios_sistema_perfil_usuario_sistema_id_fkey" FOREIGN KEY ("perfil_usuario_sistema_id") REFERENCES "tba_perfis_usuarios_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
