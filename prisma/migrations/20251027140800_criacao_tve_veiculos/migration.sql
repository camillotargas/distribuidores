-- CreateTable
CREATE TABLE "tve_veiculos" (
    "id" SERIAL NOT NULL,
    "cliente_sistema_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "modelo_id" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "ano_fabricacao" SMALLINT NOT NULL,
    "km_atual" INTEGER NOT NULL,
    "km_proxima_manutencao" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "tve_veiculos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tve_veiculos" ADD CONSTRAINT "tve_veiculos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "tba_empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_veiculos" ADD CONSTRAINT "tve_veiculos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "tve_marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tve_veiculos" ADD CONSTRAINT "tve_veiculos_modelo_id_fkey" FOREIGN KEY ("modelo_id") REFERENCES "tve_marcas_modelos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
