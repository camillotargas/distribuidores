-- CreateTable
CREATE TABLE "tba_empresas" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "inscricao_estadual" TEXT,
    "cnpj" TEXT NOT NULL,
    "cep" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade_id" INTEGER NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "data_cadastro" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tba_empresas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tba_empresas" ADD CONSTRAINT "tba_empresas_cliente_sistema_id_fkey" FOREIGN KEY ("cliente_sistema_id") REFERENCES "tsi_clientes_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tba_empresas" ADD CONSTRAINT "tba_empresas_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "tsi_cidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
