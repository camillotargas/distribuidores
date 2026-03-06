-- CreateTable
CREATE TABLE "tcc_consulta_clientes" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "data_hora_consulta" TIMESTAMP(3) NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "nome_razao_social" TEXT NOT NULL,
    "consta_ocorrencias" BOOLEAN NOT NULL,
    "resultado_consulta" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tcc_consulta_clientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tcc_consulta_clientes" ADD CONSTRAINT "tcc_consulta_clientes_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
