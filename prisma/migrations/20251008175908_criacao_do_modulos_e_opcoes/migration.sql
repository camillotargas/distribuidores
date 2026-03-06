-- CreateTable
CREATE TABLE "tsi_modulos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "realiza_vendas" TEXT NOT NULL,
    "tem_atendente" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "usuario_sistema_id" INTEGER NOT NULL,
    "usuario_sistema_nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tsi_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tsi_modulos_opcoes" (
    "id" SERIAL NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tsi_modulos_opcoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tsi_modulos_opcoes" ADD CONSTRAINT "tsi_modulos_opcoes_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "tsi_modulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
