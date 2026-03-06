-- CreateTable
CREATE TABLE "tve_saidas_retornos" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "solicitante_id" INTEGER NOT NULL,
    "data_hora_solicitacao" TIMESTAMP(3) NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "data_hora_prevista_saida" TIMESTAMP(3) NOT NULL,
    "cidade_destino_id" INTEGER NOT NULL,
    "motivo_saida" TEXT NOT NULL,
    "ordem_servico" TEXT,
    "data_hora_prevista_retorno" TIMESTAMP(3) NOT NULL,
    "autorizador_id" INTEGER NOT NULL,
    "autorizado" TEXT,
    "data_hora_autorizacao" TIMESTAMP(3),
    "observacoes_autorizacao" TEXT,
    "porteiro_saida_id" INTEGER,
    "data_hora_saida" TIMESTAMP(3),
    "km_saida" INTEGER,
    "observacoes_saida" TEXT,
    "porteiro_retorno_id" INTEGER,
    "data_hora_retorno" TIMESTAMP(3),
    "km_retorno" INTEGER,
    "observacoes_retorno" TEXT,
    "situacao" SMALLINT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tve_saidas_retornos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_saidas_retornos" ADD CONSTRAINT "tve_saidas_retornos_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "tve_veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
