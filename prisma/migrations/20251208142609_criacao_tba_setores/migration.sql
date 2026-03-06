-- CreateTable
CREATE TABLE "tba_setores" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tba_setores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tba_setores" ADD CONSTRAINT "tba_setores_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_setores" ADD CONSTRAINT "tba_setores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "tba_empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
