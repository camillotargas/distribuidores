-- CreateTable
CREATE TABLE "tve_manutencoes" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "tipo" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "memorando" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tve_manutencoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_veiculos" ADD CONSTRAINT "tve_veiculos_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_manutencoes" ADD CONSTRAINT "tve_manutencoes_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_manutencoes" ADD CONSTRAINT "tve_manutencoes_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "tve_veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
