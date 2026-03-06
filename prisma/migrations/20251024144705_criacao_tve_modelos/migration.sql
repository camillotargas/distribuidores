-- CreateTable
CREATE TABLE "tve_modelos" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tve_modelos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_modelos" ADD CONSTRAINT "tve_modelos_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_modelos" ADD CONSTRAINT "tve_modelos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "tve_marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
