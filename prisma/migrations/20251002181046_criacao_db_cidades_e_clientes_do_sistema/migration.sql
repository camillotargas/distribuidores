-- CreateTable
CREATE TABLE "tsi_cidades" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "estado_nome" TEXT NOT NULL,
    "estado_sigla" TEXT NOT NULL,

    CONSTRAINT "tsi_cidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tsi_clientes_sistema" (
    "id" SERIAL NOT NULL,
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
    "valor_mensal" DECIMAL(10,2) NOT NULL,
    "data_primeira_mensalidade" DATE NOT NULL,
    "dia_cobranca" INTEGER NOT NULL,
    "data_fim_licenca" DATE NOT NULL,
    "data_cadastro" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tsi_clientes_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tsi_clientes_sistema_cnpj_key" ON "tsi_clientes_sistema"("cnpj");

-- AddForeignKey
ALTER TABLE "tsi_clientes_sistema" ADD CONSTRAINT "tsi_clientes_sistema_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "tsi_cidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
